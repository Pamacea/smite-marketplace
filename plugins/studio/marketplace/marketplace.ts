/**
 * SMITE Skill Marketplace
 *
 * Discover, install, and manage community skills from external sources.
 *
 * Benefits:
 * - Access to community-contributed skills
 * - Easy installation and updates
 * - Version management
 * - Dependency resolution
 */

import { z } from 'zod';

export const MarketplaceSourceSchema = z.object({
  name: z.string(),
  url: z.string().url(),
  type: z.enum(['github', 'gitlab', 'local']),
  enabled: z.boolean().default(true)
});

export type MarketplaceSource = z.infer<typeof MarketplaceSourceSchema>;

export const SkillManifestSchema = z.object({
  name: z.string(),
  version: z.string(),
  description: z.string(),
  author: z.string(),
  repository: z.string().url().optional(),
  tags: z.array(z.string()),
  category: z.string(),
  dependencies: z.array(z.string()).optional(),
  smite_version: z.string().optional(),
  skills: z.array(z.object({
    name: z.string(),
    file: z.string(),
    description: z.string()
  }))
});

export type SkillManifest = z.infer<typeof SkillManifestSchema>;

export interface InstalledSkill {
  name: string;
  version: string;
  source: string;
  installedAt: Date;
  manifest: SkillManifest;
  path: string;
}

/**
 * Marketplace Manager
 */
export class MarketplaceManager {
  private sources: Map<string, MarketplaceSource> = new Map();
  private installedSkills: Map<string, InstalledSkill> = new Map();
  private configPath: string;
  private installPath: string;

  constructor(
    configPath: string = '.claude/marketplace.json',
    installPath: string = 'plugins/agents/community'
  ) {
    this.configPath = configPath;
    this.installPath = installPath;
  }

  /**
   * Initialize marketplace
   */
  async initialize(): Promise<void> {
    await this.loadConfig();
    await this.loadInstalledSkills();
    console.log('✓ Skill Marketplace initialized');
  }

  /**
   * Load marketplace configuration
   */
  private async loadConfig(): Promise<void> {
    try {
      const fs = await import('fs/promises');
      const configContent = await fs.readFile(this.configPath, 'utf-8');
      const config = JSON.parse(configContent);

      for (const source of config.sources || []) {
        const validated = MarketplaceSourceSchema.parse(source);
        this.sources.set(validated.name, validated);
      }
    } catch (error) {
      // Create default config if not exists
      await this.createDefaultConfig();
    }
  }

  /**
   * Create default marketplace configuration
   */
  private async createDefaultConfig(): Promise<void> {
    const defaultConfig = {
      sources: [
        {
          name: 'official',
          url: 'https://github.com/yanis-smite/smite-skills',
          type: 'github',
          enabled: true
        },
        {
          name: 'community',
          url: 'https://github.com/smite-community/skills',
          type: 'github',
          enabled: true
        }
      ]
    };

    const fs = await import('fs/promises');
    await fs.mkdir('.claude', { recursive: true });
    await fs.writeFile(this.configPath, JSON.stringify(defaultConfig, null, 2));

    // Load into memory
    for (const source of defaultConfig.sources) {
      this.sources.set(source.name, source);
    }
  }

  /**
   * Load installed skills registry
   */
  private async loadInstalledSkills(): Promise<void> {
    try {
      const fs = await import('fs/promises');
      const registryPath = '.claude/skills-registry.json';
      const registryContent = await fs.readFile(registryPath, 'utf-8');
      const registry = JSON.parse(registryContent);

      for (const skill of registry.installed || []) {
        this.installedSkills.set(skill.name, skill);
      }
    } catch (error) {
      // Registry doesn't exist yet, that's fine
    }
  }

  /**
   * Save installed skills registry
   */
  private async saveInstalledSkills(): Promise<void> {
    const fs = await import('fs/promises');
    const registryPath = '.claude/skills-registry.json';
    const registry = {
      installed: Array.from(this.installedSkills.values()),
      lastUpdated: new Date().toISOString()
    };

    await fs.writeFile(registryPath, JSON.stringify(registry, null, 2));
  }

  /**
   * Search for skills across all sources
   */
  async search(query: string, options?: {
    category?: string;
    tags?: string[];
    limit?: number;
  }): Promise<SkillManifest[]> {
    const results: SkillManifest[] = [];

    for (const [name, source] of this.sources) {
      if (!source.enabled) continue;

      try {
        const skills = await this.searchSource(source, query, options);
        results.push(...skills);
      } catch (error) {
        console.error(`Failed to search ${name}:`, error);
      }
    }

    return options?.limit ? results.slice(0, options.limit) : results;
  }

  /**
   * Search a specific source
   */
  private async searchSource(
    source: MarketplaceSource,
    query: string,
    options?: {
      category?: string;
      tags?: string[];
    }
  ): Promise<SkillManifest[]> {
    // For GitHub sources, we'd use GitHub API
    // For now, stub implementation
    console.log(`Searching ${source.name} for "${query}"...`);
    return [];
  }

  /**
   * Install a skill from marketplace
   */
  async install(
    sourceName: string,
    skillName: string,
    version?: string
  ): Promise<InstalledSkill> {
    const source = this.sources.get(sourceName);
    if (!source) {
      throw new Error(`Source not found: ${sourceName}`);
    }

    console.log(`Installing ${skillName} from ${sourceName}...`);

    // Download skill manifest
    const manifest = await this.downloadManifest(source, skillName);
    const validatedManifest = SkillManifestSchema.parse(manifest);

    // Check dependencies
    if (validatedManifest.dependencies) {
      await this.installDependencies(validatedManifest.dependencies);
    }

    // Download and install skill files
    const skillPath = await this.downloadSkill(source, validatedManifest);

    // Register as installed
    const installedSkill: InstalledSkill = {
      name: skillName,
      version: validatedManifest.version,
      source: sourceName,
      installedAt: new Date(),
      manifest: validatedManifest,
      path: skillPath
    };

    this.installedSkills.set(skillName, installedSkill);
    await this.saveInstalledSkills();

    console.log(`✓ Installed ${skillName} v${validatedManifest.version}`);
    return installedSkill;
  }

  /**
   * Download skill manifest from source
   */
  private async downloadManifest(
    source: MarketplaceSource,
    skillName: string
  ): Promise<any> {
    // Stub: would download from GitHub API or similar
    console.log(`Downloading manifest for ${skillName} from ${source.url}...`);
    return null;
  }

  /**
   * Download skill files
   */
  private async downloadSkill(
    source: MarketplaceSource,
    manifest: SkillManifest
  ): Promise<string> {
    const fs = await import('fs/promises');
    const path = await import('path');

    const skillPath = path.join(this.installPath, manifest.name);
    await fs.mkdir(skillPath, { recursive: true });

    // Download each skill file
    for (const skill of manifest.skills) {
      const filePath = path.join(skillPath, skill.file);
      // Stub: would download actual file
      console.log(`Downloading ${skill.file}...`);
    }

    return skillPath;
  }

  /**
   * Install skill dependencies
   */
  private async installDependencies(dependencies: string[]): Promise<void> {
    for (const dep of dependencies) {
      if (!this.installedSkills.has(dep)) {
        console.log(`Installing dependency: ${dep}`);
        // Would install from marketplace
      }
    }
  }

  /**
   * Uninstall a skill
   */
  async uninstall(skillName: string): Promise<void> {
    const skill = this.installedSkills.get(skillName);
    if (!skill) {
      throw new Error(`Skill not installed: ${skillName}`);
    }

    console.log(`Uninstalling ${skillName}...`);

    // Remove skill files
    const fs = await import('fs/promises');
    await fs.rm(skill.path, { recursive: true, force: true });

    // Unregister
    this.installedSkills.delete(skillName);
    await this.saveInstalledSkills();

    console.log(`✓ Uninstalled ${skillName}`);
  }

  /**
   * Update a skill to latest version
   */
  async update(skillName: string): Promise<InstalledSkill> {
    const skill = this.installedSkills.get(skillName);
    if (!skill) {
      throw new Error(`Skill not installed: ${skillName}`);
    }

    console.log(`Updating ${skillName}...`);

    // Uninstall current version
    await this.uninstall(skillName);

    // Install latest version
    return this.install(skill.source, skillName);
  }

  /**
   * Update all installed skills
   */
  async updateAll(): Promise<void> {
    console.log('Updating all skills...');

    const skills = Array.from(this.installedSkills.keys());
    for (const skillName of skills) {
      try {
        await this.update(skillName);
      } catch (error) {
        console.error(`Failed to update ${skillName}:`, error);
      }
    }

    console.log('✓ All skills updated');
  }

  /**
   * List installed skills
   */
  list(): InstalledSkill[] {
    return Array.from(this.installedSkills.values());
  }

  /**
   * Get skill info
   */
  info(skillName: string): InstalledSkill | undefined {
    return this.installedSkills.get(skillName);
  }

  /**
   * Add a new marketplace source
   */
  async addSource(source: MarketplaceSource): Promise<void> {
    const validated = MarketplaceSourceSchema.parse(source);
    this.sources.set(validated.name, validated);

    // Save to config
    await this.saveConfig();
    console.log(`✓ Added source: ${validated.name}`);
  }

  /**
   * Remove a marketplace source
   */
  async removeSource(sourceName: string): Promise<void> {
    this.sources.delete(sourceName);
    await this.saveConfig();
    console.log(`✓ Removed source: ${sourceName}`);
  }

  /**
   * Save marketplace configuration
   */
  private async saveConfig(): Promise<void> {
    const fs = await import('fs/promises');
    const config = {
      sources: Array.from(this.sources.values())
    };

    await fs.writeFile(this.configPath, JSON.stringify(config, null, 2));
  }
}

/**
 * Global marketplace instance
 */
export const marketplace = new MarketplaceManager();

/**
 * Initialize marketplace
 */
export async function initMarketplace(): Promise<void> {
  await marketplace.initialize();
}

/**
 * Quick access functions
 */
export const Market = {
  search: (query: string, options?: { category?: string; tags?: string[]; limit?: number }) =>
    marketplace.search(query, options),

  install: (source: string, skill: string, version?: string) =>
    marketplace.install(source, skill, version),

  uninstall: (skill: string) =>
    marketplace.uninstall(skill),

  update: (skill: string) =>
    marketplace.update(skill),

  updateAll: () =>
    marketplace.updateAll(),

  list: () =>
    marketplace.list(),

  info: (skill: string) =>
    marketplace.info(skill),

  addSource: (source: MarketplaceSource) =>
    marketplace.addSource(source),

  removeSource: (sourceName: string) =>
    marketplace.removeSource(sourceName)
};
