/**
 * Project Structure Scanner - Scans directory structure
 * Following SMITE engineering rules: Pure functions, immutable data, Result types
 */

import * as fs from 'fs/promises';
import * as path from 'path';
import { glob } from 'glob';
import type { GlobOptions } from 'glob';
import {
  StructureNode,
  StructureChange,
  Result,
} from './readme-types.js';

/**
 * Default ignore patterns for directory scanning
 */
const DEFAULT_IGNORE_PATTERNS = [
  'node_modules/**',
  'dist/**',
  'build/**',
  '.git/**',
  'coverage/**',
  '.next/**',
  '.cache/**',
  '**/*.test.ts',
  '**/*.test.js',
  '**/*.spec.ts',
  '**/*.spec.js',
  '**/*.d.ts',
];

/**
 * Scan directory structure recursively
 */
export async function scanDirectoryStructure(
  projectPath: string,
  options: {
    maxDepth?: number;
    ignorePatterns?: string[];
    basePath?: string;
  } = {}
): Promise<Result<StructureNode[]>> {
  try {
    const {
      maxDepth = 5,
      ignorePatterns = DEFAULT_IGNORE_PATTERNS,
      basePath = projectPath,
    } = options;

    // Use glob to find all files
    const pattern = path.join(projectPath, '**/*').split(path.sep).join('/');
    const files = await glob(pattern, {
      ignore: ignorePatterns.map(p => path.join(projectPath, p).split(path.sep).join('/')),
      nodir: true,
      absolute: false,
    });

    // Build tree structure
    const rootMap = new Map<string, StructureNode>();

    for (const file of files) {
      const parts = file.split(path.sep).filter(p => p);
      let currentLevel = rootMap;
      let currentPath = '';

      for (let i = 0; i < parts.length; i++) {
        const part = parts[i];
        const isFile = i === parts.length - 1;
        currentPath = currentPath ? path.join(currentPath, part) : part;

        if (!currentLevel.has(part)) {
          const node: StructureNode = {
            path: currentPath,
            name: part,
            type: isFile ? 'file' : 'directory',
            depth: i,
            children: isFile ? undefined : [],
          };
          currentLevel.set(part, node);
        }

        if (!isFile) {
          const node = currentLevel.get(part)!;
          currentLevel = new Map(Object.entries((node.children || []).reduce((acc, child) => {
            acc[child.name] = child;
            return acc;
          }, {} as Record<string, StructureNode>)));
        }
      }
    }

    // Convert map to array and sort
    const roots = Array.from(rootMap.values()).sort((a, b) =>
      a.name.localeCompare(b.name)
    );

    return { success: true, data: roots };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error : new Error(String(error)),
    };
  }
}

/**
 * Detect module patterns (components, services, utils, etc.)
 */
export interface ModulePattern {
  name: string;
  path: string;
  type: 'components' | 'services' | 'utils' | 'hooks' | 'types' | 'config' | 'tests' | 'other';
  fileCount: number;
}

/**
 * Analyze project structure for module patterns
 */
export async function analyzeModulePatterns(
  projectPath: string
): Promise<Result<ModulePattern[]>> {
  try {
    const scanResult = await scanDirectoryStructure(projectPath);

    if (!scanResult.success) {
      return { success: false, error: scanResult.error };
    }

    const patterns: ModulePattern[] = [];

    // Common module directories
    const moduleTypePatterns: Record<string, string[]> = {
      components: ['components', 'Components'],
      services: ['services', 'api', 'server'],
      utils: ['utils', 'lib', 'helpers', 'shared'],
      hooks: ['hooks', 'Hooks'],
      types: ['types', 'interfaces', '@types'],
      config: ['config', '.config', 'configs'],
      tests: ['tests', '__tests__', 'test', 'spec'],
    };

    // Flatten tree to find all directories
    function flattenNodes(nodes: StructureNode[]): StructureNode[] {
      const result: StructureNode[] = [];
      for (const node of nodes) {
        result.push(node);
        if (node.children) {
          result.push(...flattenNodes(node.children));
        }
      }
      return result;
    }

    const allNodes = flattenNodes(scanResult.data);
    const directories = allNodes.filter(n => n.type === 'directory');

    // Categorize directories
    for (const dir of directories) {
      const dirName = dir.name.toLowerCase();

      let type: ModulePattern['type'] = 'other';
      for (const [moduleType, patterns] of Object.entries(moduleTypePatterns)) {
        if (patterns.some(p => dirName === p.toLowerCase() || dirName.includes(p.toLowerCase()))) {
          type = moduleType as ModulePattern['type'];
          break;
        }
      }

      // Count files in directory
      const fileCount = allNodes.filter(
        n => n.path.startsWith(dir.path) && n.type === 'file'
      ).length;

      patterns.push({
        name: dir.name,
        path: dir.path,
        type,
        fileCount,
      });
    }

    return { success: true, data: patterns };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error : new Error(String(error)),
    };
  }
}

/**
 * Compare two structures and detect changes
 */
export function compareStructures(
  oldStructure: StructureNode[],
  newStructure: StructureNode[]
): StructureChange[] {
  const changes: StructureChange[] = [];

  // Flatten structures for comparison
  function flatten(nodes: StructureNode[]): StructureNode[] {
    const result: StructureNode[] = [];
    for (const node of nodes) {
      result.push(node);
      if (node.children) {
        result.push(...flatten(node.children));
      }
    }
    return result;
  }

  const oldFlat = flatten(oldStructure);
  const newFlat = flatten(newStructure);

  const oldPaths = new Set(oldFlat.map(n => n.path));
  const newPaths = new Set(newFlat.map(n => n.path));

  // Detect additions
  for (const node of newFlat) {
    if (!oldPaths.has(node.path)) {
      changes.push({
        type: 'added',
        path: node.path,
        itemType: node.type,
      });
    }
  }

  // Detect removals
  for (const node of oldFlat) {
    if (!newPaths.has(node.path)) {
      changes.push({
        type: 'removed',
        path: node.path,
        itemType: node.type,
      });
    }
  }

  return changes;
}

/**
 * Generate markdown tree representation
 */
export function generateMarkdownTree(nodes: StructureNode[], prefix = ''): string {
  let result = '';

  const sortedNodes = [...nodes].sort((a, b) => {
    // Directories first
    if (a.type === 'directory' && b.type === 'file') return -1;
    if (a.type === 'file' && b.type === 'directory') return 1;
    return a.name.localeCompare(b.name);
  });

  for (let i = 0; i < sortedNodes.length; i++) {
    const node = sortedNodes[i];
    const isLast = i === sortedNodes.length - 1;
    const connector = isLast ? '└── ' : '├── ';
    const childPrefix = prefix + (isLast ? '    ' : '│   ');

    result += `${prefix}${connector}${node.name}\n`;

    if (node.children && node.children.length > 0) {
      result += generateMarkdownTree(node.children, childPrefix);
    }
  }

  return result;
}
