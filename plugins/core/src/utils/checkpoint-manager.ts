/**
 * Checkpoint Manager - SMITE v1.6.0
 * Manages execution state persistence and recovery
 */

import { promises as fs } from 'fs';
import { join } from 'path';
import {
  Checkpoint,
  CheckpointMetadata,
  CheckpointOptions,
  ExecutionState,
  FailedStory,
  ResumeOptions,
  SaveOptions,
} from './checkpoint-types';
import { SmiteError } from './error';

export class CheckpointManager {
  private checkpointDir: string;
  private options: Required<CheckpointOptions>;

  constructor(options: CheckpointOptions = {}) {
    this.checkpointDir = options.checkpointDir || '.smite/checkpoints';
    this.options = {
      autoSave: options.autoSave ?? true,
      saveInterval: options.saveInterval || 30000,
      checkpointDir: this.checkpointDir,
    };
  }

  async save(state: ExecutionState, metadata: CheckpointMetadata, options: SaveOptions = {}): Promise<void> {
    const { compress = false, include_context = true, max_context_size = 10000 } = options;

    const checkpoint: Checkpoint = {
      run_id: state.runId,
      timestamp: new Date().toISOString(),
      current_batch: state.currentBatch,
      completed_user_stories: Array.from(state.completedUserStories),
      failed_user_stories: Array.from(state.failedUserStories.values()),
      context: include_context ? this.serializeContext(state.context, max_context_size) : {},
      metadata,
    };

    await this.ensureDir();
    const filepath = join(this.checkpointDir, 'checkpoint.json');
    await fs.writeFile(filepath, JSON.stringify(checkpoint, null, 2), 'utf-8');
  }

  async load(runId?: string): Promise<Checkpoint | null> {
    await this.ensureDir();
    const filepath = join(this.checkpointDir, 'checkpoint.json');

    try {
      const data = await fs.readFile(filepath, 'utf-8');
      const checkpoint: Checkpoint = JSON.parse(data);
      if (runId && checkpoint.run_id !== runId) return null;
      return checkpoint;
    } catch { return null; }
  }

  async resume(checkpoint: Checkpoint, options: ResumeOptions = {}): Promise<ExecutionState> {
    const { validate = true, restore_context = true } = options;
    if (validate) this.validateCheckpoint(checkpoint);

    return {
      runId: checkpoint.run_id,
      currentBatch: checkpoint.current_batch,
      completedUserStories: new Set(checkpoint.completed_user_stories),
      failedUserStories: new Map(checkpoint.failed_user_stories.map((fs) => [fs.id, fs])),
      context: restore_context ? new Map(Object.entries(checkpoint.context)) : new Map(),
      retryCounters: new Map(),
      startedAt: new Date(checkpoint.timestamp),
    };
  }

  async exists(): Promise<boolean> {
    try {
      await fs.access(join(this.checkpointDir, 'checkpoint.json'));
      return true;
    } catch { return false; }
  }

  async clear(): Promise<void> {
    try { await fs.unlink(join(this.checkpointDir, 'checkpoint.json')); } catch {}
  }

  private serializeContext(context: Map<string, unknown>, maxSize: number): Record<string, unknown> {
    const serialized: Record<string, unknown> = {};
    let totalSize = 0;
    for (const [key, value] of context.entries()) {
      const strValue = JSON.stringify(value);
      if (totalSize + strValue.length > maxSize) {
        serialized[key] = '[truncated]';
        break;
      }
      serialized[key] = value;
      totalSize += strValue.length;
    }
    return serialized;
  }

  private async ensureDir(): Promise<void> {
    await fs.mkdir(this.checkpointDir, { recursive: true });
  }

  private validateCheckpoint(checkpoint: Checkpoint): void {
    if (!checkpoint.run_id || !checkpoint.timestamp) {
      throw new SmiteError('Invalid checkpoint: missing required fields');
    }
  }
}

export function createExecutionState(runId?: string): ExecutionState {
  return {
    runId: runId || `run-${new Date().toISOString().replace(/[:.]/g, '-')}-${Math.random().toString(36).substring(2, 8)}`,
    currentBatch: 0,
    completedUserStories: new Set(),
    failedUserStories: new Map(),
    context: new Map(),
    retryCounters: new Map(),
    startedAt: new Date(),
  };
}
