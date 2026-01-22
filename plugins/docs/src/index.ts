/**
 * Scribe MCP Server Entry Point
 * Internal documentation editor with OpenAPI sync, README updates, and JSDoc generation
 */

import { ScribeMCPServer } from "./scribe-server.js";

async function main() {
  const server = new ScribeMCPServer();
  await server.start();
}

main().catch((error) => {
  console.error("Failed to start Scribe MCP server:", error);
  process.exit(1);
});
