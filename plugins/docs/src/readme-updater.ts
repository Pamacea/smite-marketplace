/**
 * README Updater - Generate and update README sections
 * Following SMITE engineering rules: Pure functions, immutable data, Result types
 */

import * as fs from 'fs/promises';
import * as path from 'path';
import {
  DependencyInfo,
  DependencyChange,
  StructureNode,
  ReadmeSection,
  Result,
  FRAMEWORK_PATTERNS,
  Framework,
} from './readme-types.js';
import { getAllDependencies, detectFramework } from './dependency-monitor.js';
import { generateMarkdownTree } from './structure-scanner.js';

/**
 * Generate Installation section
 */
export function generateInstallationSection(
  dependencies: DependencyInfo[],
  framework: string | null,
  pkg: any
): string {
  let markdown = '## Installation\n\n';

  // Framework-specific setup
  if (framework === 'nextjs') {
    markdown += '```bash\nnpx create-next-app@latest my-app\n```\n\n';
  } else if (framework === 'express') {
    markdown += '```bash\nnpm install express\n```\n\n';
  } else if (framework === 'nestjs') {
    markdown += '```bash\nnpm install -g @nestjs/cli\nnest new project-name\n```\n\n';
  } else if (framework === 'react') {
    markdown += '```bash\nnpx create-react-app my-app\n```\n\n';
  } else if (framework === 'vue') {
    markdown += '```bash\nnpm create vue@latest\n```\n\n';
  }

  // Add npm install instructions
  markdown += '### Install Dependencies\n\n';
  markdown += '```bash\nnpm install\n```\n\n';

  // Separate dependencies and devDependencies
  const deps = dependencies.filter(d => d.type === 'dependency');
  const devDeps = dependencies.filter(d => d.type === 'devDependency');

  if (deps.length > 0) {
    markdown += '### Dependencies\n\n';
    markdown += '| Package | Version |\n';
    markdown += '|---------|----------|\n';
    for (const dep of deps) {
      markdown += `| \`${dep.name}\` | ${dep.version} |\n`;
    }
    markdown += '\n';
  }

  if (devDeps.length > 0) {
    markdown += '### Dev Dependencies\n\n';
    markdown += '| Package | Version |\n';
    markdown += '|---------|----------|\n';
    for (const dep of devDeps) {
      markdown += `| \`${dep.name}\` | ${dep.version} |\n`;
    }
    markdown += '\n';
  }

  return markdown;
}

/**
 * Generate Architecture section
 */
export function generateArchitectureSection(
  framework: string | null,
  modulePatterns: any[],
  pkg: any
): string {
  let markdown = '## Architecture\n\n';

  // Framework description
  if (framework) {
    markdown += `Built with **${framework}**.\n\n`;
  }

  // Project description from package.json
  if (pkg.description) {
    markdown += `${pkg.description}\n\n`;
  }

  // Module organization
  if (modulePatterns.length > 0) {
    markdown += '### Module Organization\n\n';
    markdown += 'This project is organized into the following modules:\n\n';

    const categorized = modulePatterns.reduce((acc, pattern) => {
      if (!acc[pattern.type]) {
        acc[pattern.type] = [];
      }
      acc[pattern.type].push(pattern);
      return acc;
    }, {} as Record<string, any[]>);

    for (const [type, moduleList] of Object.entries(categorized)) {
      markdown += `#### ${type.charAt(0).toUpperCase() + type.slice(1)}\n\n`;
      for (const mod of moduleList as any[]) {
        markdown += `- **${mod.name}** - ${mod.fileCount} files\n`;
      }
      markdown += '\n';
    }
  }

  return markdown;
}

/**
 * Generate Project Structure section
 */
export function generateStructureSection(structure: StructureNode[]): string {
  let markdown = '## Project Structure\n\n';
  markdown += '```\n';
  markdown += generateMarkdownTree(structure);
  markdown += '```\n\n';

  return markdown;
}

/**
 * Update README content with new sections
 */
export async function updateReadmeContent(
  readmePath: string,
  sections: Map<string, ReadmeSection>,
  updates: Map<string, string>,
  options: {
    preserveManual?: boolean;
    generateDiff?: boolean;
  } = {}
): Promise<Result<{ newContent: string; diff?: string }>> {
  try {
    const { preserveManual = true, generateDiff = true } = options;

    // Load original content
    const contentResult = await fs.readFile(readmePath, 'utf-8');
    const oldContent = contentResult;

    // Apply updates
    let newContent = oldContent;
    const lines = oldContent.split('\n');

    for (const [sectionName, newSectionContent] of updates.entries()) {
      const section = sections.get(sectionName);

      if (section) {
        // Section exists, update it
        if (!section.isProtected || !preserveManual) {
          // Replace section content
          const sectionLines = section.content.split('\n');
          const beforeLines = lines.slice(0, section.lineStart);
          const afterLines = lines.slice(section.lineEnd + 1);

          const updatedLines = [
            ...beforeLines,
            ...newSectionContent.split('\n'),
            ...afterLines,
          ];

          newContent = updatedLines.join('\n');
        }
      } else {
        // Section doesn't exist, append to end
        newContent += '\n\n' + newSectionContent;
      }
    }

    // Generate diff
    let diff: string | undefined;
    if (generateDiff) {
      diff = generateSectionDiff(oldContent, newContent);
    }

    return {
      success: true,
      data: { newContent, diff },
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error : new Error(String(error)),
    };
  }
}

/**
 * Generate simple diff for a section
 */
function generateSectionDiff(oldContent: string, newContent: string): string {
  const oldLines = oldContent.split('\n');
  const newLines = newContent.split('\n');

  let diff = '';
  const maxLines = Math.max(oldLines.length, newLines.length);

  for (let i = 0; i < maxLines; i++) {
    const oldLine = oldLines[i];
    const newLine = newLines[i];

    if (oldLine === newLine) {
      continue; // Skip unchanged lines in diff
    }

    if (oldLine && !newLine) {
      diff += `- ${oldLine}\n`;
    } else if (!oldLine && newLine) {
      diff += `+ ${newLine}\n`;
    } else if (oldLine !== newLine) {
      diff += `- ${oldLine}\n`;
      diff += `+ ${newLine}\n`;
    }
  }

  return diff;
}

/**
 * Write updated README to file
 */
export async function writeReadme(
  readmePath: string,
  content: string
): Promise<Result<void>> {
  try {
    await fs.writeFile(readmePath, content, 'utf-8');
    return { success: true, data: undefined };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error : new Error(String(error)),
    };
  }
}
