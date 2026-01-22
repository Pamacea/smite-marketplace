/**
 * Type definitions for the JSDoc Generator Tool
 */

import type { SourceFile, FunctionDeclaration, ArrowFunction, MethodDeclaration } from "typescript";

/**
 * Represents a parameter in a function signature
 */
export interface ParameterInfo {
  name: string;
  typeAnnotation?: string;
  defaultValue?: string;
  isOptional: boolean;
  isRest: boolean;
}

/**
 * Information about a return statement
 */
export interface ReturnInfo {
  type: string;
  expression?: string;
  line: number;
}

/**
 * Information about a thrown error
 */
export interface ThrownError {
  type: string;
  message?: string;
  line: number;
}

/**
 * Complete information about a function
 */
export interface FunctionInfo {
  name: string;
  kind: "declaration" | "arrow" | "method";
  parameters: ParameterInfo[];
  returnType?: string;
  isAsync: boolean;
  isGenerator: boolean;
  body: string;
  line: number;
  existingJSDoc?: string;
  returnStatements: ReturnInfo[];
  thrownErrors: ThrownError[];
  sideEffects: SideEffectInfo[];
}

/**
 * Detected side effects in a function
 */
export interface SideEffectInfo {
  type: "io" | "mutation" | "network" | "fs" | "console";
  description: string;
  line: number;
}

/**
 * Usage pattern of a parameter
 */
export interface UsagePattern {
  parameterName: string;
  operations: string[];
  isArrayAccess: boolean;
  isObjectAccess: boolean;
  isFunctionCall: boolean;
  isTemplateLiteral: boolean;
  isArithmetic: boolean;
  isCompared: boolean;
}

/**
 * JSDoc structure
 */
export interface JSDocInfo {
  description?: string;
  params: Map<string, { type: string; description: string }>;
  returns?: { type: string; description: string };
  throws: Array<{ type: string; description: string }>;
  examples: string[];
  deprecated?: boolean;
  since?: string;
  see: string[];
}

/**
 * Configuration for JSDoc generation
 */
export interface JSDocConfig {
  includeInferred: boolean;
  strategy: "merge" | "replace" | "append";
  generateExamples: boolean;
  detectThrows: boolean;
  inferDescriptions: boolean;
}

/**
 * Result of processing a file
 */
export interface FileProcessResult {
  file: string;
  functionsDocumented: number;
  updates: FunctionUpdate[];
}

/**
 * Update information for a function
 */
export interface FunctionUpdate {
  function: string;
  line: number;
  existingJSDoc?: string;
  newJSDoc: string;
}

/**
 * Result of JSDoc generation tool
 */
export interface JSDocGenerationResult {
  success: boolean;
  filesProcessed: number;
  functionsDocumented: number;
  existingJSDocUpdated: number;
  newJSDocGenerated: number;
  errors: Array<{
    file: string;
    function: string;
    error: string;
  }>;
  preview?: Array<{
    file: string;
    function: string;
    jsdoc: string;
  }>;
}

/**
 * Arguments for generate_jsdoc_on_fly tool
 */
export interface GenerateJSDocArgs {
  projectPath: string;
  filePaths?: string[];
  strategy: "merge" | "replace" | "append";
  includeInferred: boolean;
  dryRun: boolean;
}
