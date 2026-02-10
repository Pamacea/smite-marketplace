/**
 * Goal Gates - SMITE v1.6.0
 */

export interface GoalGate {
  storyId: string;
  mustSucceed: boolean;
  retryTarget?: string;
  fallbackRetryTarget?: string;
}

export class GoalGateValidator {
  private gates: Map<string, GoalGate> = new Map();

  registerGate(gate: GoalGate): void {
    this.gates.set(gate.storyId, gate);
  }

  validateGate(storyId: string, outcome: 'success' | 'fail'): { valid: boolean; retryTarget?: string } {
    const gate = this.gates.get(storyId);
    if (!gate || !gate.mustSucceed) return { valid: true };

    if (outcome === 'success') return { valid: true };

    return {
      valid: false,
      retryTarget: gate.retryTarget || gate.fallbackRetryTarget,
    };
  }

  validateAll(completedStories: Map<string, 'success' | 'fail'>): { valid: boolean; failedGates: string[] } {
    const failedGates: string[] = [];

    for (const [storyId, gate] of this.gates) {
      if (gate.mustSucceed) {
        const outcome = completedStories.get(storyId);
        if (outcome !== 'success') {
          failedGates.push(storyId);
        }
      }
    }

    return {
      valid: failedGates.length === 0,
      failedGates,
    };
  }

  static fromUserStories(stories: Array<{ id: string; goalGate?: boolean; retryTarget?: string }>): GoalGateValidator {
    const validator = new GoalGateValidator();
    for (const story of stories) {
      if (story.goalGate) {
        validator.registerGate({
          storyId: story.id,
          mustSucceed: true,
          retryTarget: story.retryTarget,
        });
      }
    }
    return validator;
  }
}
