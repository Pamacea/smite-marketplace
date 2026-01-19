/**
 * Documentation Trigger Logic
 * Determines which documentation tools to call based on file changes
 */

import type { ValidationIssue } from "./types.js";
import type { MCPClient } from "./mcp-client.js";

export interface DocTriggerConfig {
  enabled: boolean;
  triggers: {
    openAPI: {
      enabled: boolean;
      filePatterns: string[];
      frameworks: string[];
    };
    readme: {
      enabled: boolean;
      filePatterns: string[];
    };
    jsdoc: {
      enabled: boolean;
      filePatterns: string[];
    };
  };
  serverPath: string;
}

export interface TriggerContext {
  projectPath: string;
  changedFiles: string[];
  validatedFiles: string[];
  issues: ValidationIssue[];
}

export interface DocumentationAction {
  toolName: string;
  params: Record<string, unknown>;
  reason: string;
}

/**
 * Determines which MCP documentation tools to trigger based on file changes
 */
export class DocTrigger {
  private config: DocTriggerConfig;
  private mcpClient: MCPClient | null = null;

  constructor(config: DocTriggerConfig) {
    this.config = config;
  }

  /**
   * Set the MCP client (called after client is connected)
   */
  setMCPClient(client: MCPClient): void {
    this.mcpClient = client;
  }

  /**
   * Analyze file changes and determine which documentation tools to trigger
   */
  async analyzeTriggers(context: TriggerContext): Promise<DocumentationAction[]> {
    if (!this.config.enabled) {
      console.error("[DocTrigger] Documentation triggers disabled");
      return [];
    }

    console.error(
      `[DocTrigger] Analyzing ${context.changedFiles.length} changed files for documentation triggers`
    );

    const actions: DocumentationAction[] = [];
    const changedFiles = context.changedFiles;

    // Check for OpenAPI sync triggers
    if (this.config.triggers.openAPI.enabled) {
      const openAPITrigger = this.checkOpenAPITrigger(changedFiles, context);
      if (openAPITrigger) {
        actions.push(openAPITrigger);
      }
    }

    // Check for README update triggers
    if (this.config.triggers.readme.enabled) {
      const readmeTrigger = this.checkReadmeTrigger(changedFiles, context);
      if (readmeTrigger) {
        actions.push(readmeTrigger);
      }
    }

    // Check for JSDoc generation triggers
    if (this.config.triggers.jsdoc.enabled) {
      const jsdocTrigger = this.checkJSDocTrigger(changedFiles, context);
      if (jsdocTrigger) {
        actions.push(jsdocTrigger);
      }
    }

    console.error(
      `[DocTrigger] Found ${actions.length} documentation actions to trigger`
    );

    return actions;
  }

  /**
   * Check if OpenAPI spec sync should be triggered
   */
  private checkOpenAPITrigger(
    changedFiles: string[],
    context: TriggerContext
  ): DocumentationAction | null {
    const patterns = this.config.triggers.openAPI.filePatterns;

    // Check if any changed files match route file patterns
    const matchingFiles = changedFiles.filter((file) =>
      patterns.some((pattern) => this.matchesPattern(file, pattern))
    );

    if (matchingFiles.length === 0) {
      return null;
    }

    console.error(
      `[DocTrigger] OpenAPI sync triggered by ${matchingFiles.length} route file(s)`
    );

    return {
      toolName: "sync_openapi_spec",
      params: {
        projectPath: context.projectPath,
        frameworks: this.config.triggers.openAPI.frameworks,
        generateDiff: false,
        force: false,
      },
      reason: `Route files changed: ${matchingFiles.join(", ")}`,
    };
  }

  /**
   * Check if README architecture update should be triggered
   */
  private checkReadmeTrigger(
    changedFiles: string[],
    context: TriggerContext
  ): DocumentationAction | null {
    const patterns = this.config.triggers.readme.filePatterns;

    // Check if any changed files match library/core module patterns
    const matchingFiles = changedFiles.filter((file) =>
      patterns.some((pattern) => this.matchesPattern(file, pattern))
    );

    if (matchingFiles.length === 0) {
      return null;
    }

    console.error(
      `[DocTrigger] README update triggered by ${matchingFiles.length} module file(s)`
    );

    return {
      toolName: "update_readme_architecture",
      params: {
        projectPath: context.projectPath,
        includeDependencies: true,
        includeExports: true,
        format: "markdown",
      },
      reason: `Core modules changed: ${matchingFiles.join(", ")}`,
    };
  }

  /**
   * Check if JSDoc generation should be triggered
   */
  private checkJSDocTrigger(
    changedFiles: string[],
    context: TriggerContext
  ): DocumentationAction | null {
    const patterns = this.config.triggers.jsdoc.filePatterns;

    // Check if any changed files match TypeScript/JavaScript file patterns
    const matchingFiles = changedFiles.filter((file) =>
      patterns.some((pattern) => this.matchesPattern(file, pattern))
    );

    if (matchingFiles.length === 0) {
      return null;
    }

    console.error(
      `[DocTrigger] JSDoc generation triggered by ${matchingFiles.length} source file(s)`
    );

    return {
      toolName: "generate_jsdoc_on_fly",
      params: {
        projectPath: context.projectPath,
        targetFiles: matchingFiles,
        outputStrategy: "inline",
        verbose: false,
      },
      reason: `Source files changed: ${matchingFiles.join(", ")}`,
    };
  }

  /**
   * Execute documentation actions via MCP client
   */
  async executeActions(actions: DocumentationAction[]): Promise<void> {
    if (!this.mcpClient) {
      console.error("[DocTrigger] MCP client not available, skipping execution");
      return;
    }

    console.error(
      `[DocTrigger] Executing ${actions.length} documentation action(s)`
    );

    for (const action of actions) {
      try {
        console.error(
          `[DocTrigger] Executing ${action.toolName}: ${action.reason}`
        );

        const result = await this.mcpClient.callTool(action.toolName, action.params);

        if (result.success) {
          console.error(
            `[DocTrigger] ✓ ${action.toolName} succeeded:`,
            result.result
          );
        } else {
          console.error(
            `[DocTrigger] ✗ ${action.toolName} failed: ${result.error}`
          );
        }
      } catch (error) {
        // Non-blocking: log error but continue with other actions
        console.error(
          `[DocTrigger] ✗ ${action.toolName} threw error:`,
          error
        );
      }
    }

    console.error("[DocTrigger] All documentation actions completed");
  }

  /**
   * Check if a file path matches a glob pattern
   * Simplified implementation - could use fast-glob in production
   */
  private matchesPattern(filePath: string, pattern: string): boolean {
    // Convert glob pattern to regex
    const regexPattern = pattern
      .replace(/\*/g, ".*")
      .replace(/\?/g, ".");
    const regex = new RegExp(regexPattern);
    return regex.test(filePath);
  }
}

/**
 * Create default documentation trigger configuration
 */
export function createDefaultDocTriggerConfig(
  serverPath: string
): DocTriggerConfig {
  return {
    enabled: true,
    triggers: {
      openAPI: {
        enabled: true,
        filePatterns: [
          "**/routes/**/*.ts",
          "**/api/**/*.ts",
          "**/controllers/**/*.ts",
          "**/pages/api/**/*.ts",
        ],
        frameworks: ["express", "nextjs"],
      },
      readme: {
        enabled: true,
        filePatterns: [
          "**/src/**/*.ts",
          "**/lib/**/*.ts",
          "**/core/**/*.ts",
          "package.json",
        ],
      },
      jsdoc: {
        enabled: true,
        filePatterns: [
          "**/*.ts",
          "**/*.tsx",
          "**/*.js",
          "**/*.jsx",
        ],
      },
    },
    serverPath,
  };
}
