/**
 * Agent Mapper - Maps legacy agent names to SMITE skill format
 *
 * @module services/agent-mapper
 */

/**
 * Map legacy agent names to correct SMITE skill format
 * Converts: builder:task -> builder:build, architect:task -> architect:design, etc.
 */
export function mapAgentToSkill(agent: string): string {
  const cleanAgent = agent.trim();

  const skillMapping: Record<string, string> = {
    // Builder agent mappings
    "builder:task": "builder:build",
    "builder:builder": "builder:build",
    "builder:constructor": "builder:build",
    "builder:smite-constructor": "builder:build",
    "builder": "builder:build",

    // Architect agent mappings
    "architect:task": "architect:design",
    "architect:architect": "architect:design",
    "architect:strategist": "architect:design",
    "architect": "architect:design",

    // Explorer agent mappings
    "explorer:task": "explorer:explore",
    "explorer:explorer": "explorer:explore",
    "explorer": "explorer:explore",

    // Simplifier agent mappings
    "simplifier:task": "simplifier:simplify",
    "simplifier:simplifier": "simplifier:simplify",
    "simplifier:surgeon": "simplifier:simplify",
    "simplifier": "simplifier:simplify",
  };

  return skillMapping[cleanAgent] || cleanAgent;
}
