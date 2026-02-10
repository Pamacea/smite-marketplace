/**
 * Checkpoint Types - SMITE v1.6.0
 * Inspired by Attractor checkpoint system
 */

export interface Checkpoint {
  run_id: string
  timestamp: string
  current_batch: number
  completed_user_stories: string[]
  failed_user_stories: FailedStory[]
  context: Record<string, unknown>
  metadata: CheckpointMetadata
}

export interface FailedStory {
  id: string
  reason: string
  timestamp: string
  retry_count: number
}

export interface CheckpointMetadata {
  total_stories: number
  prd_path: string
  smite_version: string
  branch?: string
  commit_hash?: string
}

export interface ExecutionState {
  runId: string
  currentBatch: number
  completedUserStories: Set<string>
  failedUserStories: Map<string, FailedStory>
  context: Map<string, unknown>
  retryCounters: Map<string, number>
  startedAt: Date
}

export interface SaveOptions {
  compress?: boolean
  include_context?: boolean
  max_context_size?: number
}

export interface ResumeOptions {
  validate?: boolean
  restore_context?: boolean
}

export interface CheckpointOptions {
  autoSave?: boolean
  saveInterval?: number
  checkpointDir?: string
}
