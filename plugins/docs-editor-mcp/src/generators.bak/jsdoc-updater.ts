import type { FunctionUpdate, JSDocConfig } from "../types.js";

export class JSDocUpdater {
  applyUpdates(content: string, updates: FunctionUpdate[], strategy: JSDocConfig["strategy"]): string {
    const lines = content.split("\n");

    for (const update of updates) {
      const lineIndex = update.line - 1;

      switch (strategy) {
        case "replace":
          if (update.existingJSDoc) {
            const startLine = this.findJSDocStart(lines, lineIndex);
            if (startLine !== -1) {
              lines.splice(startLine, lineIndex - startLine, ...update.newJSDoc.split("\n"));
            }
          } else {
            lines.splice(lineIndex, 0, ...update.newJSDoc.split("\n"));
          }
          break;

        case "append":
          if (!update.existingJSDoc) {
            lines.splice(lineIndex, 0, ...update.newJSDoc.split("\n"));
          }
          break;

        case "merge":
          if (update.existingJSDoc) {
            const merged = this.mergeJSDoc(update.existingJSDoc, update.newJSDoc);
            const startLine = this.findJSDocStart(lines, lineIndex);
            if (startLine !== -1) {
              lines.splice(startLine, lineIndex - startLine, ...merged.split("\n"));
            }
          } else {
            lines.splice(lineIndex, 0, ...update.newJSDoc.split("\n"));
          }
          break;
      }
    }

    return lines.join("\n");
  }

  private findJSDocStart(lines: string[], searchStart: number): number {
    for (let i = searchStart - 1; i >= 0; i--) {
      if (lines[i].trim().startsWith("/**")) return i;
    }
    return -1;
  }

  private mergeJSDoc(existing: string, generated: string): string {
    return generated;
  }
}
