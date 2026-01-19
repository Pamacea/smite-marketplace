/**
 * TypeScript Parser and AST Utilities
 * Parse TypeScript/JavaScript code and generate AST using TypeScript Compiler API
 *
 * References:
 * - Using the Compiler API: https://github.com/microsoft/TypeScript/wiki/Using-the-Compiler-API
 * - TypeScript Compiler API 2025: https://javascript.plainenglish.io/7-hidden-typescript-compiler-apis-every-developer-should-know-for-custom-development-tools-0593a343f403
 */

import * as ts from 'typescript';
import { JudgeLogger } from './logger';
import { ASTAnalysisContext, FunctionInfo } from './types';

export class TypeScriptParser {
  private logger: JudgeLogger;

  constructor(logger: JudgeLogger) {
    this.logger = logger;
  }

  /**
   * Parse code string into TypeScript SourceFile
   */
  parseCode(filePath: string, code: string): ts.SourceFile | null {
    try {
      this.logger.debug('parser', `Parsing file: ${filePath}`);

      const sourceFile = ts.createSourceFile(
        filePath,
        code,
        ts.ScriptTarget.Latest,
        true // setParentNodes - important for traversal
      );

      const lineCount = sourceFile.getText().split('\n').length;
      this.logger.debug('parser', `Successfully parsed ${filePath}`, {
        lineCount,
        nodeCount: this.countNodes(sourceFile),
      });

      return sourceFile;
    } catch (error) {
      this.logger.error('parser', `Failed to parse ${filePath}`, error);
      return null;
    }
  }

  /**
   * Count total nodes in AST (for debugging)
   */
  private countNodes(node: ts.Node): number {
    let count = 1;
    ts.forEachChild(node, (child) => {
      count += this.countNodes(child);
    });
    return count;
  }

  /**
   * Extract code snippet by location
   */
  extractCodeSnippet(sourceFile: ts.SourceFile, start: number, end: number): string {
    const fullText = sourceFile.getFullText();
    return fullText.substring(start, end);
  }

  /**
   * Get line and column from position
   */
  getLineAndColumn(sourceFile: ts.SourceFile, position: number): { line: number; column: number } {
    const { line, character } = sourceFile.getLineAndCharacterOfPosition(position);
    return { line: line + 1, column: character + 1 };
  }

  /**
   * Traverse AST and visit all nodes
   */
  traverseAST(sourceFile: ts.SourceFile, visitor: (node: ts.Node) => void): void {
    function visit(node: ts.Node) {
      visitor(node);
      ts.forEachChild(node, visit);
    }
    visit(sourceFile);
  }

  /**
   * Extract all function declarations and expressions from source file
   */
  extractFunctions(sourceFile: ts.SourceFile): FunctionInfo[] {
    const functions: FunctionInfo[] = [];

    this.traverseAST(sourceFile, (node) => {
      if (
        ts.isFunctionDeclaration(node) ||
        ts.isFunctionExpression(node) ||
        ts.isArrowFunction(node) ||
        ts.isMethodDeclaration(node)
      ) {
        const info = this.analyzeFunction(sourceFile, node);
        if (info) {
          functions.push(info);
        }
      }
    });

    return functions;
  }

  /**
   * Analyze a function node and extract metrics
   */
  private analyzeFunction(sourceFile: ts.SourceFile, node: ts.Node): FunctionInfo | null {
    let name = 'anonymous';
    let parameters = 0;

    // Extract function name
    if (ts.isFunctionDeclaration(node) || ts.isMethodDeclaration(node)) {
      name = node.name?.getText() || 'anonymous';
      parameters = node.parameters.length;
    } else if (ts.isFunctionExpression(node)) {
      name = node.name?.getText() || 'anonymous';
      parameters = node.parameters.length;
    } else if (ts.isArrowFunction(node)) {
      name = 'arrow';
      parameters = node.parameters.length;
    }

    // Get location
    const start = node.getStart(sourceFile);
    const end = node.getEnd();
    const startPos = this.getLineAndColumn(sourceFile, start);
    const endPos = this.getLineAndColumn(sourceFile, end);

    // Calculate metrics
    const complexity = this.calculateCyclomaticComplexity(node);
    const cognitiveComplexity = this.calculateCognitiveComplexity(node);
    const nestingDepth = this.calculateNestingDepth(node);
    const length = endPos.line - startPos.line + 1;

    return {
      name,
      startLine: startPos.line,
      startColumn: startPos.column,
      endLine: endPos.line,
      endColumn: endPos.column,
      complexity,
      cognitiveComplexity,
      nestingDepth,
      parameterCount: parameters,
      length,
    };
  }

  /**
   * Calculate cyclomatic complexity of a function
   * Based on decision points: if, for, while, case, catch, conditional expressions
   *
   * Reference: https://en.wikipedia.org/wiki/Cyclomatic_complexity
   */
  private calculateCyclomaticComplexity(functionNode: ts.Node): number {
    let complexity = 1; // Base complexity

    function visit(node: ts.Node) {
      // Decision points that increase complexity
      switch (node.kind) {
        case ts.SyntaxKind.IfStatement:
        case ts.SyntaxKind.ForStatement:
        case ts.SyntaxKind.ForInStatement:
        case ts.SyntaxKind.ForOfStatement:
        case ts.SyntaxKind.WhileStatement:
        case ts.SyntaxKind.DoStatement:
        case ts.SyntaxKind.CaseClause:
        case ts.SyntaxKind.CatchClause:
        case ts.SyntaxKind.ConditionalExpression: // ternary operator
          complexity++;
          break;
        case ts.SyntaxKind.SwitchStatement:
          // Switch adds complexity for each case (handled by CaseClause)
          break;
      }

      // Logical operators && and || also add complexity
      if (ts.isBinaryExpression(node)) {
        if (
          node.operatorToken.kind === ts.SyntaxKind.AmpersandAmpersandToken ||
          node.operatorToken.kind === ts.SyntaxKind.BarBarToken
        ) {
          complexity++;
        }
      }

      ts.forEachChild(node, visit);
    }

    // Only traverse within the function body
    if (ts.isFunctionDeclaration(functionNode) || ts.isFunctionExpression(functionNode)) {
      if (functionNode.body) {
        ts.forEachChild(functionNode.body, visit);
      }
    } else if (ts.isArrowFunction(functionNode)) {
      if (functionNode.body) {
        if (ts.isBlock(functionNode.body)) {
          ts.forEachChild(functionNode.body, visit);
        } else {
          // Arrow function with expression body
          visit(functionNode.body);
        }
      }
    } else if (ts.isMethodDeclaration(functionNode)) {
      if (functionNode.body) {
        ts.forEachChild(functionNode.body, visit);
      }
    }

    return complexity;
  }

  /**
   * Calculate cognitive complexity
   * Measures how difficult code is to understand for humans
   *
   * Reference: https://www.sonarsource.com/resources/cognitive-complexity.html
   */
  private calculateCognitiveComplexity(functionNode: ts.Node): number {
    let complexity = 0;
    let nestingLevel = 0;

    function visit(node: ts.Node) {
      // Increment for nesting structures
      if (
        node.kind === ts.SyntaxKind.IfStatement ||
        node.kind === ts.SyntaxKind.ForStatement ||
        node.kind === ts.SyntaxKind.ForInStatement ||
        node.kind === ts.SyntaxKind.ForOfStatement ||
        node.kind === ts.SyntaxKind.WhileStatement ||
        node.kind === ts.SyntaxKind.DoStatement ||
        node.kind === ts.SyntaxKind.CaseClause ||
        node.kind === ts.SyntaxKind.CatchClause
      ) {
        complexity += 1 + nestingLevel;
        nestingLevel++;
      }

      // Binary logical operators
      if (ts.isBinaryExpression(node)) {
        if (
          node.operatorToken.kind === ts.SyntaxKind.AmpersandAmpersandToken ||
          node.operatorToken.kind === ts.SyntaxKind.BarBarToken
        ) {
          complexity++;
        }
      }

      // Recurse into children
      const prevNestingLevel = nestingLevel;
      ts.forEachChild(node, visit);
      nestingLevel = prevNestingLevel;
    }

    // Only traverse within the function body
    if (ts.isFunctionDeclaration(functionNode) || ts.isFunctionExpression(functionNode)) {
      if (functionNode.body) {
        ts.forEachChild(functionNode.body, visit);
      }
    } else if (ts.isArrowFunction(functionNode)) {
      if (functionNode.body) {
        if (ts.isBlock(functionNode.body)) {
          ts.forEachChild(functionNode.body, visit);
        } else {
          visit(functionNode.body);
        }
      }
    } else if (ts.isMethodDeclaration(functionNode)) {
      if (functionNode.body) {
        ts.forEachChild(functionNode.body, visit);
      }
    }

    return complexity;
  }

  /**
   * Calculate maximum nesting depth of a function
   */
  private calculateNestingDepth(functionNode: ts.Node): number {
    let maxDepth = 0;
    let currentDepth = 0;

    function visit(node: ts.Node) {
      // Check if this is a nesting structure
      const isNesting =
        node.kind === ts.SyntaxKind.IfStatement ||
        node.kind === ts.SyntaxKind.ForStatement ||
        node.kind === ts.SyntaxKind.ForInStatement ||
        node.kind === ts.SyntaxKind.ForOfStatement ||
        node.kind === ts.SyntaxKind.WhileStatement ||
        node.kind === ts.SyntaxKind.DoStatement ||
        node.kind === ts.SyntaxKind.CaseClause ||
        node.kind === ts.SyntaxKind.CatchClause ||
        node.kind === ts.SyntaxKind.Block;

      if (isNesting && node.kind !== ts.SyntaxKind.Block) {
        currentDepth++;
        maxDepth = Math.max(maxDepth, currentDepth);
      }

      ts.forEachChild(node, visit);

      if (isNesting && node.kind !== ts.SyntaxKind.Block) {
        currentDepth--;
      }
    }

    // Only traverse within the function body
    if (ts.isFunctionDeclaration(functionNode) || ts.isFunctionExpression(functionNode)) {
      if (functionNode.body) {
        ts.forEachChild(functionNode.body, visit);
      }
    } else if (ts.isArrowFunction(functionNode)) {
      if (functionNode.body) {
        if (ts.isBlock(functionNode.body)) {
          ts.forEachChild(functionNode.body, visit);
        } else {
          visit(functionNode.body);
        }
      }
    } else if (ts.isMethodDeclaration(functionNode)) {
      if (functionNode.body) {
        ts.forEachChild(functionNode.body, visit);
      }
    }

    return maxDepth;
  }
}
