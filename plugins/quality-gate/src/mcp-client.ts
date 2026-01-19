/**
 * MCP Client Wrapper
 * Manages connection and communication with the Docs Editor MCP server
 */

import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import type { CallToolResult } from "@modelcontextprotocol/sdk/types.js";

export interface MCPClientConfig {
  serverPath: string;
  timeout?: number;
}

export interface MCPToolResult {
  success: boolean;
  toolName: string;
  result?: any;
  error?: string;
}

/**
 * MCP client wrapper for connecting to and calling tools on the Docs Editor MCP server
 */
export class MCPClient {
  private client: Client | null = null;
  private transport: StdioClientTransport | null = null;
  private connected = false;
  private config: MCPClientConfig;

  constructor(config: MCPClientConfig) {
    this.config = {
      timeout: 30000, // 30 second default timeout
      ...config,
    };
  }

  /**
   * Connect to the MCP server via stdio
   */
  async connect(): Promise<void> {
    try {
      // Create MCP client
      this.client = new Client({
        name: "quality-gate",
        version: "1.0.0",
      });

      // Create stdio transport
      this.transport = new StdioClientTransport({
        command: "node",
        args: [this.config.serverPath],
      });

      // Connect to server
      await this.client.connect(this.transport);

      // List available tools to verify connection
      const toolsResult = await this.client.listTools();
      console.error(
        `[MCP Client] Connected to server with tools:`,
        toolsResult.tools.map((t) => t.name)
      );

      this.connected = true;
    } catch (error) {
      console.error("[MCP Client] Failed to connect:", error);
      throw new Error(
        `Failed to connect to MCP server: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  /**
   * Check if client is connected
   */
  isConnected(): boolean {
    return this.connected;
  }

  /**
   * Call a tool on the MCP server
   */
  async callTool(
    toolName: string,
    args: Record<string, unknown>
  ): Promise<MCPToolResult> {
    if (!this.client || !this.connected) {
      return {
        success: false,
        toolName,
        error: "MCP client not connected",
      };
    }

    try {
      console.error(`[MCP Client] Calling tool: ${toolName}`, args);

      const result = await this.client.callTool({
        name: toolName,
        arguments: args,
      });

      // Parse result content
      const content = result.content as Array<{ type: string; text: string }>;
      const textContent = content.find((c) => c.type === "text")?.text;

      if (textContent) {
        const parsedResult = JSON.parse(textContent);
        console.error(`[MCP Client] Tool ${toolName} succeeded:`, parsedResult);

        return {
          success: true,
          toolName,
          result: parsedResult,
        };
      }

      return {
        success: false,
        toolName,
        error: "No text content in tool result",
      };
    } catch (error) {
      console.error(`[MCP Client] Tool ${toolName} failed:`, error);
      return {
        success: false,
        toolName,
        error: error instanceof Error ? error.message : String(error),
      };
    }
  }

  /**
   * Call sync_openapi_spec tool
   */
  async syncOpenAPISpec(params: {
    projectPath: string;
    configPath?: string;
    outputFormat?: "json" | "yaml";
    outputPath?: string;
    generateDiff?: boolean;
    force?: boolean;
    frameworks?: string[];
    title?: string;
    version?: string;
  }): Promise<MCPToolResult> {
    return this.callTool("sync_openapi_spec", params);
  }

  /**
   * Call update_readme_architecture tool
   */
  async updateReadmeArchitecture(params: {
    projectPath: string;
    readmePath?: string;
    architectureSection?: string;
    includeDependencies?: boolean;
    includeExports?: boolean;
    format?: "markdown" | "json";
  }): Promise<MCPToolResult> {
    return this.callTool("update_readme_architecture", params);
  }

  /**
   * Call generate_jsdoc_on_fly tool
   */
  async generateJSDoc(params: {
    projectPath: string;
    targetFiles?: string[];
    outputStrategy?: "inline" | "external";
    verbose?: boolean;
  }): Promise<MCPToolResult> {
    return this.callTool("generate_jsdoc_on_fly", params);
  }

  /**
   * Close the connection to the MCP server
   */
  async close(): Promise<void> {
    if (this.client) {
      await this.client.close();
      this.connected = false;
      console.error("[MCP Client] Connection closed");
    }
  }
}
