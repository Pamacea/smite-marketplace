/**
 * Tool: update_readme_architecture
 * Updates README.md sections based on project structure and dependencies
 * Following SMITE engineering rules: Zod validation, Result types, pure functions
 */

import * as path from 'path';
import {
  UpdateReadmeInput,
  UpdateReadmeOutput,
  Result,
} from '../readme-types.js';
import { loadPackageJson, getAllDependencies, detectFramework } from '../dependency-monitor.js';
import { scanDirectoryStructure, compareStructures } from '../structure-scanner.js';
import { parseReadmeSections, extractSection } from '../readme-parser.js';
import {
  generateInstallationSection,
  generateArchitectureSection,
  generateStructureSection,
  updateReadmeContent,
  writeReadme,
} from '../readme-updater.js';

/**
 * Execute the update_readme_architecture tool
 */
export async function executeUpdateReadme(
  input: UpdateReadmeInput
): Promise<Result<UpdateReadmeOutput>> {
  // Validate input with Zod (parse, don't validate!)
  const validationResult = await validateInput(input);
  if (!validationResult.success) {
    return validationResult;
  }

  const { projectPath, readmePath, sectionsToUpdate, generateDiff, preserveMarkers } = input;

  try {
    // Step 1: Load package.json
    const pkgResult = await loadPackageJson(projectPath);
    if (!pkgResult.success) {
      return {
        success: false,
        error: new Error(`Failed to load package.json: ${pkgResult.error.message}`),
      };
    }
    const pkg = pkgResult.data;

    // Step 2: Analyze dependencies
    const dependencies = getAllDependencies(pkg);
    const framework = detectFramework(pkg);

    // Step 3: Scan project structure
    const structureResult = await scanDirectoryStructure(projectPath);
    if (!structureResult.success) {
      return {
        success: false,
        error: new Error(`Failed to scan structure: ${structureResult.error.message}`),
      };
    }
    const structure = structureResult.data;

    // Step 4: Parse existing README
    const readmeFullPath = path.join(projectPath, readmePath);
    const sectionsResult = await parseReadmeSections(readmeFullPath);

    if (!sectionsResult.success) {
      // README doesn't exist, will create new one
      console.warn(`README not found at ${readmeFullPath}, will create new sections`);
    }
    const sections = sectionsResult.success ? sectionsResult.data : new Map();

    // Step 5: Generate section updates
    const updates = new Map<string, string>();
    const sectionsUpdated: string[] = [];

    if (sectionsToUpdate.includes('all') || sectionsToUpdate.includes('installation')) {
      const installContent = generateInstallationSection(dependencies, framework, pkg);
      updates.set('installation', installContent);
      sectionsUpdated.push('installation');
    }

    if (sectionsToUpdate.includes('all') || sectionsToUpdate.includes('architecture')) {
      const archContent = generateArchitectureSection(framework, [], pkg);
      updates.set('architecture', archContent);
      sectionsUpdated.push('architecture');
    }

    if (sectionsToUpdate.includes('all') || sectionsToUpdate.includes('structure')) {
      const structContent = generateStructureSection(structure);
      updates.set('structure', structContent);
      sectionsUpdated.push('structure');
    }

    // Step 6: Update README content
    const updateResult = await updateReadmeContent(
      readmeFullPath,
      sections,
      updates,
      { preserveManual: preserveMarkers, generateDiff }
    );

    if (!updateResult.success) {
      return {
        success: false,
        error: new Error(`Failed to update content: ${updateResult.error.message}`),
      };
    }

    // Step 7: Write to file
    const writeResult = await writeReadme(readmeFullPath, updateResult.data.newContent);
    if (!writeResult.success) {
      return {
        success: false,
        error: new Error(`Failed to write README: ${writeResult.error.message}`),
      };
    }

    // Step 8: Return output
    return {
      success: true,
      data: {
        success: true,
        sectionsUpdated,
        dependenciesAdded: dependencies.length, // Simplified
        dependenciesUpdated: 0,
        dependenciesRemoved: 0,
        modulesAdded: structure.length, // Simplified
        modulesRemoved: 0,
        diff: updateResult.data.diff,
        readmePath: readmeFullPath,
      },
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error : new Error(String(error)),
    };
  }
}

/**
 * Validate input using Zod
 */
async function validateInput(input: UpdateReadmeInput): Promise<Result<UpdateReadmeInput>> {
  try {
    // Import schema dynamically to avoid circular dependencies
    const { UpdateReadmeInputSchema } = await import('../readme-types.js');
    const validated = UpdateReadmeInputSchema.parse(input);
    return { success: true, data: validated };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error : new Error(String(error)),
    };
  }
}
