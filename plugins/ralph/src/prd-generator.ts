import { PRD, UserStory } from "./types";
import * as crypto from "crypto";

export class PRDGenerator {
  private static readonly PROJECT_PATTERNS = [
    /build\s+(?:a\s+)?(?:the\s+)?(.+?)(?:\s+(?:app|application|platform|system|website))/i,
    /create\s+(?:a\s+)?(?:the\s+)?(.+?)(?:\s+(?:app|application|platform|system|website))/i,
    /develop\s+(?:a\s+)?(?:the\s+)?(.+?)(?:\s+(?:app|application|platform|system|website))/i,
  ];

  private static readonly ACTION_WORDS =
    /^(build|create|develop|make|implement|construct)\s+(?:a\s+)?(?:the\s+)?/i;
  private static readonly DEFAULT_STORY_COUNT = 3;

  /**
   * Generate unique story ID based on title and timestamp
   * Same title = same ID (for deduplication)
   * Different title = different ID
   */
  private static generateStoryId(title: string): string {
    const hash = crypto.createHash("md5").update(title).digest("hex");
    return `US-${hash.substring(0, 8).toUpperCase()}`;
  }

  static generateFromPrompt(prompt: string, projectName?: string): PRD {
    return {
      project: projectName ?? this.extractProjectName(prompt),
      branchName: this.generateBranchName(prompt, projectName),
      description: this.extractDescription(prompt),
      userStories: this.generateStories(prompt),
    };
  }

  private static generateBranchName(prompt: string, projectName?: string): string {
    const project = projectName ?? this.extractProjectName(prompt);
    return `ralph/${project.toLowerCase().replace(/\s+/g, "-")}`;
  }

  private static extractProjectName(prompt: string): string {
    for (const pattern of this.PROJECT_PATTERNS) {
      const match = prompt.match(pattern);
      if (match) {
        return this.titleCase(match[1].trim());
      }
    }

    const words = prompt.split(/\s+/).slice(0, 3);
    return this.titleCase(words.join(" "));
  }

  private static extractDescription(prompt: string): string {
    const cleaned = prompt.replace(this.ACTION_WORDS, "").trim();
    return cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
  }

  private static titleCase(text: string): string {
    return text.replace(/\b\w/g, (l) => l.toUpperCase());
  }

  private static generateStories(prompt: string): UserStory[] {
    const stories = this.detectFeatureStories(prompt);
    return stories.length > 0 ? stories : [this.createDefaultStory()];
  }

  private static detectFeatureStories(prompt: string): UserStory[] {
    const lowerPrompt = prompt.toLowerCase();
    const hasAuth = lowerPrompt.includes("auth") || lowerPrompt.includes("login");

    if (!hasAuth) return [];

    const setupId = this.generateStoryId("Setup project structure");
    const authId = this.generateStoryId("Implement authentication");

    return [
      this.createStory(
        setupId,
        "Setup project structure",
        "architect:design",
        10,
        [
          "Project structure follows best practices",
          "Dependencies installed",
          "TypeScript configured",
          "Build system working",
        ],
        []
      ),
      this.createStory(
        authId,
        "Implement authentication",
        "builder:build",
        9,
        [
          "Login form working",
          "Password hashing implemented",
          "Session management working",
          "Protected routes functional",
        ],
        [setupId]  // Auth depends on setup
      ),
    ];
  }

  private static createDefaultStory(): UserStory {
    return this.createStory(
      this.generateStoryId("Initialize project"),
      "Initialize project",
      "architect:design",
      10,
      [
        "Project created",
        "Dependencies installed",
        "Basic configuration done",
        "Build system working",
      ],
      []
    );
  }

  private static createStory(
    id: string,
    title: string,
    agent: string,
    priority: number,
    acceptanceCriteria: string[],
    dependencies: string[]
  ): UserStory {
    // Extract tech from agent (e.g., "builder:task" with tech "typescript")
    const tech = this.extractTechFromAgent(agent);

    return {
      id,
      title,
      description: title.toLowerCase() + " implementation",
      acceptanceCriteria,
      priority,
      agent,
      tech,
      dependencies,
      passes: false,
      notes: "",
    };
  }

  private static extractTechFromAgent(agent: string): string {
    // Default technology mapping based on agent type
    const techMap: Record<string, string> = {
      // SMITE skill format (correct)
      "architect:design": "general",
      "builder:build": "typescript", // Default to TypeScript for builder
      "simplifier:simplify": "typescript",
      "explorer:explore": "general",

      // Legacy format (for backward compatibility)
      "architect:task": "general",
      "builder:task": "typescript",
      "simplifier:task": "typescript",
      "explorer:task": "general",

      // Short format
      "architect": "general",
      "builder": "typescript",
      "simplifier": "typescript",
      "explorer": "general",
    };

    return techMap[agent] || "general";
  }

  static suggestImprovements(prd: PRD): string[] {
    return [
      prd.userStories.length < this.DEFAULT_STORY_COUNT &&
        "⚠️  Consider breaking down into more user stories",
      prd.userStories.filter((s) => s.dependencies.length === 0).length > 3 &&
        "⚠️  Too many stories without dependencies - consider adding parallelization opportunities",
      prd.userStories.filter((s) => s.priority < 5).length === prd.userStories.length &&
        "⚠️  All stories have low priority - consider adjusting priorities",
      new Set(prd.userStories.map((s) => s.agent)).size < 3 &&
        "💡 Consider using more specialized agents for better parallelization",
    ].filter(Boolean) as string[];
  }
}
