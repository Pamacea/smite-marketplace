/**
 * Dependency Monitor - Monitors package.json for changes
 * Following SMITE engineering rules: Pure functions, immutable data, Result types
 */

import * as fs from 'fs/promises';
import * as path from 'path';
import {
  DependencyInfo,
  DependencyChange,
  Result,
} from './readme-types.js';

/**
 * Load and parse package.json
 */
export async function loadPackageJson(projectPath: string): Promise<Result<any>> {
  try {
    const pkgPath = path.join(projectPath, 'package.json');
    const content = await fs.readFile(pkgPath, 'utf-8');
    const pkg = JSON.parse(content);

    return { success: true, data: pkg };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error : new Error(String(error)),
    };
  }
}

/**
 * Compare two dependency sets and detect changes
 */
export function compareDependencies(
  oldDeps: Record<string, string>,
  newDeps: Record<string, string>,
  type: 'dependency' | 'devDependency'
): DependencyChange {
  const added: DependencyInfo[] = [];
  const updated: DependencyInfo[] = [];
  const removed: DependencyInfo[] = [];
  const unchanged: DependencyInfo[] = [];

  const allNames = new Set([...Object.keys(oldDeps), ...Object.keys(newDeps)]);

  for (const name of allNames) {
    const oldVersion = oldDeps[name];
    const newVersion = newDeps[name];

    if (!oldVersion) {
      // New dependency
      added.push({ name, version: newVersion, type });
    } else if (!newVersion) {
      // Removed dependency
      removed.push({ name, version: oldVersion, type });
    } else if (oldVersion !== newVersion) {
      // Version changed
      updated.push({ name, version: newVersion, type });
    } else {
      // Unchanged
      unchanged.push({ name, version: newVersion, type });
    }
  }

  return { added, updated, removed, unchanged };
}

/**
 * Analyze dependencies from package.json
 */
export async function analyzeDependencies(
  projectPath: string,
  previousState?: Record<string, Record<string, string>>
): Promise<Result<DependencyChange>> {
  // Load current package.json
  const loadResult = await loadPackageJson(projectPath);

  if (!loadResult.success) {
    return loadResult;
  }

  const pkg = loadResult.data;

  const currentDeps = pkg.dependencies || {};
  const currentDevDeps = pkg.devDependencies || {};

  const prevDeps = previousState?.dependencies || {};
  const prevDevDeps = previousState?.devDependencies || {};

  // Compare dependencies
  const depChanges = compareDependencies(prevDeps, currentDeps, 'dependency');
  const devDepChanges = compareDependencies(prevDevDeps, currentDevDeps, 'devDependency');

  // Merge changes
  const merged: DependencyChange = {
    added: [...depChanges.added, ...devDepChanges.added],
    updated: [...depChanges.updated, ...devDepChanges.updated],
    removed: [...depChanges.removed, ...devDepChanges.removed],
    unchanged: [...depChanges.unchanged, ...devDepChanges.unchanged],
  };

  return { success: true, data: merged };
}

/**
 * Get all dependencies as a sorted list
 */
export function getAllDependencies(pkg: any): DependencyInfo[] {
  const deps: DependencyInfo[] = [];

  const dependencies = pkg.dependencies || {};
  const devDependencies = pkg.devDependencies || {};

  for (const [name, version] of Object.entries(dependencies)) {
    deps.push({ name, version: String(version), type: 'dependency' });
  }

  for (const [name, version] of Object.entries(devDependencies)) {
    deps.push({ name, version: String(version), type: 'devDependency' });
  }

  // Sort by name
  return deps.sort((a, b) => a.name.localeCompare(b.name));
}

/**
 * Detect framework from dependencies
 */
export function detectFramework(pkg: any): string | null {
  const deps = {
    ...pkg.dependencies,
    ...pkg.devDependencies,
  };

  // Check for frameworks
  if (deps.next || deps['@next/font']) return 'nextjs';
  if (deps.express) return 'express';
  if (deps['@nestjs/core'] || deps['@nestjs/common']) return 'nestjs';
  if (deps.react || deps['@types/react']) return 'react';
  if (deps.vue) return 'vue';
  if (deps['@angular/core']) return 'angular';

  return null;
}
