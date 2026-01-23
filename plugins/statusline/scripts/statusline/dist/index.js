#!/usr/bin/env bun
import { readFile, writeFile } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { mkdir } from "node:fs/promises";
import { homedir } from "node:os";
// Import core modules
import { defaultConfig, mergeConfig } from "./lib/config.js";
import { getContextData } from "./lib/context.js";
import { TokenTracker } from "./lib/token-tracker.js";
import { colors, formatBranch, formatCost, formatDuration, formatPath, } from "./lib/formatters.js";
import { getGitStatus } from "./lib/git.js";
import { renderStatusline, } from "./lib/render-pure.js";
// Optional feature imports - just delete the folder to disable!
let getUsageLimits = null;
let getPeriodCost = null;
let getTodayCostV2 = null;
let saveSessionV2 = null;
try {
    const limitsModule = await import("./lib/features/limits.js");
    getUsageLimits = limitsModule.getUsageLimits;
}
catch {
    // Limits feature not available - that's OK!
}
try {
    const spendModule = await import("./lib/features/spend.js");
    getPeriodCost = spendModule.getPeriodCost;
    getTodayCostV2 = spendModule.getTodayCostV2;
    saveSessionV2 = spendModule.saveSessionV2;
}
catch {
    // Spend tracking feature not available - that's OK!
}
// Re-export for backwards compatibility
export { renderStatusline, } from "./lib/render-pure.js";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const CONFIG_FILE_PATH = join(__dirname, "..", "statusline.config.json");
const LAST_PAYLOAD_PATH = join(__dirname, "..", "data", "last_payload.txt");
const CACHE_FILE_PATH = join(__dirname, "..", "data", "context_cache.json");
const TOKEN_TRACKER_PATH = join(homedir(), ".claude", ".token-tracker.json");
let contextCache = null;
/**
 * Time-to-live for context info cache.
 * 2 seconds prevents flickering when context calculation methods
 * switch (e.g., from payload to transcript-based).
 */
const CACHE_TTL = 2000;
/**
 * Check if payload tokens are trustworthy for the given transcript path.
 *
 * IMPORTANT: After /clear or /new, the payload contains tokens from the OLD session
 * but the transcriptPath points to the NEW (empty or small) file.
 * In this case, we should NOT trust the payload tokens.
 *
 * We trust the payload ONLY when:
 * 1. The payload transcript path matches the actual transcript path (same session)
 * 2. OR the payload tokens are consistent with the transcript file size
 */
async function shouldTrustPayload(actualTranscriptPath, payloadTranscriptPath, payloadTokens) {
    // Normalize paths for comparison
    const { normalize } = await import("node:path");
    const normalizedActual = normalize(actualTranscriptPath);
    const normalizedPayload = normalize(payloadTranscriptPath);
    // If paths match, payload tokens are for this session - trust them
    if (normalizedActual === normalizedPayload) {
        return { trust: payloadTokens >= 0, reason: "same session" };
    }
    // Paths don't match - this is after /clear or /new
    // The payload tokens are from the OLD session, don't trust them for the new file
    return { trust: false, reason: "session mismatch" };
}
/**
 * Find the actual transcript path, handling /clear command
 * After /clear, the payload contains the old transcript path, but a new one was created
 * This function finds the most recent transcript file
 */
async function findActualTranscriptPath(payloadPath) {
    try {
        const { existsSync, readdirSync, statSync } = await import("node:fs");
        const { join, normalize } = await import("node:path");
        // Get the directory containing transcripts
        const transcriptDir = join(payloadPath, "..");
        if (!existsSync(transcriptDir)) {
            return payloadPath;
        }
        // Normalize payload path for consistent comparison (handles \ vs /)
        const normalizedPayloadPath = normalize(payloadPath);
        // Find all .jsonl files and get the most recent one
        const files = readdirSync(transcriptDir);
        const jsonlFiles = files.filter(f => f.endsWith('.jsonl'));
        let newestFile = null;
        let newestMtime = 0;
        for (const file of jsonlFiles) {
            const filePath = join(transcriptDir, file);
            try {
                const stats = statSync(filePath);
                if (stats.mtimeMs > newestMtime) {
                    newestMtime = stats.mtimeMs;
                    newestFile = filePath;
                }
            }
            catch {
                continue;
            }
        }
        // If the newest file is different from payload, we detected a /clear or /new
        // Use normalized paths for comparison to handle Windows path inconsistencies
        if (newestFile) {
            const normalizedNewestFile = normalize(newestFile);
            if (normalizedNewestFile !== normalizedPayloadPath) {
                // Get stats for comparison (may fail if file was deleted)
                try {
                    const payloadStats = statSync(payloadPath);
                    // If newest file is more than 1 second newer, it's a new session
                    // Reduced from 5s to 1s for faster detection
                    if (newestMtime - payloadStats.mtimeMs > 1000) {
                        return newestFile;
                    }
                }
                catch {
                    // Payload file doesn't exist (was deleted), use newest
                    return newestFile;
                }
            }
        }
        return payloadPath;
    }
    catch (e) {
        return payloadPath;
    }
}
// Dynamic working directory tracking
let currentWorkingDir = null;
/**
 * Extract bash commands from transcript entry content.
 * Handles both <function=Bash> tags and direct command patterns.
 */
function extractBashCommands(entryContent) {
    const bashCommands = [];
    // Try to find Bash tool calls in the content
    const functionMatches = entryContent.match(/<function=Bash>([\s\S]*?)<\/function>/g);
    if (functionMatches) {
        for (const match of functionMatches) {
            // Extract content between the tags
            const innerContent = match.replace(/<\/?function=Bash>/g, "");
            // Look for "command": "..." or just cd
            const commandMatch = innerContent.match(/"command"\s*:\s*"([^"]*cd[^"]*)"/);
            if (commandMatch) {
                bashCommands.push(commandMatch[1]);
            }
            else if (innerContent.includes("cd")) {
                // Fallback: take all content containing cd
                bashCommands.push(innerContent);
            }
        }
    }
    // Also look for direct commands in content (simple case)
    if (bashCommands.length === 0) {
        const directCdMatch = entryContent.match(/(?:^\s*|\n)(cd\s+[^\n]+)/g);
        if (directCdMatch) {
            bashCommands.push(...directCdMatch);
        }
    }
    return bashCommands;
}
/**
 * Extract cd target directory from a command string.
 * Returns null if no valid cd target found.
 */
function extractCdTarget(command) {
    // Normalize the command
    const normalizedCmd = command.replace(/\\'/g, "'").replace(/\\"/g, '"');
    // Look for cd with different patterns
    // Pattern 1: cd && other_command
    // Pattern 2: cd dir
    // Pattern 3: command && cd dir
    const cdPatterns = [
        /(?:^|&&\s*|;\s*)cd\s+([^\s&;]+)/,
        /cd\s+"([^"]+)"/,
        /cd\s+'([^']+)'/,
    ];
    for (const pattern of cdPatterns) {
        const match = normalizedCmd.match(pattern);
        if (match?.[1]) {
            // Clean remaining quotes and return
            return match[1].replace(/^["']|["']$/g, "").trim();
        }
    }
    // Handle "cd &&" case (no argument)
    if (normalizedCmd.includes("cd &&")) {
        return null;
    }
    return null;
}
/**
 * Resolve a target path relative to a base path.
 * Handles absolute paths, relative paths, special cases (.., ~), and normalizes separators.
 */
function resolveTargetPath(targetDir, basePath) {
    // Absolute path
    if (targetDir.startsWith("/") || targetDir.match(/^[A-Za-z]:\\/)) {
        return targetDir;
    }
    // Go up one level
    if (targetDir === "..") {
        const parts = basePath.split(/[/\\]/);
        parts.pop();
        return parts.join("/");
    }
    // Home directory - use workspace home directory
    if (targetDir === "~") {
        const workspaceParts = basePath.split(/[/\\]/);
        return workspaceParts.length >= 2
            ? workspaceParts.slice(0, 2).join("/")
            : basePath;
    }
    // Relative path
    const separator = basePath.includes("/") ? "/" : "\\";
    return basePath + separator + targetDir;
}
/**
 * Parse the transcript to detect directory changes (cd commands)
 * and return the current working directory.
 */
async function trackWorkingDirectory(transcriptPath, initialDir) {
    // Initialize with the initial directory on first run
    if (!currentWorkingDir) {
        currentWorkingDir = initialDir;
    }
    try {
        const content = await readFile(transcriptPath, "utf-8");
        const transcript = JSON.parse(content);
        // Look for recent cd commands in the transcript
        // Only check the last 20 entries to avoid parsing everything
        const recentEntries = transcript.slice(-20);
        for (const entry of recentEntries) {
            // Guard clause: skip non-message entries
            if (entry.type !== "user" && entry.type !== "assistant") {
                continue;
            }
            const entryContent = entry.content || "";
            const bashCommands = extractBashCommands(entryContent);
            // Process each bash command
            for (const cmd of bashCommands) {
                const targetDir = extractCdTarget(cmd);
                if (targetDir) {
                    const basePath = currentWorkingDir || initialDir;
                    currentWorkingDir = resolveTargetPath(targetDir, basePath);
                    // Normalize path (use / everywhere)
                    if (currentWorkingDir) {
                        currentWorkingDir = currentWorkingDir.replace(/\\/g, "/");
                    }
                }
            }
        }
        return currentWorkingDir || initialDir;
    }
    catch {
        // On error, return the initial directory
        return initialDir;
    }
}
async function loadConfig() {
    try {
        const content = await readFile(CONFIG_FILE_PATH, "utf-8");
        const userConfig = JSON.parse(content);
        return mergeConfig(userConfig);
    }
    catch {
        return defaultConfig;
    }
}
async function getContextInfo(input, config, actualTranscriptPath // ✅ Pass actual transcript path for cache key
) {
    const now = Date.now();
    let result;
    // DEBUG: Log what we're receiving
    if (input.context_window) {
    }
    // Absolute priority to payload if available (more accurate)
    // The payload contains total_input_tokens which is the exact session total
    // BUT: after /clear or /new, the payload has tokens from the OLD session
    // So we must verify that the payload corresponds to the current transcript
    let usePayloadContext = config.context.usePayloadContextWindow && !!input.context_window;
    // Check if we should trust the payload data for THIS session
    if (usePayloadContext && input.context_window) {
        const payloadTokens = input.context_window.total_input_tokens || 0;
        const { trust: trustPayload, reason } = await shouldTrustPayload(actualTranscriptPath, input.transcript_path, payloadTokens);
        if (!trustPayload) {
            usePayloadContext = false; // Force fallback to transcript calculation
        }
    }
    if (usePayloadContext && input.context_window) {
        // Try current_usage first (real-time tracking)
        const current = input.context_window.current_usage;
        let tokens = 0;
        let maxTokens = input.context_window.context_window_size || config.context.maxContextTokens;
        if (current) {
            tokens =
                (current.input_tokens || 0) +
                    (current.cache_creation_input_tokens || 0) +
                    (current.cache_read_input_tokens || 0);
        }
        // If current_usage is 0, fall back to total_input_tokens (session total)
        if (tokens === 0 && input.context_window.total_input_tokens) {
            tokens = input.context_window.total_input_tokens;
        }
        // Only use payload context if it has valid data (>0 tokens)
        // Otherwise fall back to transcript-based calculation
        if (tokens > 0) {
            const percentage = Math.min(100, Math.round((tokens / maxTokens) * 100));
            // Calculate base context for display breakdown
            // NOTE: We only count global ~/.claude/ files, NOT workspace .claude/
            let baseContextTokens = 0;
            if (config.context.includeBaseContext && config.context.baseContextPath) {
                try {
                    const { getBaseContextTokens } = await import("./lib/context.js");
                    baseContextTokens = await getBaseContextTokens(config.context.baseContextPath);
                    if (!isFinite(baseContextTokens) || baseContextTokens < 0) {
                        baseContextTokens = 0;
                    }
                }
                catch {
                    baseContextTokens = 0;
                }
            }
            // Estimate transcript: total - base context
            // (payload includes everything, so we reverse-calculate transcript)
            const transcriptTokens = Math.max(0, tokens - baseContextTokens);
            result = {
                tokens,
                percentage,
                lastOutputTokens: null,
                baseContext: baseContextTokens,
                transcriptContext: transcriptTokens,
                userTokens: transcriptTokens // User tokens exclude system/base context
            };
            // Cache only if we have valid data
            // Use actualTranscriptPath as sessionId - it changes with /new and /clear
            contextCache = { timestamp: now, sessionId: actualTranscriptPath, data: result };
            return result;
        }
    }
    // Fallback to transcript ONLY if payload is not available
    // and we don't have recent cache (to avoid jumps 36% → 0%)
    // Extended cache (3x CACHE_TTL = 6 seconds) prevents flickering when:
    // - Payload context is temporarily unavailable
    // - Context is being recalculated
    // - Cache is being invalidated
    // IMPORTANT: Don't use cache if session changed OR tokens are null/0
    // Session is tracked by actualTranscriptPath (changes with /new and /clear)
    if (contextCache &&
        contextCache.sessionId === actualTranscriptPath && // ✅ Check by transcript path
        (now - contextCache.timestamp) < (CACHE_TTL * 3) &&
        contextCache.data.tokens !== null &&
        contextCache.data.tokens > 0) {
        // Keep the cached value for 6 more seconds to avoid jumps
        // This smooths transitions between different context calculation methods
        return contextCache.data;
    }
    const contextData = await getContextData({
        transcriptPath: actualTranscriptPath,
        maxContextTokens: config.context.maxContextTokens,
        autocompactBufferTokens: config.context.autocompactBufferTokens,
        useUsableContextOnly: config.context.useUsableContextOnly,
        overheadTokens: config.context.overheadTokens,
        includeBaseContext: config.context.includeBaseContext,
        baseContextPath: config.context.baseContextPath,
        // NOTE: workspaceDir removed - we don't count project .claude/ in base context
    });
    result = {
        tokens: contextData.tokens,
        percentage: contextData.percentage,
        lastOutputTokens: contextData.lastOutputTokens,
        baseContext: contextData.baseContext,
        transcriptContext: contextData.transcriptContext,
        userTokens: contextData.userTokens,
    };
    // Cache the result (use actualTranscriptPath as sessionId)
    if (contextData.tokens !== null && contextData.percentage !== null) {
        contextCache = { timestamp: now, sessionId: actualTranscriptPath, data: result };
    }
    return result;
}
async function getSpendInfo(currentResetsAt) {
    if (!getPeriodCost || !getTodayCostV2) {
        return {};
    }
    const normalizedPeriodId = currentResetsAt ?? null;
    const periodCost = normalizedPeriodId ? await getPeriodCost(normalizedPeriodId) : 0;
    const todayCost = await getTodayCostV2();
    return { periodCost, todayCost };
}
async function main() {
    try {
        // Read stdin using chunks since Bun.stdin.json() can hang
        const chunks = [];
        for await (const chunk of Bun.stdin.stream()) {
            chunks.push(Buffer.from(chunk));
        }
        const stdinContent = Buffer.concat(chunks).toString();
        const input = JSON.parse(stdinContent);
        // Ensure data directory exists
        const dataDir = dirname(LAST_PAYLOAD_PATH);
        try {
            await mkdir(dataDir, { recursive: true });
        }
        catch {
            // Directory might already exist, that's fine
        }
        // Save last payload for debugging
        await writeFile(LAST_PAYLOAD_PATH, JSON.stringify(input, null, 2));
        // Find the actual transcript path (handles /clear command)
        const actualTranscriptPath = await findActualTranscriptPath(input.transcript_path);
        const config = await loadConfig();
        // Get usage limits (if feature exists)
        const usageLimits = getUsageLimits
            ? await getUsageLimits(config.features.usageLimits)
            : { five_hour: null, seven_day: null };
        const currentResetsAt = usageLimits.five_hour?.resets_at ?? undefined;
        // Save session with current period context (if feature exists)
        if (saveSessionV2) {
            await saveSessionV2(input, currentResetsAt ?? null);
        }
        // Get git status from workspace directory
        const git = await getGitStatus(input.workspace.current_dir);
        const contextInfo = await getContextInfo(input, config, actualTranscriptPath);
        const spendInfo = await getSpendInfo(currentResetsAt);
        // Token tracking
        const currentUsage = contextInfo.tokens || 0;
        // Use actual transcript path as unique session ID (changes with /clear command)
        const sessionId = actualTranscriptPath;
        const tracker = await TokenTracker.load(TOKEN_TRACKER_PATH, currentUsage, sessionId);
        const { diff: tokenDiff, shouldShow: showTokenDiff } = tracker.getCurrentDiff(currentUsage);
        // Detect spurious diffs from base context calculation changes or session resets
        if (tracker.isSpuriousDiff(tokenDiff)) {
            // This is likely a spurious diff - don't show it and reset baseline
            tracker.resetBaseline(currentUsage);
            await tracker.save(TOKEN_TRACKER_PATH);
        }
        else {
            // Normal path: update tracker with actual changes
            tracker.update(currentUsage);
            await tracker.save(TOKEN_TRACKER_PATH);
        }
        // Track the dynamic working directory
        let workingDir = await trackWorkingDirectory(actualTranscriptPath, input.workspace.current_dir);
        // Try to get more accurate current directory from transcript
        // Look for the last bash command with a cwd parameter
        try {
            if (actualTranscriptPath) {
                const transcriptContent = await readFile(actualTranscriptPath, "utf-8");
                const transcript = JSON.parse(transcriptContent);
                // Search backwards for the most recent bash tool use with cwd
                for (let i = transcript.length - 1; i >= 0; i--) {
                    const entry = transcript[i];
                    if (entry.type === "assistant" && entry.content) {
                        // Look for "cwd": "path" in tool uses
                        const cwdMatch = entry.content.match(/"cwd"\s*:\s*"([^"]+)"/);
                        if (cwdMatch && cwdMatch[1]) {
                            workingDir = cwdMatch[1];
                            break;
                        }
                    }
                }
            }
        }
        catch (e) {
            // Use tracked directory if transcript can't be read
        }
        const data = {
            branch: formatBranch(git, config.git),
            dirPath: formatPath(workingDir, config.pathDisplayMode),
            modelName: input.model.display_name,
            sessionCost: formatCost(input.cost.total_cost_usd, config.session.cost.format),
            sessionDuration: formatDuration(input.cost.total_duration_ms),
            contextTokens: contextInfo.tokens,
            contextPercentage: contextInfo.percentage,
            lastOutputTokens: contextInfo.lastOutputTokens,
            tokenDiff: showTokenDiff ? tokenDiff : undefined,
            baseContext: contextInfo.baseContext,
            transcriptContext: contextInfo.transcriptContext,
            userTokens: contextInfo.userTokens,
            ...(getUsageLimits && {
                usageLimits: {
                    five_hour: usageLimits.five_hour
                        ? {
                            utilization: usageLimits.five_hour.utilization,
                            resets_at: usageLimits.five_hour.resets_at,
                        }
                        : null,
                    seven_day: usageLimits.seven_day
                        ? {
                            utilization: usageLimits.seven_day.utilization,
                            resets_at: usageLimits.seven_day.resets_at,
                        }
                        : null,
                },
            }),
            ...((getPeriodCost || getTodayCostV2) && spendInfo),
        };
        const output = renderStatusline(data, config);
        console.log(output);
        // DEBUG: Write debug info to file
        try {
            await writeFile(LAST_PAYLOAD_PATH.replace('.txt', '_debug.txt'), JSON.stringify({
                input_transcript: input.transcript_path,
                actual_transcript: actualTranscriptPath,
                detected_clear: actualTranscriptPath !== input.transcript_path,
                context_tokens: contextInfo.tokens,
                user_tokens: contextInfo.userTokens,
                total_input_tokens: input.context_window?.total_input_tokens,
            }, null, 2));
        }
        catch { }
        if (config.oneLine) {
            console.log("");
        }
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        console.log(`${colors.red}Error:${colors.reset} ${errorMessage}`);
        console.log(`${colors.gray}Check statusline configuration${colors.reset}`);
    }
}
main();
