/**
 * OpenAPI Specification Generator
 * Generates OpenAPI 3.0 specs from discovered endpoints
 */

import type { OpenAPISpec, Endpoint, PathItem, Operation } from "./openapi-types.js";

export class OpenAPIGenerator {
  private spec: OpenAPISpec;

  constructor(
    private config: {
      title: string;
      version: string;
      description?: string;
      baseUrl?: string;
    }
  ) {
    this.spec = this.createBaseSpec();
  }

  generateFromEndpoints(endpoints: Endpoint[]): OpenAPISpec {
    const paths: Record<string, PathItem> = {};

    // Group endpoints by path
    const endpointsByPath = new Map<string, Endpoint[]>();
    for (const endpoint of endpoints) {
      const existing = endpointsByPath.get(endpoint.path) || [];
      existing.push(endpoint);
      endpointsByPath.set(endpoint.path, existing);
    }

    // Generate path items
    const pathEntries = Array.from(endpointsByPath.entries());
    for (const [path, pathEndpoints] of pathEntries) {
      const pathItem: PathItem = {
        parameters: [],
      };

      // Add common parameters from all endpoints
      const commonParams = this.extractCommonParameters(pathEndpoints);
      if (commonParams.length > 0) {
        pathItem.parameters = commonParams;
      }

      // Add operations for each HTTP method
      for (const endpoint of pathEndpoints) {
        const operation = this.generateOperation(endpoint);
        (pathItem as any)[endpoint.method] = operation;
      }

      paths[path] = pathItem;
    }

    this.spec.paths = paths;
    return this.spec;
  }

  private createBaseSpec(): OpenAPISpec {
    return {
      openapi: "3.0.3",
      info: {
        title: this.config.title,
        version: this.config.version,
        description: this.config.description,
      },
      servers: this.config.baseUrl
        ? [{ url: this.config.baseUrl, description: "API server" }]
        : undefined,
      paths: {},
      components: {
        schemas: {},
        responses: {},
        parameters: {},
        examples: {},
        requestBodies: {},
        securitySchemes: {},
      },
      tags: [],
    };
  }

  private generateOperation(endpoint: Endpoint): Operation {
    const operation: Operation = {
      responses: endpoint.responses || {
        "200": {
          description: "Successful response",
        },
      },
    };

    if (endpoint.summary) {
      operation.summary = endpoint.summary;
    }

    if (endpoint.description) {
      operation.description = endpoint.description;
    }

    if (endpoint.tags && endpoint.tags.length > 0) {
      operation.tags = endpoint.tags;
    }

    if (endpoint.parameters && endpoint.parameters.length > 0) {
      operation.parameters = endpoint.parameters;
    }

    if (endpoint.requestBody) {
      operation.requestBody = {
        content: {
          "application/json": {
            schema: endpoint.requestBody,
          },
        },
      };
    }

    if (endpoint.deprecated) {
      operation.deprecated = true;
    }

    if (endpoint.security && endpoint.security.length > 0) {
      operation.security = endpoint.security.map((s: any) => [s]);
    }

    // Generate operationId from path and method
    operation.operationId = this.generateOperationId(endpoint.path, endpoint.method);

    return operation;
  }

  private extractCommonParameters(endpoints: Endpoint[]): any[] {
    // Find parameters that are common to all endpoints for this path
    // (e.g., path parameters)
    const commonParams: any[] = [];

    if (endpoints.length === 0) {
      return commonParams;
    }

    // Get path parameters from the first endpoint
    const firstEndpoint = endpoints[0];
    const pathParams = firstEndpoint.parameters?.filter((p) => p.in === "path") || [];

    // Add path parameters as common parameters
    for (const param of pathParams) {
      commonParams.push({
        name: param.name,
        in: "path",
        required: true,
        schema: param.schema,
        description: param.description,
      });
    }

    return commonParams;
  }

  private generateOperationId(path: string, method: string): string {
    // Convert path to operationId
    // Example: /api/users/:id + GET => getUsersById
    const parts = path
      .split("/")
      .filter((p) => p.length > 0)
      .map((p: string) => {
        if (p.startsWith(":")) {
          return "By" + this.capitalize(p.substring(1));
        }
        return p;
      });

    const pathPart = parts.map((p: string) => this.capitalize(p)).join("");
    return method.toLowerCase() + pathPart;
  }

  private capitalize(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
}
