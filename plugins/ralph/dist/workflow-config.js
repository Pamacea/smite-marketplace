"use strict";
// SMITE Ralph - Workflow Configuration Loader
// Loads and manages workflow definitions
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
exports.WorkflowConfigManager = void 0;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
class WorkflowConfigManager {
    constructor(configPath) {
        this.config = null;
        this.configPath =
            configPath || path.join(__dirname, "..", "config", "workflows.json");
    }
    async load() {
        if (this.config) {
            return this.config;
        }
        try {
            const configContent = await fs.promises.readFile(this.configPath, "utf-8");
            this.config = JSON.parse(configContent);
            return this.config;
        }
        catch (error) {
            throw new Error(`Failed to load workflow config from ${this.configPath}: ${error}`);
        }
    }
    async getWorkflow(workflowId) {
        const config = await this.load();
        return config.workflows[workflowId] || null;
    }
    async getDefaultWorkflow() {
        const workflow = await this.getWorkflow("spec-first");
        if (!workflow) {
            throw new Error("Default workflow 'spec-first' not found");
        }
        return workflow;
    }
    async listWorkflows() {
        const config = await this.load();
        return Object.values(config.workflows);
    }
    async getWorkflowSteps(workflowId) {
        const workflow = await this.getWorkflow(workflowId);
        if (!workflow) {
            throw new Error(`Workflow '${workflowId}' not found`);
        }
        return workflow.steps.map((step) => step.id);
    }
    resolveWorkflowSteps(workflow, options) {
        let steps = workflow.steps.map((s) => s.id);
        if (options.steps && options.steps.length > 0) {
            steps = options.steps;
        }
        else {
            if (options.from) {
                const fromIndex = steps.indexOf(options.from);
                if (fromIndex >= 0) {
                    steps = steps.slice(fromIndex);
                }
            }
            if (options.to) {
                const toIndex = steps.indexOf(options.to);
                if (toIndex >= 0) {
                    steps = steps.slice(0, toIndex + 1);
                }
            }
            if (options.skip && options.skip.length > 0) {
                steps = steps.filter((step) => !options.skip.includes(step));
            }
        }
        return steps;
    }
    validateOptions(workflow, options) {
        if (options.steps) {
            const validSteps = new Set(workflow.steps.map((s) => s.id));
            const invalidSteps = options.steps.filter((s) => !validSteps.has(s));
            if (invalidSteps.length > 0) {
                throw new Error(`Invalid steps: ${invalidSteps.join(", ")}`);
            }
        }
        if (options.from) {
            const validSteps = new Set(workflow.steps.map((s) => s.id));
            if (!validSteps.has(options.from)) {
                throw new Error(`Invalid 'from' step: ${options.from}`);
            }
        }
        if (options.to) {
            const validSteps = new Set(workflow.steps.map((s) => s.id));
            if (!validSteps.has(options.to)) {
                throw new Error(`Invalid 'to' step: ${options.to}`);
            }
        }
        if (options.skip) {
            const validSteps = new Set(workflow.steps.map((s) => s.id));
            const invalidSkip = options.skip.filter((s) => !validSteps.has(s));
            if (invalidSkip.length > 0) {
                throw new Error(`Invalid skip steps: ${invalidSkip.join(", ")}`);
            }
        }
    }
}
exports.WorkflowConfigManager = WorkflowConfigManager;
//# sourceMappingURL=workflow-config.js.map