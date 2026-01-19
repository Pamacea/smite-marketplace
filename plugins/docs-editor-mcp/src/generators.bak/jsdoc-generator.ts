import type { FunctionInfo, JSDocConfig } from "../types.js";

export class JSDocGenerator {
  private config: JSDocConfig;

  constructor(config: JSDocConfig) {
    this.config = config;
  }

  generate(funcInfo: FunctionInfo): string {
    const lines: string[] = [];

    const description = this.inferDescription(funcInfo);
    if (description) {
      lines.push(description);
      lines.push("");
    }

    for (const param of funcInfo.parameters) {
      const type = param.typeAnnotation || (this.config.includeInferred ? "any" : "");
      const desc = this.inferParamDescription(param, funcInfo);
      if (type) {
        const line = "@param {" + type + "} " + param.name + " " + desc;
        lines.push(line.trim());
      }
    }

    if (funcInfo.returnType && funcInfo.returnType !== "void") {
      const desc = this.inferReturnDescription(funcInfo);
      const line = "@returns {" + funcInfo.returnType + "} " + desc;
      lines.push(line.trim());
    }

    for (const error of funcInfo.thrownErrors) {
      const msg = error.message || "When an error occurs";
      lines.push("@throws {" + error.type + "} " + msg);
    }

    if (lines.length === 0) return "";
    return "/**\n * " + lines.join("\n * ") + "\n */";
  }

  private inferDescription(func: FunctionInfo): string {
    if (func.isAsync && func.sideEffects.some(e => e.type === "network")) {
      return "Asynchronously fetches data and returns the result";
    }
    if (func.thrownErrors.length > 0) {
      return "Validates input and throws error on validation failure";
    }
    if (func.sideEffects.some(e => e.type === "mutation")) {
      return "Mutates state and returns the updated value";
    }
    if (func.returnType === "void") {
      return "Performs an action without returning a value";
    }
    return "Performs an operation and returns the result";
  }

  private inferParamDescription(param: { name: string }): string {
    return "The " + param.name + " parameter";
  }

  private inferReturnDescription(func: FunctionInfo): string {
    if (func.isAsync) return "A promise that resolves to the result";
    return "The result of the operation";
  }
}
