"use strict";
// SMITE Ralph - Spec Lock Mechanism
// Enables agents to pause execution when logical gaps are found
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
exports.SpecLock = void 0;
const fs = __importStar(require("fs/promises"));
const path = __importStar(require("path"));
class SpecLock {
    constructor(smiteDir) {
        this.smiteDir = smiteDir;
        this.lockFilePath = path.join(smiteDir, "spec-lock.json");
    }
    /**
     * Check if spec is currently locked (agent waiting for update)
     */
    async isLocked() {
        try {
            const lockState = await this.loadLock();
            return lockState?.locked ?? false;
        }
        catch {
            return false;
        }
    }
    /**
     * Check if agent should lock (stop execution)
     */
    async checkLockCondition() {
        return this.isLocked();
    }
    /**
     * Report a logic gap and lock execution
     * Called by agent when it finds a logical inconsistency
     */
    async reportGap(storyId, agent, gapDescription) {
        const lockState = {
            locked: true,
            storyId,
            agent,
            gapDescription,
            lockedAt: Date.now(),
        };
        await this.saveLock(lockState);
        console.log("\n🔒 SPEC LOCK ACTIVATED");
        console.log(`   Story: ${storyId}`);
        console.log(`   Agent: ${agent}`);
        console.log(`   Gap: ${gapDescription}`);
        console.log("   ⏸️  Execution paused. Update the spec to continue.\n");
    }
    /**
     * Wait for spec update (poll-based)
     * In production, this could use file watching or events
     */
    async waitForSpecUpdate(timeoutMs = 300000) {
        const startTime = Date.now();
        const checkInterval = 5000; // Check every 5 seconds
        console.log("⏳ Waiting for spec update...");
        while (Date.now() - startTime < timeoutMs) {
            const locked = await this.isLocked();
            if (!locked) {
                console.log("✅ Spec lock released. Resuming execution.\n");
                return true;
            }
            await new Promise((resolve) => setTimeout(resolve, checkInterval));
        }
        console.log("⏰ Timeout waiting for spec update.\n");
        return false;
    }
    /**
     * Release the lock (spec has been updated)
     * Called by user/orchestrator after fixing the gap
     */
    async releaseLock() {
        try {
            await fs.unlink(this.lockFilePath);
            console.log("🔓 Spec lock released.\n");
        }
        catch (error) {
            // File might not exist, that's ok
            console.log("ℹ️  No lock to release.\n");
        }
    }
    /**
     * Get current lock state
     */
    async getLockState() {
        return this.loadLock();
    }
    /**
     * Load lock state from file
     */
    async loadLock() {
        try {
            const content = await fs.readFile(this.lockFilePath, "utf-8");
            return JSON.parse(content);
        }
        catch {
            return null;
        }
    }
    /**
     * Save lock state to file
     */
    async saveLock(lockState) {
        await fs.writeFile(this.lockFilePath, JSON.stringify(lockState, null, 2), "utf-8");
    }
    /**
     * Get lock information as formatted string
     */
    async getLockInfo() {
        const lockState = await this.loadLock();
        if (!lockState || !lockState.locked) {
            return "No active spec lock.";
        }
        const lockedDuration = Math.floor((Date.now() - lockState.lockedAt) / 1000);
        const minutes = Math.floor(lockedDuration / 60);
        const seconds = lockedDuration % 60;
        return `
🔒 SPEC LOCK ACTIVE
==================
Story: ${lockState.storyId}
Agent: ${lockState.agent}
Locked: ${minutes}m ${seconds}s ago

Gap Description:
${lockState.gapDescription}

To release: Update the specification and run spec-release command
    `.trim();
    }
}
exports.SpecLock = SpecLock;
//# sourceMappingURL=spec-lock.js.map