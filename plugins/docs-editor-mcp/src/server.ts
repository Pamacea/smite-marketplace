/**
 * MCP Server for SMITE Docs Editor
 * Implements Model Context Protocol for documentation tools
 * Following SMITE engineering rules: Clean architecture, Zod validation, Result types
 * 
 * MCP Specification: https://modelcontextprotocol.io/specification/2025-06-18/
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  Tool,
} from '@modelcontextprotocol/sdk/types.js';
import { executeUpdateReadme } from './tools/update-readme.js';

/**
 * Scribe MCP Server
 */
class ScribeMCPServer {
  private server: Server;

  constructor() {
    this.server = new Server(
      {
        name: 'smite-scribe',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.setupHandlers();
  }

  /**
   * Setup request handlers
   */
  private setupHandlers(): void {
    // List available tools
    this.server.setRequestHandler(
      ListToolsRequestSchema,
      async () => ({
        tools: [
          this.getUpdateReadmeTool(),
        ],
      })
    );

    // Handle tool execution
    this.server.setRequestHandler(
      CallToolRequestSchema,
      async (request) => {
        const { name, arguments: args } = request.params;

        try {
          switch (name) {
            case 'update_readme_architecture':
              return await this.handleUpdateReadme(args);

            default:
              throw new Error(`Unknown tool: ${name}`);
          }
        } catch (error) {
          return {
            content: [
              {
                type: 'text',
                text: JSON.stringify({
                  success: false,
                  error: error instanceof Error ? error.message : String(error),
                }),
              },
            ],
            isError: true,
          };
        }
      }
    );
  }

  /**
   * Tool definition: update_readme_architecture
   */
  private getUpdateReadmeTool(): Tool {
    return {
      name: 'update_readme_architecture',
      description: 'Automatically updates README.md sections (Installation, Architecture, Project Structure) based on project structure and dependencies while preserving manual edits.',
      inputSchema: {
        type: 'object',
        properties: {
          projectPath: {
            type: 'string',
            description: 'Root directory of the project',
          },
          readmePath: {
            type: 'string',
            description: 'Path to README.md (default: README.md)',
            default: 'README.md',
          },
          sectionsToUpdate: {
            type: 'array',
            items: {
              type: 'string',
              enum: ['installation', 'architecture', 'structure', 'all'],
            },
            description: 'Which sections to update',
            default: ['all'],
          },
          generateDiff: {
            type: 'boolean',
            description: 'Generate diff preview before applying',
            default: true,
          },
          preserveMarkers: {
            type: 'boolean',
            description: 'Preserve manual edit markers (default: true)',
            default: true,
          },
        },
        required: ['projectPath'],
      },
    };
  }

  /**
   * Handle update_readme_architecture tool execution
   */
  private async handleUpdateReadme(args: any): Promise<any> {
    const result = await executeUpdateReadme(args);

    if (!result.success) {
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              success: false,
              error: result.error?.message || 'Unknown error',
            }),
          },
        ],
        isError: true,
      };
    }

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(result.data),
        },
      ],
    };
  }

  /**
   * Start the MCP server
   */
  async start(): Promise<void> {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('SMITE Scribe MCP server running on stdio');
  }
}

/**
 * Main entry point
 */
async function main(): Promise<void> {
  const server = new ScribeMCPServer();
  await server.start();
}

// Start server if this file is run directly
if (require.main === module) {
  main().catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
}

export { ScribeMCPServer };
