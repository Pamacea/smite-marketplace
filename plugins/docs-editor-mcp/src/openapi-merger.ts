/**
 * OpenAPI Spec Merger
 * Merges new OpenAPI specs with existing ones, preserving manual annotations
 */

import { readFileSync, writeFileSync, existsSync } from "fs";
import { join } from "path";
import * as yaml from "js-yaml";
import type { OpenAPISpec, ToolResult } from "./openapi-types.js";

export class OpenAPIMerger {
  merge(
    existingSpec: OpenAPISpec | null,
    newSpec: OpenAPISpec
  ): {
    mergedSpec: OpenAPISpec;
    added: number;
    updated: number;
    removed: number;
  } {
    let added = 0;
    let updated = 0;
    let removed = 0;

    const merged = existingSpec
      ? { ...existingSpec }
      : {
          openapi: "3.0.3",
          info: newSpec.info,
          paths: {},
          components: {
            schemas: {},
            responses: {},
            parameters: {},
            examples: {},
            requestBodies: {},
            securitySchemes: {},
          },
        };

    // Update info if changed
    if (
      newSpec.info.title !== merged.info.title ||
      newSpec.info.version !== merged.info.version
    ) {
      merged.info = { ...merged.info, ...newSpec.info };
    }

    // Merge paths
    const mergedPaths = { ...merged.paths };
    for (const [path, pathItem] of Object.entries(newSpec.paths)) {
      const existingPathItem = mergedPaths[path];

      if (!existingPathItem) {
        // New path added
        mergedPaths[path] = pathItem;
        added++;
      } else {
        // Merge operations for existing path
        const mergedPathItem = { ...existingPathItem };

        for (const method of [
          "get",
          "post",
          "put",
          "patch",
          "delete",
          "head",
          "options",
          "trace",
        ] as const) {
          const newOperation = (pathItem as any)[method];
          const existingOperation = (existingPathItem as any)[method];

          if (newOperation && !existingOperation) {
            // New operation added
            (mergedPathItem as any)[method] = newOperation;
            added++;
          } else if (newOperation && existingOperation) {
            // Merge operation, preserving manual annotations
            (mergedPathItem as any)[method] = this.mergeOperations(
              existingOperation,
              newOperation
            );
            updated++;
          }
        }

        mergedPaths[path] = mergedPathItem;
      }
    }

    // Detect removed paths/operations
    for (const path of Object.keys(merged.paths)) {
      if (!newSpec.paths[path]) {
        // Path was removed, mark as deprecated
        if (mergedPaths[path]) {
          for (const method of [
            "get",
            "post",
            "put",
            "patch",
            "delete",
            "head",
            "options",
            "trace",
          ] as const) {
            if ((mergedPaths[path] as any)[method]) {
              ((mergedPaths[path] as any)[method] as any).deprecated = true;
              removed++;
            }
          }
        }
      }
    }

    merged.paths = mergedPaths;

    // Merge components
    if (newSpec.components) {
      merged.components = merged.components || {};
      if (newSpec.components.schemas) {
        merged.components.schemas = {
          ...merged.components.schemas,
          ...newSpec.components.schemas,
        };
      }
      if (newSpec.components.responses) {
        merged.components.responses = {
          ...merged.components.responses,
          ...newSpec.components.responses,
        };
      }
      if (newSpec.components.parameters) {
        merged.components.parameters = {
          ...merged.components.parameters,
          ...newSpec.components.parameters,
        };
      }
    }

    return {
      mergedSpec: merged as OpenAPISpec,
      added,
      updated,
      removed,
    };
  }

  private mergeOperations(existing: any, generated: any): any {
    const merged = { ...existing };

    // Preserve manual annotations (summary, description, tags)
    if (existing.summary && !generated.summary) {
      merged.summary = existing.summary;
    } else if (generated.summary) {
      merged.summary = generated.summary;
    }

    if (existing.description && !generated.description) {
      merged.description = existing.description;
    } else if (generated.description) {
      merged.description = generated.description;
    }

    if (existing.tags && existing.tags.length > 0) {
      merged.tags = existing.tags;
    } else if (generated.tags) {
      merged.tags = generated.tags;
    }

    // Always update generated fields (parameters, responses)
    if (generated.parameters) {
      merged.parameters = generated.parameters;
    }

    if (generated.requestBody) {
      merged.requestBody = generated.requestBody;
    }

    if (generated.responses) {
      merged.responses = generated.responses;
    }

    return merged;
  }

  async loadSpec(filePath: string): Promise<OpenAPISpec | null> {
    if (!existsSync(filePath)) {
      return null;
    }

    const content = readFileSync(filePath, "utf-8");

    try {
      if (filePath.endsWith(".json")) {
        return JSON.parse(content);
      } else if (filePath.endsWith(".yaml") || filePath.endsWith(".yml")) {
        return yaml.load(content) as OpenAPISpec;
      }
    } catch (error) {
      console.warn(`Failed to parse existing spec at ${filePath}:`, error);
      return null;
    }

    return null;
  }

  async writeSpec(
    spec: OpenAPISpec,
    filePath: string,
    format: "json" | "yaml"
  ): Promise<void> {
    const dir = join(filePath, "..");
    // Ensure directory exists (in real implementation)

    let content: string;
    if (format === "json") {
      content = JSON.stringify(spec, null, 2);
    } else {
      content = yaml.dump(spec, { indent: 2 });
    }

    writeFileSync(filePath, content, "utf-8");
  }

  generateDiff(existingSpec: OpenAPISpec | null, newSpec: OpenAPISpec): string {
    const lines: string[] = [];

    if (!existingSpec) {
      lines.push("+++ New OpenAPI spec generated");
      return lines.join("\n");
    }

    // Compare paths
    const existingPaths = new Set(Object.keys(existingSpec.paths));
    const newPaths = new Set(Object.keys(newSpec.paths));

    const addedPaths = [...newPaths].filter((p) => !existingPaths.has(p));
    const removedPaths = [...existingPaths].filter((p) => !newPaths.has(p));

    if (addedPaths.length > 0) {
      lines.push("+++ Added paths:");
      for (const path of addedPaths) {
        lines.push(`  + ${path}`);
      }
    }

    if (removedPaths.length > 0) {
      lines.push("--- Removed paths:");
      for (const path of removedPaths) {
        lines.push(`  - ${path}`);
      }
    }

    // Compare info
    if (
      existingSpec.info.title !== newSpec.info.title ||
      existingSpec.info.version !== newSpec.info.version
    ) {
      lines.push("~~~ Info changed:");
      lines.push(`  - title: ${existingSpec.info.title} -> ${newSpec.info.title}`);
      lines.push(
        `  - version: ${existingSpec.info.version} -> ${newSpec.info.version}`
      );
    }

    return lines.join("\n");
  }
}
