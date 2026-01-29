import { readdir, stat, existsSync, readFileSync } from "node:fs";
import { homedir } from "node:os";
import { join, sep } from "node:path";

// ============================================================================
// TYPES
// ============================================================================

export interface SessionSearchResult {
	/** Chemin complet vers le transcript */
	transcriptPath: string;
	/** Chemin du projet (décodé) */
	projectPath: string;
	/** Session ID (UUID) */
	sessionId: string;
	/** Timestamp de dernière modification */
	lastModified: number;
	/** Méthode utilisée pour trouver */
	source: "payload" | "index" | "scan";
}

export interface SessionIndexEntry {
	sessionId: string;
	fullPath: string;
	fileMtime: number;
	projectPath: string;
}

export interface SessionIndexJson {
	version: number;
	entries: SessionIndexEntry[];
}

// ============================================================================
// CONFIGURATION
// ============================================================================

const PAYLOAD_MAX_AGE_MS = 120000; // 2 minutes
const SESSION_MAX_AGE_MS = 3600000; // 1 heure
const CUTOFF_MINUTES = 5; // Optimisation Solution 1: arrêter au fichier récent trouvé
const CUTOFF_MS = CUTOFF_MINUTES * 60 * 1000;

// ============================================================================
// MAIN ENTRY POINT
// ============================================================================

/**
 * Trouve la session actuelle en utilisant plusieurs stratégies
 *
 * Ordre de priorité:
 * 1. Payload du hook (si récent)
 * 2. sessions-index.json (rapide)
 * 3. Scan de tous les fichiers .jsonl (fallback)
 *
 * @param payload - Payload optionnel du hook
 * @returns SessionSearchResult ou null si aucune session trouvée
 */
export async function findCurrentSession(
	payload?: Partial<HookInputPayload>,
): Promise<SessionSearchResult | null> {
	// STRATÉGIE 1: Utiliser le payload si disponible et valide
	if (payload?.transcript_path) {
		const payloadResult = await validatePayloadSession(payload);
		if (payloadResult) {
			return { ...payloadResult, source: "payload" };
		}
	}

	// STRATÉGIE 2: Chercher via sessions-index.json
	const indexResult = await findSessionViaIndex();
	if (indexResult) {
		return { ...indexResult, source: "index" };
	}

	// STRATÉGIE 3: Scanner tous les fichiers .jsonl
	const scanResult = await findSessionByScanning();
	if (scanResult) {
		return { ...scanResult, source: "scan" };
	}

	return null;
}

// ============================================================================
// STRATEGY 1: PAYLOAD VALIDATION
// ============================================================================

/**
 * Valide que la session du payload est actuelle
 */
async function validatePayloadSession(
	payload: Partial<HookInputPayload>,
): Promise<Omit<SessionSearchResult, "source"> | null> {
	if (!payload.transcript_path) return null;

	// Vérifier que le fichier existe
	if (!existsSync(payload.transcript_path)) {
		return null;
	}

	// Vérifier que le fichier est récent (< 2 minutes)
	const stats = await statAsync(payload.transcript_path);
	const age = Date.now() - stats.mtimeMs;

	if (age > PAYLOAD_MAX_AGE_MS) {
		return null; // Trop vieux, probablement pas la session actuelle
	}

	// Extraire le projectPath du transcriptPath
	// Format Windows: ~/.claude/projects/C--Users-Yanis-Projects-smite/uuid.jsonl
	// Format Unix: ~/.claude/projects/C--Users-Yanis-Projects-smite/uuid.jsonl
	const match = payload.transcript_path.match(
		/\\.claude[\\/](projects|session-env)[\\/]([^\\/]+)[\\/]/,
	);

	if (!match) {
		return null;
	}

	const encodedPath = match[2];
	const projectPath = decodeProjectPath(encodedPath);
	const sessionId = extractSessionId(payload.transcript_path);

	return {
		transcriptPath: payload.transcript_path,
		projectPath,
		sessionId,
		lastModified: stats.mtimeMs,
	};
}

// ============================================================================
// STRATEGY 2: INDEX-BASED SEARCH (PRIORITY 1)
// ============================================================================

/**
 * Cherche la session actuelle via sessions-index.json
 *
 * Cette méthode est plus rapide car les index contiennent déjà
 * les fileMtime précalculés.
 */
async function findSessionViaIndex(): Promise<Omit<SessionSearchResult, "source"> | null> {
	const claudeHome = getClaudeHome();
	const projectsDir = join(claudeHome, "projects");

	if (!existsSync(projectsDir)) {
		return null;
	}

	let mostRecent: {
		transcriptPath: string;
		projectPath: string;
		sessionId: string;
		fileMtime: number;
	} | null = null;

	// Parcourir tous les dossiers de projets
	const projectDirs = await readdirAsync(projectsDir, { withFileTypes: true });

	for (const projectDir of projectDirs) {
		if (!projectDir.isDirectory()) continue;

		const indexPath = join(projectsDir, projectDir.name, "sessions-index.json");

		if (!existsSync(indexPath)) continue;

		try {
			const indexContent = readFileSync(indexPath, "utf-8");
			const index = JSON.parse(indexContent) as SessionIndexJson;

			// Parcourir les entrées
			for (const entry of index.entries || []) {
				if (!entry.fullPath || !entry.fileMtime) continue;

				// Vérifier que le fichier existe toujours
				if (!existsSync(entry.fullPath)) continue;

				// Filtrer: seulement les sessions récentes (< 1 heure)
				const age = Date.now() - entry.fileMtime;
				if (age > SESSION_MAX_AGE_MS) continue;

				if (!mostRecent || entry.fileMtime > mostRecent.fileMtime) {
					mostRecent = {
						transcriptPath: entry.fullPath,
						projectPath: entry.projectPath || decodeProjectPath(projectDir.name),
						sessionId: entry.sessionId || extractSessionId(entry.fullPath),
						fileMtime: entry.fileMtime,
					};
				}
			}
		} catch {
			// Ignorer les erreurs de lecture
			continue;
		}
	}

	if (!mostRecent) return null;

	return {
		transcriptPath: mostRecent.transcriptPath,
		projectPath: mostRecent.projectPath,
		sessionId: mostRecent.sessionId,
		lastModified: mostRecent.fileMtime,
	};
}

// ============================================================================
// STRATEGY 3: SCAN FALLBACK (WITH OPTIMIZATION)
// ============================================================================

/**
 * Cherche la session actuelle en scannant tous les fichiers .jsonl
 *
 * C'est la méthode de fallback la plus lente mais la plus fiable.
 * OPTIMISATION (Solution 1): Arrête la recherche au premier fichier modifié
 * dans les 5 dernières minutes (c'est probablement la session actuelle).
 */
async function findSessionByScanning(): Promise<Omit<SessionSearchResult, "source"> | null> {
	const claudeHome = getClaudeHome();
	const projectsDir = join(claudeHome, "projects");

	if (!existsSync(projectsDir)) {
		return null;
	}

	let mostRecent: {
		path: string;
		mtime: number;
		projectPath: string;
		sessionId: string;
	} | null = null;

	const cutoffTime = Date.now() - CUTOFF_MS;

	// Parcourir tous les dossiers de projets
	const projectDirs = await readdirAsync(projectsDir, { withFileTypes: true });

	for (const projectDir of projectDirs) {
		if (!projectDir.isDirectory()) continue;

		const projectFolder = join(projectsDir, projectDir.name);

		// Lister les fichiers .jsonl dans ce dossier de projet
		const files = await listJsonlFiles(projectFolder);

		for (const file of files) {
			const fullPath = join(projectFolder, file);

			try {
				const stats = await statAsync(fullPath);
				const mtime = stats.mtimeMs;

				// Filtrer: seulement les fichiers récents (< 1 heure)
				const age = Date.now() - mtime;
				if (age > SESSION_MAX_AGE_MS) continue;

				// Extraire projectPath du chemin
				const projectPath = decodeProjectPath(projectDir.name);
				const sessionId = file.replace(".jsonl", "");

				if (!mostRecent || mtime > mostRecent.mtime) {
					mostRecent = {
						path: fullPath,
						mtime,
						projectPath,
						sessionId,
					};

					// OPTIMISATION (Solution 1): Si on trouve un fichier modifié
					// dans les 5 dernières minutes, on considère que c'est la session
					// actuelle et on arrête la recherche immédiatement
					if (mtime > cutoffTime) {
						return {
							transcriptPath: fullPath,
							projectPath,
							sessionId,
							lastModified: mtime,
						};
					}
				}
			} catch {
				// Ignorer les erreurs
			}
		}
	}

	if (!mostRecent) return null;

	return {
		transcriptPath: mostRecent.path,
		projectPath: mostRecent.projectPath,
		sessionId: mostRecent.sessionId,
		lastModified: mostRecent.mtime,
	};
}

// ============================================================================
// UTILITIES
// ============================================================================

/**
 * Décode un chemin de projet encodé par Claude Code
 *
 * Encodage: C--Users-Yanis-Projects-smite
 * Décode:  C:\Users\Yanis\Projects\smite
 */
function decodeProjectPath(encoded: string): string {
	// Le premier segment était le lecteur (ex: C)
	// Remplacer les - par \ et restaurer le :
	const segments = encoded.split("-");

	if (segments.length >= 2 && /^[a-zA-Z]$/.test(segments[0])) {
		// Format: C--Users-... -> C:\Users\...
		const drive = segments[0] + ":";
		const rest = segments.slice(1).join(sep);
		return drive + sep + rest;
	}

	// Fallback: remplacer - par le séparateur système
	return encoded.replace(/-/g, sep);
}

/**
 * Extrait l'ID de session depuis un chemin de transcript
 */
function extractSessionId(transcriptPath: string): string {
	const parts = transcriptPath.split(/[/\\]/);
	const filename = parts[parts.length - 1] || "";
	return filename.replace(".jsonl", "");
}

/**
 * Obtient le chemin du dossier Claude de manière multi-plateforme
 */
function getClaudeHome(): string {
	return join(homedir(), ".claude");
}

/**
 * Liste tous les fichiers .jsonl dans un dossier
 */
async function listJsonlFiles(dir: string): Promise<string[]> {
	try {
		const entries = await readdirAsync(dir, { withFileTypes: true });
		return entries
			.filter((e) => e.isFile() && e.name.endsWith(".jsonl"))
			.map((e) => e.name);
	} catch {
		return [];
	}
}

// ============================================================================
// ASYNC WRAPPERS
// ============================================================================

interface Dirent {
	isDirectory: () => boolean;
	isFile: () => boolean;
	name: string;
}

function readdirAsync(
	path: string,
	options?: { withFileTypes?: boolean },
): Promise<Dirent[]> {
	return new Promise((resolve, reject) => {
		readdir(path, options ?? {}, (err, files) => {
			if (err) reject(err);
			else resolve(files as Dirent[]);
		});
	});
}

function statAsync(path: string): Promise<{ mtimeMs: number }> {
	return new Promise((resolve, reject) => {
		stat(path, (err, stats) => {
			if (err) reject(err);
			else resolve({ mtimeMs: stats.mtimeMs });
		});
	});
}

// ============================================================================
// TYPES FOR HOOK INPUT
// ============================================================================

interface HookInputPayload {
	session_id: string;
	transcript_path: string;
	cwd: string;
	model: {
		id: string;
		display_name: string;
	};
	workspace: {
		current_dir: string;
		project_dir: string;
	};
	version: string;
	output_style: {
		name: string;
	};
	cost: {
		total_cost_usd: number;
		total_duration_ms: number;
		total_api_duration_ms: number;
		total_lines_added: number;
		total_lines_removed: number;
	};
	context_window?: {
		total_input_tokens: number;
		total_output_tokens: number;
		context_window_size: number;
		current_usage?: {
			input_tokens: number;
			output_tokens: number;
			cache_creation_input_tokens?: number;
			cache_read_input_tokens?: number;
		};
	};
}
