/**
 * Signature Extractor - Builds function, class, and method signatures
 *
 * @module core/rag/extractors/signature-extractor
 */

import type {
  FunctionDeclaration,
  ClassDeclaration,
  MethodDeclaration,
  ParameterDeclaration,
} from 'ts-morph';

/**
 * Extract function signature text
 */
export function buildFunctionSignature(func: FunctionDeclaration): string | null {
  try {
    const name = func.getName();
    const params = func.getParameters().map((p: ParameterDeclaration) => {
      const type = p.getType().getText();
      return `${p.getName()}: ${type}`;
    }).join(', ');

    const returnType = func.getReturnType().getText();
    const isAsync = func.isAsync() ? 'async ' : '';
    const isExported = func.isExported() ? 'export ' : '';

    return `${isExported}${isAsync}function ${name}(${params}): ${returnType};`;
  } catch {
    return null;
  }
}

/**
 * Extract class signature text
 */
export function buildClassSignature(cls: ClassDeclaration): string | null {
  try {
    const name = cls.getName();
    const isExported = cls.isExported() ? 'export ' : '';
    const isAbstract = cls.isAbstract() ? 'abstract ' : '';

    const extendsClause = cls.getExtends();
    const extendsText = extendsClause ? ` extends ${extendsClause.getText()}` : '';

    const implementsClauses = cls.getImplements();
    const implementsText = implementsClauses.length > 0
      ? ` implements ${implementsClauses.map((i) => i.getText()).join(', ')}`
      : '';

    return `${isExported}${isAbstract}class ${name}${extendsText}${implementsText} {`;
  } catch {
    return null;
  }
}

/**
 * Extract method signature text
 */
export function buildMethodSignature(method: MethodDeclaration, className?: string): string | null {
  try {
    const name = method.getName();
    const params = method.getParameters().map((p: ParameterDeclaration) => {
      const type = p.getType().getText();
      return `${p.getName()}: ${type}`;
    }).join(', ');

    const returnType = method.getReturnType().getText();
    const isAsync = method.isAsync() ? 'async ' : '';
    const isStatic = method.isStatic() ? 'static ' : '';
    const scope = method.getScope() ? `${method.getScope()} ` : '';

    return `  ${scope}${isStatic}${isAsync}${name}(${params}): ${returnType};`;
  } catch {
    return null;
  }
}
