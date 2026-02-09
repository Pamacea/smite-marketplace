/**
 * SMITE Git Integration
 *
 * Lightweight git wrapper that generates smart git commands
 * based on SMITE 4-flag system and session context.
 *
 * Does NOT reimplement git - wraps existing git plugins.
 */

import { execSync } from 'child_process';
import * as fs from 'fs/promises';
import * as path from 'path';

/**
 * Git integration configuration
 */
interface GitConfig {
  enabled: boolean;
  defaults: {
    type: string;
    scope: string;
    baseBranch: string;
  };
  conventionalCommits: {
    enabled: boolean;
    types: string[];
    scopes: string[];
  };
  branches: {
    namingConvention: 'conventional' | 'free';
    protectedBranches: string[];
  };
  smiteIntegration: {
    detectFlags: boolean;
    includeSession: boolean;
    autoGenerateMessage: boolean;
  };
}

/**
 * Git command result
 */
interface GitCommandResult {
  command: string;
  description: string;
  executed: boolean;
  output?: string;
  error?: string;
}

/**
 * SMITE Git Integration
 */
export class SmiteGitIntegration {
  private config: GitConfig;
  private smiteFlags: {
    speed?: boolean;
    scale?: boolean;
    quality?: boolean;
    team?: boolean;
  } = {};

  constructor(config?: Partial<GitConfig>) {
    this.config = {
      enabled: true,
      defaults: {
        type: 'chore',
        scope: 'smite',
        baseBranch: 'main',
      },
      conventionalCommits: {
        enabled: true,
        types: ['feat', 'fix', 'refactor', 'docs', 'chore', 'test', 'build'],
        scopes: ['build', 'refactor', 'explore', 'git', 'core', 'studio', 'essentials'],
      },
      branches: {
        namingConvention: 'conventional',
        protectedBranches: ['main', 'master', 'develop'],
      },
      smiteIntegration: {
        detectFlags: true,
        includeSession: true,
        autoGenerateMessage: true,
      },
      ...config,
    };
  }

  /**
   * Set SMITE flags for context-aware command generation
   */
  setFlags(flags: { speed?: boolean; scale?: boolean; quality?: boolean; team?: boolean }): void {
    this.smiteFlags = flags;
  }

  /**
   * Generate smart commit command
   */
  async commit(message?: string, options: { amend?: boolean; noVerify?: boolean } = {}): Promise<GitCommandResult> {
    const commitMessage = message || this.generateCommitMessage();

    const flags = options.amend ? ['--amend'] : [];
    if (options.noVerify) flags.push('--no-verify');

    const command = `git commit ${flags.join(' ')} -m "${commitMessage}"`;

    return {
      command,
      description: 'Create git commit with conventional commit format',
      executed: false,
    };
  }

  /**
   * Generate branch creation command
   */
  async branch(name?: string, type: 'feature' | 'hotfix' | 'bugfix' = 'feature'): Promise<GitCommandResult> {
    const branchName = name || this.generateBranchName(type);

    const command = `git checkout -b ${branchName}`;

    return {
      command,
      description: `Create ${type} branch`,
      executed: false,
    };
  }

  /**
   * Generate enhanced status command
   */
  async status(): Promise<GitCommandResult> {
    const command = 'git status';
    const description = 'Show git status with SMITE context';

    try {
      const output = execSync(command, { encoding: 'utf-8' });
      return {
        command,
        description,
        executed: true,
        output: this.formatStatus(output),
      };
    } catch (error) {
      return {
        command,
        description,
        executed: true,
        error: (error as Error).message,
      };
    }
  }

  /**
   * Generate changelog command
   */
  async changelog(): Promise<GitCommandResult> {
    const command = 'git log --pretty=format:"%h %s" $(git describe --tags --abbrev=0)..HEAD';

    try {
      const output = execSync(command, { encoding: 'utf-8' });
      return {
        command,
        description: 'Generate changelog from commits since last tag',
        executed: true,
        output: this.formatChangelog(output),
      };
    } catch (error) {
      return {
        command,
        description,
        executed: true,
        error: (error as Error).message,
      };
    }
  }

  /**
   * Generate version bump command
   */
  async version(bump: 'major' | 'minor' | 'patch' = 'patch'): Promise<GitCommandResult> {
    const command = `npm version ${bump} -m "chore: bump version to %s"`;

    return {
      command,
      description: `Bump ${bump} version and create commit`,
      executed: false,
    };
  }

  /**
   * Generate commit message based on SMITE flags
   */
  private generateCommitMessage(): string {
    if (!this.config.smiteIntegration.detectFlags) {
      return `${this.config.defaults.type}(${this.config.defaults.scope}): updates`;
    }

    // Detect from SMITE flags
    if (this.smiteFlags.speed) {
      return 'chore: quick fix';
    }

    if (this.smiteFlags.scale) {
      return `feat(${this.detectScope()}): implement feature`;
    }

    if (this.smiteFlags.quality) {
      return 'refactor(smite): code improvements';
    }

    if (this.smiteFlags.team) {
      return 'feat(multi-agent): parallel implementation';
    }

    return `${this.config.defaults.type}(${this.config.defaults.scope}): updates`;
  }

  /**
   * Detect commit scope from current context
   */
  private detectScope(): string {
    // TODO: Detect from current working directory or task
    return this.config.defaults.scope;
  }

  /**
   * Generate branch name
   */
  private generateBranchName(type: 'feature' | 'hotfix' | 'bugfix'): string {
    const timestamp = Date.now().toString(36);
    const prefix = type;

    if (this.config.branches.namingConvention === 'conventional') {
      return `${prefix}/${this.detectScope()}-${timestamp}`;
    }

    return `${prefix}-${timestamp}`;
  }

  /**
   * Format git status output with SMITE context
   */
  private formatStatus(output: string): string {
    const lines = output.split('\n');
    const formatted = [
      '# Git Status',
      '',
      ...lines,
      '',
      '## SMITE Context',
      `Current Flags: ${this.formatFlags()}`,
      `Session: ${process.cwd().split('/').pop()}`,
    ];

    return formatted.join('\n');
  }

  /**
   * Format changelog output
   */
  private formatChangelog(output: string): string {
    const commits = output.trim().split('\n');

    const sections = {
      feat: [] as string[],
      fix: [] as string[],
      refactor: [] as string[],
      docs: [] as string[],
      chore: [] as string[],
      test: [] as string[],
      build: [] as string[],
    };

    for (const commit of commits) {
      const match = commit.match(/^([a-z0-9]+)\s+(\w+)\(([^)]+)\):\s+(.+)$/);
      if (match) {
        const [, hash, type, scope, description] = match;
        if (type in sections) {
          (sections[type as keyof typeof sections] as string[]).push(`- ${description} (${hash})`);
        }
      }
    }

    const lines = ['# Changelog', ''];

    for (const [type, items] of Object.entries(sections)) {
      if (items.length > 0) {
        lines.push(`### ${type.charAt(0).toUpperCase() + type.slice(1)}`, '');
        lines.push(...items, '');
      }
    }

    return lines.join('\n');
  }

  /**
   * Format SMITE flags for display
   */
  private formatFlags(): string {
    const flags = [];
    if (this.smiteFlags.speed) flags.push('--speed');
    if (this.smiteFlags.scale) flags.push('--scale');
    if (this.smiteFlags.quality) flags.push('--quality');
    if (this.smiteFlags.team) flags.push('--team');
    return flags.length > 0 ? flags.join(' ') : 'none';
  }

  /**
   * Load configuration from file
   */
  static async loadConfig(): Promise<SmiteGitIntegration> {
    try {
      const configPath = path.join(process.cwd(), '.claude', '.smite', 'git-integration.json');
      const content = await fs.readFile(configPath, 'utf-8');
      const config = JSON.parse(content) as GitConfig;
      return new SmiteGitIntegration(config);
    } catch {
      return new SmiteGitIntegration();
    }
  }
}

/**
 * Git command handler
 */
export async function handleGitCommand(
  action: string,
  args: string[] = []
): Promise<GitCommandResult> {
  const integration = await SmiteGitIntegration.loadConfig();

  switch (action) {
    case 'commit':
      return await integration.commit(args[0]);
    case 'branch':
      return await integration.branch(args[0]);
    case 'status':
      return await integration.status();
    case 'changelog':
      return await integration.changelog();
    case 'version':
      return await integration.version((args[0] as 'major' | 'minor' | 'patch') || 'patch');
    default:
      return {
        command: '',
        description: '',
        executed: false,
        error: `Unknown git action: ${action}`,
      };
  }
}
