import * as ts from "typescript";
import type { FunctionInfo, ParameterInfo, ReturnInfo, ThrownError, SideEffectInfo } from "../types.js";

export class ASTParser {
  private program: ts.Program;
  private typeChecker: ts.TypeChecker;

  constructor(filePath: string) {
    this.program = ts.createProgram([filePath], {
      target: ts.ScriptTarget.ES2022,
    });
    this.typeChecker = this.program.getTypeChecker();
  }

  extractFunctions(sourceFile: ts.SourceFile): FunctionInfo[] {
    const functions: FunctionInfo[] = [];
    const visit = (node: ts.Node): void => {
      if (ts.isFunctionDeclaration(node) && node.name) {
        functions.push(this.parseFunctionDeclaration(node));
      } else if (ts.isVariableStatement(node)) {
        const func = this.parseArrowFunctionVariable(node);
        if (func) functions.push(func);
      } else if (ts.isMethodDeclaration(node)) {
        functions.push(this.parseMethodDeclaration(node));
      }
      ts.forEachChild(node, visit);
    };
    visit(sourceFile);
    return functions;
  }

  private parseFunctionDeclaration(node: ts.FunctionDeclaration): FunctionInfo {
    const sourceFile = this.program.getSourceFile(node.getSourceFile().fileName)!;
    return {
      name: node.name?.getText() || "anonymous",
      kind: "declaration",
      parameters: node.parameters.map(p => ({
        name: p.name.getText(),
        typeAnnotation: p.type?.getText(),
        defaultValue: p.initializer?.getText(),
        isOptional: !!p.questionToken,
        isRest: !!p.dotDotDotToken,
      })),
      returnType: node.type?.getText(),
      isAsync: !!node.modifiers?.some(m => m.kind === ts.SyntaxKind.AsyncKeyword),
      isGenerator: !!node.asteriskToken,
      body: node.body?.getText() || "",
      line: ts.getLineAndCharacterOfPosition(node.getStart(sourceFile)).line + 1,
      returnStatements: [],
      thrownErrors: [],
      sideEffects: [],
    };
  }

  private parseArrowFunctionVariable(node: ts.VariableStatement): FunctionInfo | null {
    for (const decl of node.declarationList.declarations) {
      if (ts.isArrowFunction(decl.initializer)) {
        const sourceFile = this.program.getSourceFile(decl.getSourceFile().fileName)!;
        return {
          name: decl.name.getText(),
          kind: "arrow",
          parameters: decl.initializer.parameters.map(p => ({
            name: p.name.getText(),
            typeAnnotation: p.type?.getText(),
            defaultValue: p.initializer?.getText(),
            isOptional: !!p.questionToken,
            isRest: !!p.dotDotDotToken,
          })),
          returnType: decl.initializer.type?.getText(),
          isAsync: false,
          isGenerator: false,
          body: decl.initializer.body.getText(),
          line: ts.getLineAndCharacterOfPosition(decl.getStart(sourceFile)).line + 1,
          returnStatements: [],
          thrownErrors: [],
          sideEffects: [],
        };
      }
    }
    return null;
  }

  private parseMethodDeclaration(node: ts.MethodDeclaration): FunctionInfo {
    const sourceFile = this.program.getSourceFile(node.getSourceFile().fileName)!;
    return {
      name: node.name.getText(),
      kind: "method",
      parameters: node.parameters.map(p => ({
        name: p.name.getText(),
        typeAnnotation: p.type?.getText(),
        defaultValue: p.initializer?.getText(),
        isOptional: !!p.questionToken,
        isRest: !!p.dotDotDotToken,
      })),
      returnType: node.type?.getText(),
      isAsync: !!node.modifiers?.some(m => m.kind === ts.SyntaxKind.AsyncKeyword),
      isGenerator: !!node.asteriskToken,
      body: node.body?.getText() || "",
      line: ts.getLineAndCharacterOfPosition(node.getStart(sourceFile)).line + 1,
      returnStatements: [],
      thrownErrors: [],
      sideEffects: [],
    };
  }
}
