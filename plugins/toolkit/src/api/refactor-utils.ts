/**
 * Refactoring Utilities
 *
 * Utility functions for the refactoring API.
 *
 * @module api/refactor-utils
 */

import type { SourceFile } from 'ts-morph';
import type { Project } from 'ts-morph';

/**
 * Generate diff between two texts
 *
 * @param oldText - Original text
 * @param newText - Modified text
 * @returns Unified diff string
 */
export function generateDiff(oldText: string, newText: string): string {
  const lines1 = oldText.split('\n');
  const lines2 = newText.split('\n');

  const diff: string[] = [];

  for (let i = 0; i < Math.max(lines1.length, lines2.length); i++) {
    const line1 = lines1[i];
    const line2 = lines2[i];

    if (line1 !== line2) {
      if (line1 !== undefined) {
        diff.push(`- ${line1}`);
      }
      if (line2 !== undefined) {
        diff.push(`+ ${line2}`);
      }
    }
  }

  return diff.join('\n');
}

/**
 * Calculate nesting depth of code
 *
 * @param text - Code text to analyze
 * @returns Maximum nesting depth
 */
export function calculateNestingDepth(text: string): number {
  let maxDepth = 0;
  let currentDepth = 0;

  for (const char of text) {
    if (char === '{') {
      currentDepth++;
      maxDepth = Math.max(maxDepth, currentDepth);
    } else if (char === '}') {
      currentDepth--;
    }
  }

  return maxDepth;
}

/**
 * Create backup of file
 *
 * @param filePath - Path to file to backup
 * @returns Path to backup file
 */
export async function createBackup(filePath: string): Promise<string> {
  const fs = await import('fs/promises');
  const path = await import('path');

  const backupPath = `${filePath}.backup`;
  await fs.copyFile(filePath, backupPath);

  return backupPath;
}

/**
 * Add source file to project
 *
 * @param project - ts-morph Project instance
 * @param filePath - Path to source file
 * @returns SourceFile or null if loading failed
 */
export function addSourceFile(
  project: Pick<Project, 'addSourceFileAtPath'>,
  filePath: string
): SourceFile | null {
  try {
    return project.addSourceFileAtPath(filePath);
  } catch {
    return null;
  }
}
