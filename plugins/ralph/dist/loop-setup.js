"use strict";
// SMITE Ralph - Loop Setup
// Integration with Ralph Wiggum's hook-based looping system
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
exports.setupRalphLoop = setupRalphLoop;
exports.readLoopConfig = readLoopConfig;
exports.incrementLoopIteration = incrementLoopIteration;
exports.clearLoopFile = clearLoopFile;
exports.checkCompletionPromise = checkCompletionPromise;
exports.setupAndExecuteLoop = setupAndExecuteLoop;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const prd_generator_1 = require("./prd-generator");
const prd_parser_1 = require("./prd-parser");
const DEFAULT_MAX_ITERATIONS = Infinity; // No limit by default
const DEFAULT_COMPLETION_PROMISE = "COMPLETE";
/**
 * Setup Ralph Loop with hook-based auto-iteration (async)
 * IMPORTANT: This MERGES with existing PRD instead of overwriting
 */
async function setupRalphLoop(prompt, options = {}) {
    try {
        const maxIterations = options.maxIterations || DEFAULT_MAX_ITERATIONS;
        const completionPromise = options.completionPromise || DEFAULT_COMPLETION_PROMISE;
        // Generate PRD from prompt
        const newPrd = prd_generator_1.PRDGenerator.generateFromPrompt(prompt);
        // Merge with existing PRD (preserves completed stories)
        console.log("\n🔄 Merging PRD with existing...");
        const prdPath = await prd_parser_1.PRDParser.mergePRD(newPrd);
        // Load merged PRD
        const prd = await prd_parser_1.PRDParser.loadFromSmiteDir();
        if (!prd) {
            throw new Error("Failed to load merged PRD");
        }
        console.log(`✅ PRD ready: ${prdPath}`);
        console.log(`   Stories: ${prd.userStories.length} total`);
        console.log(`   Completed: ${prd.userStories.filter((s) => s.passes).length}`);
        // Create .claude directory if it doesn't exist
        const claudeDir = path.join(process.cwd(), ".claude");
        try {
            await fs.promises.mkdir(claudeDir, { recursive: true });
        }
        catch (error) {
            throw new Error(`Failed to create .claude directory: ${error instanceof Error ? error.message : "Unknown error"}`);
        }
        // Create loop file with YAML frontmatter
        const loopFilePath = path.join(claudeDir, "loop.md");
        const config = {
            active: true,
            iteration: 1,
            max_iterations: maxIterations,
            completion_promise: completionPromise,
            started_at: new Date().toISOString(),
            prd_path: prdPath, // Always use standard PRD path
        };
        const loopContent = generateLoopFileContent(config, prd);
        await fs.promises.writeFile(loopFilePath, loopContent, "utf-8");
        console.log(`✅ Loop file created: ${loopFilePath}`);
        return { success: true, loopFilePath, prdPath, prd };
    }
    catch (error) {
        return {
            success: false,
            loopFilePath: "",
            prdPath: "",
            error: error instanceof Error ? error.message : "Unknown error",
        };
    }
}
/**
 * Generate loop file content with YAML frontmatter
 */
function generateLoopFileContent(config, prd) {
    const yamlFrontmatter = [
        "---",
        `active: ${config.active}`,
        `iteration: ${config.iteration}`,
        `max_iterations: ${config.max_iterations}`,
        `completion_promise: ${JSON.stringify(config.completion_promise)}`,
        `started_at: ${config.started_at}`,
        `prd_path: ${config.prd_path}`,
        "---",
        "",
    ].join("\n");
    const promptContent = [
        "# Ralph Loop Execution",
        "",
        `**Iteration: ${config.iteration}/${config.max_iterations}**`,
        `**Started: ${config.started_at}**`,
        "",
        "## Task",
        "",
        prd.description || "Execute the PRD below",
        "",
        "## PRD Details",
        "",
        `**Project:** ${prd.project}`,
        `**Branch:** ${prd.branchName || "main"}`,
        "",
        "## User Stories",
        "",
        ...prd.userStories.map((story) => {
            const status = story.passes ? "✅ DONE" : "⏳ TODO";
            return [
                `### ${status} ${story.id}: ${story.title}`,
                "",
                `**Agent:** \`${story.agent}\``,
                `**Tech:** ${story.tech || "general"}`,
                `**Priority:** ${story.priority}`,
                "",
                story.description,
                "",
                "**Acceptance Criteria:**",
                ...story.acceptanceCriteria.map((c) => `  - ${c}`),
                "",
                story.dependencies.length > 0
                    ? `**Dependencies:** ${story.dependencies.join(", ")}`
                    : "**No dependencies**",
                "",
                story.notes ? `**Notes:** ${story.notes}` : "",
                "",
            ].join("\n");
        }),
        "",
        "## Instructions",
        "",
        "1. Execute remaining user stories in order of priority",
        "2. Use the Task tool to invoke appropriate agents",
        "3. Mark stories as complete by setting `passes: true`",
        "4. Update notes with learnings and issues",
        "5. Commit changes after each successful story",
        "6. When ALL stories are complete, output:",
        `   \`<promise>\${config.completion_promise}</promise>\``,
        "",
        "## Loop Mechanics",
        "",
        "- This prompt will be repeated until completion or max iterations",
        "- Previous work is preserved in files and git history",
        "- Check `.claude/.smite/prd.json` for current story status",
        "- Use `/ralph status` to see progress",
        "",
    ].join("\n");
    return yamlFrontmatter + promptContent;
}
/**
 * Read loop configuration from file (async)
 */
async function readLoopConfig(loopFilePath) {
    const filePath = loopFilePath || path.join(process.cwd(), ".claude", "loop.md");
    try {
        await fs.promises.access(filePath, fs.constants.F_OK);
    }
    catch {
        return null;
    }
    try {
        const content = await fs.promises.readFile(filePath, "utf-8");
        const match = content.match(/^---\n([\s\S]+?)\n---/);
        if (!match) {
            return null;
        }
        const yaml = match[1];
        const config = {};
        yaml.split("\n").forEach((line) => {
            const [key, ...valueParts] = line.split(":");
            if (key && valueParts.length > 0) {
                const value = valueParts.join(":").trim();
                switch (key.trim()) {
                    case "active":
                        config.active = value === "true";
                        break;
                    case "iteration":
                        config.iteration = parseInt(value, 10);
                        break;
                    case "max_iterations":
                        config.max_iterations = parseInt(value, 10);
                        break;
                    case "completion_promise":
                        config.completion_promise = value === "null" ? null : value.replace(/['"]/g, "");
                        break;
                    case "started_at":
                        config.started_at = value;
                        break;
                    case "prd_path":
                        config.prd_path = value;
                        break;
                }
            }
        });
        return config;
    }
    catch {
        return null;
    }
}
/**
 * Update loop iteration counter (async)
 */
async function incrementLoopIteration(loopFilePath) {
    const filePath = loopFilePath || path.join(process.cwd(), ".claude", "loop.md");
    try {
        await fs.promises.access(filePath, fs.constants.F_OK);
    }
    catch {
        return false;
    }
    try {
        const content = await fs.promises.readFile(filePath, "utf-8");
        let updatedContent = content;
        updatedContent = updatedContent.replace(/iteration: (\d+)/, (_, iteration) => `iteration: ${parseInt(iteration, 10) + 1}`);
        await fs.promises.writeFile(filePath, updatedContent, "utf-8");
        return true;
    }
    catch {
        return false;
    }
}
/**
 * Clear loop file (async)
 */
async function clearLoopFile(loopFilePath) {
    const filePath = loopFilePath || path.join(process.cwd(), ".claude", "loop.md");
    try {
        await fs.promises.unlink(filePath);
        return true;
    }
    catch {
        // File doesn't exist or cannot be deleted
        return false;
    }
}
/**
 * Check if output contains completion promise
 */
function checkCompletionPromise(output, promise) {
    const regex = new RegExp(`<promise>\\s*${escapeRegExp(promise)}\\s*</promise>`, "i");
    return regex.test(output);
}
function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
/**
 * Setup Ralph Loop AND execute automatically
 * This is the convenience function for: "Check PRD, merge prompt, execute"
 *
 * By default, executes ALL stories (no limit). Use maxIterations to limit.
 */
async function setupAndExecuteLoop(prompt, options = {}) {
    try {
        // Step 1: Setup loop (merges PRD automatically)
        const setupResult = await setupRalphLoop(prompt, options);
        if (!setupResult.success) {
            return {
                success: false,
                loopFilePath: "",
                prdPath: "",
                error: setupResult.error,
            };
        }
        // Step 2: Import TaskOrchestrator dynamically (avoid circular dependency)
        const { TaskOrchestrator } = await Promise.resolve().then(() => __importStar(require("./task-orchestrator")));
        const smiteDir = path.join(process.cwd(), ".claude", ".smite");
        // Step 3: Execute automatically
        const maxIterations = options.maxIterations ?? Infinity; // Default: unlimited
        console.log("\n🚀 Starting automatic execution...");
        if (options.workflow) {
            console.log(`🔄 Using workflow: ${options.workflow}`);
        }
        if (maxIterations !== Infinity) {
            console.log(`⚠️  Limited to ${maxIterations} stories`);
        }
        else {
            if (!setupResult.prd) {
                return {
                    success: false,
                    loopFilePath: "",
                    prdPath: "",
                    error: "PRD not loaded after setup",
                };
            }
            console.log(`✅ Will execute all ${setupResult.prd.userStories.length} stories`);
        }
        console.log();
        const orchestrator = new TaskOrchestrator(setupResult.prd, smiteDir, {
            workflow: options.workflow,
            workflowOptions: options.workflowOptions,
            mcpEnabled: options.mcpEnabled ?? true,
        });
        const state = await orchestrator.execute(maxIterations);
        return {
            success: true,
            loopFilePath: setupResult.loopFilePath,
            prdPath: setupResult.prdPath,
            state,
        };
    }
    catch (error) {
        return {
            success: false,
            loopFilePath: "",
            prdPath: "",
            error: error instanceof Error ? error.message : "Unknown error",
        };
    }
}
//# sourceMappingURL=loop-setup.js.map