/**
 * Scribe MCP Server
 * Internal documentation editor with OpenAPI sync, README updates, and JSDoc generation
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { OpenAPIGenerator } from "./openapi-generator.js";
import { OpenAPIMerger } from "./openapi-merger.js";
import { ExpressRouteScanner, NextJSRouteScanner } from "./scanners/index.js";
import type { ToolResult } from "./openapi-types.js";

export class ScribeMCPServer {
  private server: McpServer;

  constructor() {
    this.server = new McpServer(
      {
        name: "smite-scribe",
        version: "1.0.0",
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.registerTools();
  }

  private registerTools(): void {
    // Register sync_openapi_spec tool
    this.server.tool(
      "sync_openapi_spec",
      "Scans route definitions and updates OpenAPI/Swagger spec files. Detects new endpoints, signature changes, and deprecations.",
      {
        projectPath: z
          .string()
          .describe("Root directory of the project to scan"),
        configPath: z
          .string()
          .optional()
          .default(".smite/scribe-config.json")
          .describe(
            "Path to scribe config file (default: .smite/scribe-config.json)"
          ),
        outputFormat: z
          .enum(["json", "yaml"])
          .optional()
          .default("json")
          .describe("Output format for OpenAPI spec"),
        outputPath: z
          .string()
          .optional()
          .default("openapi.json")
          .describe("Output file path (overrides config)"),
        generateDiff: z
          .boolean()
          .optional()
          .default(false)
          .describe("Generate diff preview before applying changes"),
        force: z
          .boolean()
          .optional()
          .default(false)
          .describe("Force update even if no changes detected"),
        frameworks: z
          .array(z.enum(["express", "fastapi", "nextjs", "nestjs"]))
          .optional()
          .default(["express", "nextjs"])
          .describe("Frameworks to scan for routes"),
        title: z
          .string()
          .optional()
          .default("API Documentation")
          .describe("API title for OpenAPI spec"),
        version: z
          .string()
          .optional()
          .default("1.0.0")
          .describe("API version for OpenAPI spec"),
      },
      async (args) => {
        return await this.handleOpenAPISync(args);
      }
    );
  }

  private async handleOpenAPISync(args: any): Promise<{
    content: Array<{ type: "text"; text: string }>;
  }> {
    try {
      console.error(`[Scribe] Starting OpenAPI sync for: ${args.projectPath}`);

      // Initialize route scanners based on requested frameworks
      const scanners: any[] = [];
      if (args.frameworks.includes("express")) {
        scanners.push(new ExpressRouteScanner());
      }
      if (args.frameworks.includes("nextjs")) {
        scanners.push(new NextJSRouteScanner());
      }
      if (args.frameworks.includes("fastapi")) {
        // FastAPI scanner not yet implemented
        console.warn("[Scribe] FastAPI scanner not yet implemented");
      }
      if (args.frameworks.includes("nestjs")) {
        // NestJS scanner not yet implemented
        console.warn("[Scribe] NestJS scanner not yet implemented");
      }

      // Scan project for routes
      console.error("[Scribe] Scanning project for routes...");
      const allEndpoints: any[] = [];

      for (const scanner of scanners) {
        const endpoints = await scanner.scan(args.projectPath);
        allEndpoints.push(...endpoints);
      }

      console.error(`[Scribe] Found ${allEndpoints.length} endpoints`);

      // Generate OpenAPI spec from endpoints
      const generator = new OpenAPIGenerator({
        title: args.title,
        version: args.version,
        description: "Auto-generated OpenAPI specification",
      });

      const newSpec = generator.generateFromEndpoints(allEndpoints);

      // Load existing spec and merge
      const merger = new OpenAPIMerger();
      const existingSpec = await merger.loadSpec(args.outputPath);

      console.error(
        `[Scribe] Merging with existing spec at: ${args.outputPath}`
      );

      const { mergedSpec, added, updated, removed } = merger.merge(
        existingSpec,
        newSpec
      );

      console.error(
        `[Scribe] Merge complete: ${added} added, ${updated} updated, ${removed} removed`
      );

      // Generate diff if requested
      let diff: string | undefined;
      if (args.generateDiff) {
        diff = merger.generateDiff(existingSpec, newSpec);
        console.error("[Scribe] Diff generated");
      }

      // Write updated spec
      await merger.writeSpec(
        mergedSpec,
        args.outputPath,
        args.outputFormat
      );

      console.error(`[Scribe] Spec written to: ${args.outputPath}`);

      // Prepare warnings
      const warnings: string[] = [];
      if (args.frameworks.includes("fastapi")) {
        warnings.push("FastAPI scanner not yet implemented");
      }
      if (args.frameworks.includes("nestjs")) {
        warnings.push("NestJS scanner not yet implemented");
      }

      const result: ToolResult = {
        success: true,
        endpointsFound: allEndpoints.length,
        endpointsAdded: added,
        endpointsUpdated: updated,
        endpointsRemoved: removed,
        diff,
        outputPath: args.outputPath,
        warnings: warnings.length > 0 ? warnings : undefined,
      };

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(result, null, 2),
          },
        ],
      };
    } catch (error) {
      console.error("[Scribe] Error during OpenAPI sync:", error);

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(
              {
                success: false,
                errors: [error instanceof Error ? error.message : String(error)],
                endpointsFound: 0,
                endpointsAdded: 0,
                endpointsUpdated: 0,
                endpointsRemoved: 0,
                outputPath: args.outputPath,
              } satisfies ToolResult,
              null,
              2
            ),
          },
        ],
      };
    }
  }

  async start(): Promise<void> {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error("[Scribe] MCP server started");
  }
}
