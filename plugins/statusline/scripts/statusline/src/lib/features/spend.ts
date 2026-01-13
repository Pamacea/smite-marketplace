import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { existsSync } from "node:fs";
import type { HookInput } from "../types.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const DB_PATH = join(__dirname, "..", "..", "..", "data", "spend.db");

// Dynamic import cache
let Database: typeof import("better-sqlite3").default | null = null;
let dbChecked = false;

async function getDatabase(): Promise<typeof Database> {
  if (!dbChecked) {
    dbChecked = true;
    try {
      const module = await import("better-sqlite3");
      Database = module.default;
    } catch {
      // better-sqlite3 not available
    }
  }
  return Database;
}

/**
 * Initialize SQLite database for spend tracking
 */
async function initDb() {
  const DB = await getDatabase();
  if (!DB) {
    throw new Error("better-sqlite3 not available");
  }

  const db = new DB(DB_PATH);

  db.exec(`
    CREATE TABLE IF NOT EXISTS sessions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
      period_id TEXT,
      cost_usd REAL,
      duration_ms REAL,
      tokens INTEGER,
      model_name TEXT
    )
  `);

  return db;
}

/**
 * Save session data to database
 */
export async function saveSessionV2(
  input: HookInput,
  periodId: string | null
): Promise<void> {
  const DB = await getDatabase();
  if (!DB) {
    return;
  }

  try {
    const db = await initDb();

    const stmt = db.prepare(`
      INSERT INTO sessions (period_id, cost_usd, duration_ms, tokens, model_name)
      VALUES (?, ?, ?, ?, ?)
    `);

    // Calculate total tokens from all available token types
    const tokens =
      (input.context_window?.current_usage?.input_tokens || 0) +
      (input.context_window?.current_usage?.cache_creation_input_tokens || 0) +
      (input.context_window?.current_usage?.cache_read_input_tokens || 0);

    stmt.run(
      periodId,
      input.cost.total_cost_usd,
      input.cost.total_duration_ms,
      tokens,
      input.model.display_name
    );

    db.close();
  } catch {
    // Database error - ignore silently
  }
}

/**
 * Execute a simple SUM query on the database
 */
async function executeSumQuery(sql: string, params: unknown[] = []): Promise<number> {
  const DB = await getDatabase();
  if (!DB || !existsSync(DB_PATH)) {
    return 0;
  }

  try {
    const db = new DB(DB_PATH);
    const stmt = db.prepare(sql);
    const result = stmt.get(...params) as { total: number } | undefined;
    db.close();
    return result?.total || 0;
  } catch {
    return 0;
  }
}

/**
 * Get total cost for a specific period
 */
export async function getPeriodCost(periodId: string): Promise<number> {
  return executeSumQuery(
    "SELECT SUM(cost_usd) as total FROM sessions WHERE period_id = ?",
    [periodId]
  );
}

/**
 * Get today's total cost
 */
export async function getTodayCostV2(): Promise<number> {
  return executeSumQuery(`
    SELECT SUM(cost_usd) as total
    FROM sessions
    WHERE DATE(timestamp) = DATE('now')
  `);
}
