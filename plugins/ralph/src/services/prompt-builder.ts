/**
 * Prompt Builder - Builds agent prompts from user stories
 *
 * @module services/prompt-builder
 */

import type { UserStory } from "../types";

/**
 * Build agent prompt from user story
 */
export function buildPrompt(story: UserStory, specPath?: string): string {
  const parts: string[] = [
    `Story ID: ${story.id}`,
    `Title: ${story.title}`,
    `Description: ${story.description}`,
    "",
  ];

  if (specPath) {
    parts.push("**SPEC-FIRST MODE ENABLED**");
    parts.push("");
    parts.push(`You MUST read the specification at: ${specPath}`);
    parts.push("");
    parts.push("Follow the specification EXACTLY:");
    parts.push("1. Read the spec completely before starting");
    parts.push("2. Implement steps in the order defined");
    parts.push("3. DO NOT deviate from the spec without updating it first");
    parts.push("4. If you find a logic gap: STOP, report it, wait for spec update");
    parts.push("");
  }

  parts.push("Acceptance Criteria:");
  parts.push(...story.acceptanceCriteria.map((c, i) => `  ${i + 1}. ${c}`));
  parts.push("");

  if (story.dependencies.length > 0) {
    parts.push(`Dependencies: ${story.dependencies.join(", ")}`);
  } else {
    parts.push("No dependencies - can start immediately");
  }

  return parts.join("\n");
}
