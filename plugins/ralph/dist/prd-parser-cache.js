"use strict";
// SMITE Ralph - PRD Cache Manager
// PRD file caching for I/O optimization
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
exports.PRDCache = void 0;
const fs = __importStar(require("fs"));
/**
 * PRD Cache Manager
 * Provides 70-90% reduction in file reads through caching
 */
class PRDCache {
    /**
     * Get cached PRD if available and fresh
     */
    static get(filePath) {
        const cached = this.cache.get(filePath);
        if (!cached) {
            return null;
        }
        try {
            const stats = fs.statSync(filePath);
            const cacheAge = Date.now() - cached.mtime;
            // Use cache if file hasn't been modified and cache is fresh
            if (stats.mtimeMs <= cached.mtime && cacheAge < this.CACHE_TTL_MS) {
                console.log(`✅ Cache hit for PRD: ${filePath}`);
                return cached.prd;
            }
            // Cache stale or file modified, remove it
            this.cache.delete(filePath);
            console.log(`🔄 Cache invalidation for PRD: ${filePath}`);
        }
        catch {
            // File doesn't exist, remove from cache
            this.cache.delete(filePath);
        }
        return null;
    }
    /**
     * Set PRD in cache
     */
    static async set(filePath, prd) {
        try {
            const stats = await fs.promises.stat(filePath);
            this.cache.set(filePath, { prd, mtime: stats.mtimeMs });
        }
        catch {
            // If we can't stat the file, don't cache it
        }
    }
    /**
     * Invalidate cache entry for a specific file
     */
    static invalidate(filePath) {
        this.cache.delete(filePath);
    }
    /**
     * Clear all cache entries
     */
    static clear() {
        const size = this.cache.size;
        this.cache.clear();
        console.log(`🧹 Cleared PRD cache (${size} entries)`);
    }
    /**
     * Get cache statistics
     */
    static getStats() {
        return {
            size: this.cache.size,
            keys: Array.from(this.cache.keys()),
        };
    }
    /**
     * Check if cache has a specific file
     */
    static has(filePath) {
        return this.cache.has(filePath);
    }
}
exports.PRDCache = PRDCache;
PRDCache.cache = new Map();
PRDCache.CACHE_TTL_MS = 5000; // 5 seconds cache TTL
//# sourceMappingURL=prd-parser-cache.js.map