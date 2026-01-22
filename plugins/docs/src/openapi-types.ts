/**
 * Type definitions for the OpenAPI Sync Tool
 */

/**
 * Represents an API endpoint discovered from route scanning
 */
export interface Endpoint {
  path: string;
  method: "get" | "post" | "put" | "patch" | "delete" | "head" | "options" | "trace";
  parameters?: Parameter[];
  requestBody?: Schema;
  responses?: Record<string, Response>;
  description?: string;
  summary?: string;
  tags?: string[];
  security?: SecurityScheme[];
  deprecated?: boolean;
  file: string; // Source file where endpoint was defined
  line: number; // Line number in source file
}

/**
 * Parameter definition (query, path, header, cookie)
 */
export interface Parameter {
  name: string;
  in: "query" | "path" | "header" | "cookie";
  description?: string;
  required?: boolean;
  schema: Schema;
}

/**
 * Response definition
 */
export interface Response {
  description: string;
  headers?: Record<string, Parameter>;
  content?: Record<string, MediaType>;
}

/**
 * Media type with schema
 */
export interface MediaType {
  schema: Schema;
  example?: any;
  examples?: Record<string, any>;
}

/**
 * OpenAPI Schema definition
 */
export interface Schema {
  type?: string;
  format?: string;
  enum?: any[];
  properties?: Record<string, Schema>;
  required?: string[];
  items?: Schema;
  $ref?: string;
  description?: string;
  example?: any;
  oneOf?: Schema[];
  anyOf?: Schema[];
  allOf?: Schema[];
  additionalProperties?: boolean | Schema;
}

/**
 * Security scheme definition
 */
export interface SecurityScheme {
  type: "apiKey" | "http" | "oauth2" | "openIdConnect";
  description?: string;
  name?: string;
  in?: "query" | "header";
  scheme?: string;
  bearerFormat?: string;
  flows?: any;
  openIdConnectUrl?: string;
}

/**
 * OpenAPI 3.0 Specification structure
 */
export interface OpenAPISpec {
  openapi: "3.0.0" | "3.0.1" | "3.0.2" | "3.0.3" | "3.1.0";
  info: {
    title: string;
    version: string;
    description?: string;
    termsOfService?: string;
    contact?: {
      name?: string;
      email?: string;
      url?: string;
    };
    license?: {
      name: string;
      url?: string;
    };
  };
  servers?: {
    url: string;
    description?: string;
    variables?: Record<string, any>;
  }[];
  paths: Record<string, PathItem>;
  components?: {
    schemas?: Record<string, Schema>;
    responses?: Record<string, Response>;
    parameters?: Record<string, Parameter>;
    examples?: Record<string, any>;
    requestBodies?: Record<string, any>;
    securitySchemes?: Record<string, SecurityScheme>;
  };
  security?: SecurityScheme[][];
  tags?: {
    name: string;
    description?: string;
    externalDocs?: {
      description?: string;
      url: string;
    };
  }[];
  externalDocs?: {
    description?: string;
    url: string;
  };
}

/**
 * Path item object
 */
export interface PathItem {
  $ref?: string;
  summary?: string;
  description?: string;
  get?: Operation;
  put?: Operation;
  post?: Operation;
  delete?: Operation;
  options?: Operation;
  head?: Operation;
  patch?: Operation;
  trace?: Operation;
  servers?: {
    url: string;
    description?: string;
    variables?: Record<string, any>;
  }[];
  parameters?: Parameter[];
}

/**
 * Operation object
 */
export interface Operation {
  tags?: string[];
  summary?: string;
  description?: string;
  externalDocs?: {
    description?: string;
    url: string;
  };
  operationId?: string;
  parameters?: Parameter[];
  requestBody?: {
    description?: string;
    content: Record<string, MediaType>;
    required?: boolean;
  };
  responses: Record<string, Response>;
  callbacks?: Record<string, any>;
  deprecated?: boolean;
  security?: SecurityScheme[][];
  servers?: {
    url: string;
    description?: string;
    variables?: Record<string, any>;
  }[];
}

/**
 * Route scanner interface
 */
export interface RouteScanner {
  /**
   * Scan project for routes
   */
  scan(projectPath: string, config?: ScanConfig): Promise<Endpoint[]>;
}

/**
 * Scanner configuration
 */
export interface ScanConfig {
  includePatterns?: string[];
  excludePatterns?: string[];
  scanPaths?: string[];
}

/**
 * Tool execution result
 */
export interface ToolResult {
  success: boolean;
  endpointsFound: number;
  endpointsAdded: number;
  endpointsUpdated: number;
  endpointsRemoved: number;
  diff?: string;
  outputPath: string;
  warnings?: string[];
  errors?: string[];
}
