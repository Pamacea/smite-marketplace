/**
 * PRD to DOT Converter - SMITE v1.6.0
 */

export interface UserStory {
  id: string;
  title: string;
  dependencies: string[];
  goalGate?: boolean;
  retryTarget?: string;
}

export interface PRD {
  project: string;
  userStories: UserStory[];
}

export interface DOTOptions {
  rankdir?: 'TB' | 'LR';
  colorScheme?: 'priority' | 'status' | 'none';
  showGoalGates?: boolean;
}

export function prdToDOT(prd: PRD, options: DOTOptions = {}): string {
  const { rankdir = 'TB', colorScheme = 'priority', showGoalGates = true } = options;
  const lines: string[] = [];
  
  lines.push(`digraph "${prd.project}" {`);
  lines.push(`  rankdir=${rankdir};`);
  lines.push(`  node [shape=box, fontsize=12];`);
  lines.push('');

  for (const story of prd.userStories) {
    const attrs = getNodeAttributes(story, colorScheme, showGoalGates);
    lines.push(`  ${story.id} ${formatAttributes(attrs)};`);
  }

  lines.push('');
  for (const story of prd.userStories) {
    for (const dep of story.dependencies) {
      lines.push(`  ${dep} -> ${story.id};`);
    }
    if (story.retryTarget) {
      lines.push(`  ${story.id} -> ${story.retryTarget} [style=dashed, label="retry", color=red];`);
    }
  }

  lines.push('}');
  return lines.join('\n');
}

function getNodeAttributes(story: UserStory, colorScheme: string, showGoalGates: boolean): Record<string, string> {
  const attrs: Record<string, string> = {
    label: `${story.id}\n${story.title}`,
  };

  if (colorScheme === 'priority') {
    if (story.goalGate && showGoalGates) {
      attrs.fillcolor = 'red';
      attrs.style = 'filled';
    } else if (story.dependencies.length === 0) {
      attrs.fillcolor = 'orange';
      attrs.style = 'filled';
    } else {
      attrs.fillcolor = 'lightblue';
      attrs.style = 'filled';
    }
  }

  if (story.goalGate && showGoalGates) {
    attrs.shape = 'doubleoctagon';
    attrs.penwidth = '2';
  }

  return attrs;
}

function formatAttributes(attrs: Record<string, string>): string {
  const pairs = Object.entries(attrs).map(([k, v]) => `${k}="${v}"`);
  return pairs.length > 0 ? `[${pairs.join(', ')}]` : '';
}
