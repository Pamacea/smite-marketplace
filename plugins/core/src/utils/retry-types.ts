export type BackoffStrategy = 'linear' | 'exponential' | 'immediate' | 'custom';

export interface RetryPolicy {
  maxAttempts: number;
  backoff: BackoffStrategy;
  initialDelay: number;
  maxDelay: number;
  jitter: boolean;
  customDelayFn?: (attempt: number) => number;
}

export const RetryPresets: Record<string, RetryPolicy> = {
  none: { maxAttempts: 1, backoff: 'immediate', initialDelay: 0, maxDelay: 0, jitter: false },
  standard: { maxAttempts: 5, backoff: 'exponential', initialDelay: 200, maxDelay: 60000, jitter: true },
  aggressive: { maxAttempts: 5, backoff: 'exponential', initialDelay: 500, maxDelay: 60000, jitter: true },
  linear: { maxAttempts: 3, backoff: 'linear', initialDelay: 500, maxDelay: 500, jitter: false },
  patient: { maxAttempts: 3, backoff: 'exponential', initialDelay: 2000, maxDelay: 18000, jitter: true },
};
