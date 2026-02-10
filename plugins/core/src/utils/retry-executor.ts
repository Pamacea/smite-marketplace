import { RetryPolicy, RetryPresets } from './retry-types';

export class RetryError extends Error {
  constructor(message: string, public originalError: Error, public attempts: number) {
    super(message);
    this.name = 'RetryError';
  }
}

export class RetryExecutor {
  constructor(private policy: RetryPolicy = RetryPresets.standard) {}

  async execute<T>(operation: () => Promise<T>, isRetryable?: (error: Error) => boolean): Promise<T> {
    let lastError: Error;

    for (let attempt = 1; attempt <= this.policy.maxAttempts; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error as Error;
        if (!isRetryable?.(lastError) ?? !this.isRetryable(lastError)) break;
        if (attempt >= this.policy.maxAttempts) break;

        const delay = this.calculateDelay(attempt);
        await this.sleep(delay);
      }
    }

    throw new RetryError(`Failed after ${this.policy.maxAttempts} attempts`, lastError!, this.policy.maxAttempts);
  }

  private calculateDelay(attempt: number): number {
    if (this.policy.backoff === 'immediate') return 0;
    let delay = this.policy.backoff === 'exponential'
      ? this.policy.initialDelay * Math.pow(2, attempt - 1)
      : this.policy.initialDelay;
    delay = Math.min(delay, this.policy.maxDelay);
    if (this.policy.jitter) delay *= 0.5 + Math.random() * 0.5;
    return Math.round(delay);
  }

  private isRetryable(error: Error): boolean {
    return /timeout|network|503|502|429/i.test(error.message);
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export async function executeWithRetry<T>(operation: () => Promise<T>, policy?: Partial<RetryPolicy>): Promise<T> {
  const executor = new RetryExecutor(policy ? { ...RetryPresets.standard, ...policy } : RetryPresets.standard);
  return executor.execute(operation);
}
