"use strict";
// SMITE Ralph - Spec Generator
// Decouples thinking from action by creating technical specifications before coding
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.SpecGenerator = void 0;
const fs = __importStar(require("fs/promises"));
const path = __importStar(require("path"));
class SpecGenerator {
    constructor(smiteDir) {
        this.smiteDir = smiteDir;
        this.specsDir = path.join(smiteDir, "specs");
    }
    /**
     * Generate technical specification from user story
     * This extracts the "thinking" phase before any coding begins
     */
    async generateSpec(story) {
        const spec = {
            storyId: story.id,
            objective: this.extractObjective(story),
            approach: this.determineApproach(story),
            steps: this.breakdownSteps(story),
            validationCriteria: story.acceptanceCriteria,
            risks: this.identifyRisks(story),
            createdAt: Date.now(),
        };
        return spec;
    }
    /**
     * Write specification to .claude/.smite/current_spec.md
     */
    async writeSpec(spec) {
        await this.ensureDirectories();
        const currentSpecPath = path.join(this.smiteDir, "current_spec.md");
        const content = this.formatSpec(spec);
        await fs.writeFile(currentSpecPath, content, "utf-8");
        // Archive copy with story ID
        const archivePath = path.join(this.specsDir, `${spec.storyId}-spec.md`);
        await fs.writeFile(archivePath, content, "utf-8");
        return currentSpecPath;
    }
    /**
     * Validate specification for coherence and completeness
     */
    async validateSpec(spec) {
        const gaps = [];
        const warnings = [];
        // Check 1: Has clear objective
        if (!spec.objective || spec.objective.length < 20) {
            gaps.push("Objective is unclear or too vague");
        }
        // Check 2: Has defined approach
        if (!spec.approach || spec.approach.length < 30) {
            gaps.push("Technical approach is not well defined");
        }
        // Check 3: Has implementation steps
        if (!spec.steps || spec.steps.length === 0) {
            gaps.push("No implementation steps defined");
        }
        // Check 4: Each step has required fields
        spec.steps.forEach((step, index) => {
            if (!step.description) {
                gaps.push(`Step ${index + 1}: Missing description`);
            }
            if (!step.files || step.files.length === 0) {
                warnings.push(`Step ${index + 1}: No files specified`);
            }
        });
        // Check 5: Has validation criteria
        if (!spec.validationCriteria || spec.validationCriteria.length === 0) {
            gaps.push("No validation criteria defined");
        }
        // Check 6: Dependencies are satisfied
        const stepIds = spec.steps.map((_, i) => i);
        spec.steps.forEach((step, index) => {
            step.dependencies.forEach((dep) => {
                const depIndex = parseInt(dep.replace(/\D/g, "")) - 1;
                if (depIndex >= index) {
                    gaps.push(`Step ${index + 1}: Invalid dependency on future step ${dep}`);
                }
            });
        });
        return {
            valid: gaps.length === 0,
            gaps,
            warnings,
        };
    }
    /**
     * Load current spec if it exists
     */
    async loadCurrentSpec() {
        const currentSpecPath = path.join(this.smiteDir, "current_spec.md");
        try {
            const content = await fs.readFile(currentSpecPath, "utf-8");
            return this.parseSpec(content);
        }
        catch {
            return null;
        }
    }
    /**
     * Extract clear objective from user story
     */
    extractObjective(story) {
        return `${story.title}\n\n${story.description}`;
    }
    /**
     * Determine technical approach based on story agent and tech
     */
    determineApproach(story) {
        const agentApproaches = {
            // SMITE skill format (correct)
            "builder:build": `Implementation using ${story.tech} stack following project conventions`,
            "explorer:explore": "Codebase analysis using grep and file search patterns",
            "architect:design": "Architecture design with technical specifications",
            "simplifier:simplify": "Code refactoring while preserving functionality",
            // Legacy format (for backward compatibility)
            "builder:task": `Implementation using ${story.tech} stack following project conventions`,
            "explorer:task": "Codebase analysis using grep and file search patterns",
            "architect:task": "Architecture design with technical specifications",
            "simplifier:task": "Code refactoring while preserving functionality",
        };
        return agentApproaches[story.agent] || "Standard implementation approach";
    }
    /**
     * Break down story into implementation steps
     * This is the core "thinking" work that happens before coding
     */
    breakdownSteps(story) {
        // This is a placeholder - in real implementation, this would use
        // an LLM call to analyze the story and generate detailed steps
        return [
            {
                description: "Analyze existing codebase patterns",
                files: [],
                signatures: [],
                dependencies: [],
            },
            {
                description: "Implement core functionality",
                files: [],
                signatures: [],
                dependencies: ["1"],
            },
            {
                description: "Validate against acceptance criteria",
                files: [],
                signatures: [],
                dependencies: ["2"],
            },
        ];
    }
    /**
     * Identify potential risks in implementation
     */
    identifyRisks(story) {
        const risks = [];
        if (story.dependencies.length > 0) {
            risks.push({
                risk: "Dependency stories may not be complete",
                mitigation: "Verify all dependency stories have passes=true",
            });
        }
        if (story.tech === "rust") {
            risks.push({
                risk: "Ownership and borrowing complexity",
                mitigation: "Follow Rust best practices and use clippy",
            });
        }
        return risks;
    }
    /**
     * Format specification as markdown
     */
    formatSpec(spec) {
        const lines = [
            `# Technical Specification: ${spec.storyId}`,
            "",
            `**Created:** ${new Date(spec.createdAt).toISOString()}`,
            "",
            "## Objective",
            spec.objective,
            "",
            "## Approach",
            spec.approach,
            "",
            "## Implementation Steps",
            "",
        ];
        spec.steps.forEach((step, index) => {
            lines.push(`### Step ${index + 1}: ${step.description}`);
            lines.push("");
            if (step.files.length > 0) {
                lines.push("- **Files:**");
                step.files.forEach((file) => lines.push(`  - ${file}`));
                lines.push("");
            }
            if (step.signatures.length > 0) {
                lines.push("- **Function Signatures:**");
                step.signatures.forEach((sig) => lines.push(`  \`\`\`typescript\n  ${sig}\n  \`\`\``));
                lines.push("");
            }
            if (step.dependencies.length > 0) {
                lines.push(`- **Dependencies:** Step ${step.dependencies.join(", ")}`);
                lines.push("");
            }
        });
        lines.push("## Validation Criteria");
        spec.validationCriteria.forEach((criterion, index) => {
            lines.push(`- [ ] ${criterion}`);
        });
        lines.push("");
        if (spec.risks.length > 0) {
            lines.push("## Known Risks");
            spec.risks.forEach((risk) => {
                lines.push(`- **${risk.risk}**: ${risk.mitigation}`);
            });
            lines.push("");
        }
        return lines.join("\n");
    }
    /**
     * Parse specification from markdown
     */
    parseSpec(content) {
        // Simplified parsing - in production, use proper markdown parser
        const match = content.match(/^# Technical Specification: (.+)$/m);
        if (!match)
            return null;
        return {
            storyId: match[1],
            objective: "",
            approach: "",
            steps: [],
            validationCriteria: [],
            risks: [],
            createdAt: Date.now(),
        };
    }
    /**
     * Ensure required directories exist
     */
    async ensureDirectories() {
        try {
            await fs.mkdir(this.specsDir, { recursive: true });
        }
        catch (error) {
            console.error("Failed to create specs directory:", error);
        }
    }
}
exports.SpecGenerator = SpecGenerator;
//# sourceMappingURL=spec-generator.js.map