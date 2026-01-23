/**
 * Type Extractor - Builds interface, type alias, and enum signatures
 *
 * @module core/rag/extractors/type-extractor
 */

import type {
  InterfaceDeclaration,
  TypeAliasDeclaration,
  EnumDeclaration,
  ParameterDeclaration,
} from 'ts-morph';

/**
 * Extract interface signature text
 */
export function buildInterfaceSignature(iface: InterfaceDeclaration): string | null {
  try {
    const name = iface.getName();
    const isExported = iface.isExported() ? 'export ' : '';

    const extendsClauses = iface.getExtends();
    const extendsText = extendsClauses.length > 0
      ? ` extends ${extendsClauses.map((e) => e.getText()).join(', ')}`
      : '';

    let signature = `${isExported}interface ${name}${extendsText} {`;

    iface.getProperties().forEach((prop) => {
      const propName = prop.getName();
      const propType = prop.getType().getText();
      const hasQuestionToken = (prop as any).hasQuestionToken?.() ?? false;
      const isOptional = hasQuestionToken ? '?' : '';
      signature += `\n  ${propName}${isOptional}: ${propType};`;
    });

    iface.getMethods().forEach((method) => {
      const methodName = method.getName();
      const params = method.getParameters().map((p: ParameterDeclaration) => {
        const type = p.getType().getText();
        return `${p.getName()}: ${type}`;
      }).join(', ');
      const returnType = method.getReturnType().getText();
      signature += `\n  ${methodName}(${params}): ${returnType};`;
    });

    signature += '\n}';
    return signature;
  } catch {
    return null;
  }
}

/**
 * Extract type alias signature text
 */
export function buildTypeAliasSignature(alias: TypeAliasDeclaration): string | null {
  try {
    const name = alias.getName();
    const isExported = alias.isExported() ? 'export ' : '';
    const type = alias.getType().getText();

    return `${isExported}type ${name} = ${type};`;
  } catch {
    return null;
  }
}

/**
 * Extract enum signature text
 */
export function buildEnumSignature(enumDecl: EnumDeclaration): string | null {
  try {
    const name = enumDecl.getName();
    const isExported = enumDecl.isExported() ? 'export ' : '';

    let signature = `${isExported}enum ${name} {`;

    enumDecl.getMembers().forEach((member) => {
      const memberName = member.getName();
      const value = member.getValue();
      const valueText = value !== undefined ? ` = ${JSON.stringify(value)}` : '';
      signature += `\n  ${memberName}${valueText},`;
    });

    signature += '\n}';
    return signature;
  } catch {
    return null;
  }
}
