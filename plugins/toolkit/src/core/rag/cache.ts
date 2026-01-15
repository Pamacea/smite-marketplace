/**
 * Semantic Cache - Content caching with similarity matching
 *
 * Implements semantic caching with cosine similarity to identify
 * related queries and reuse cached content, improving performance
 * and reducing redundant processing.
 */

import { v4 as uuidv4 } from 'uuid';

/**
 * Cache entry
 */
export interface CacheEntry {
  id: string;
  query: string;
  filePath: string;
  content: string;
  tokens: number;
  timestamp: number;
  accessCount: number;
  lastAccess: number;
}

/**
 * Cache statistics
 */
export interface CacheStats {
  hits: number;
  misses: number;
  hitRate: number;
  totalEntries: number;
}

/**
 * Similarity result
 */
export interface SimilarityResult {
  entry: CacheEntry;
  similarity: number;
}

/**
 * Semantic Cache configuration
 */
export interface CacheConfig {
  maxSize: number;
  ttl: number;
  similarityThreshold: number;
}

/**
 * Default configuration
 */
export const DEFAULT_CACHE_CONFIG: CacheConfig = {
  maxSize: 100,
  ttl: 3600000,    // 1 hour in milliseconds
  similarityThreshold: 0.8,  // 80% similarity threshold
};

/**
 * Semantic Cache class
 */
export class SemanticCache {
  private cache: Map<string, CacheEntry>;
  private queryIndex: Map<string, string[]>;  // query keywords -> cache entry IDs
  private fileIndex: Map<string, string[]>;   // file paths -> cache entry IDs
  private config: CacheConfig;
  private stats: { hits: number; misses: number };

  constructor(maxSize: number = 100, ttl: number = 3600000) {
    this.cache = new Map();
    this.queryIndex = new Map();
    this.fileIndex = new Map();
    this.config = {
      maxSize,
      ttl,
      similarityThreshold: DEFAULT_CACHE_CONFIG.similarityThreshold,
    };
    this.stats = { hits: 0, misses: 0 };
  }

  /**
   * Generate cache key from query and file path
   */
  private generateKey(query: string, filePath: string): string {
    // Simple hash-based key generation
    const combined = `${query}:${filePath}`;
    // Use UUID for uniqueness (in production, consider using a proper hash function)
    return uuidv4();
  }

  /**
   * Extract keywords from query for indexing
   */
  private extractKeywords(query: string): string[] {
    // Simple keyword extraction (split by spaces and filter common words)
    const stopWords = new Set(['the', 'a', 'an', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'must', 'shall', 'can', 'need', 'dare', 'ought', 'used', 'to', 'of', 'in', 'for', 'on', 'with', 'at', 'by', 'from', 'as', 'into', 'through', 'during', 'before', 'after', 'above', 'below', 'between', 'under', 'again', 'further', 'then', 'once']);

    return query
      .toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(word => word.length > 2 && !stopWords.has(word));
  }

  /**
   * Calculate cosine similarity between two strings
   */
  private calculateSimilarity(str1: string, str2: string): number {
    const words1 = new Set(this.extractKeywords(str1));
    const words2 = new Set(this.extractKeywords(str2));

    if (words1.size === 0 || words2.size === 0) {
      return 0;
    }

    // Calculate intersection
    let intersection = 0;
    words1.forEach(word => {
      if (words2.has(word)) {
        intersection++;
      }
    });

    // Cosine similarity: intersection / (sqrt(|A|) * sqrt(|B|))
    const denominator = Math.sqrt(words1.size) * Math.sqrt(words2.size);
    return denominator > 0 ? intersection / denominator : 0;
  }

  /**
   * Update indexes for a cache entry
   */
  private updateIndexes(entry: CacheEntry): void {
    // Update query index
    const keywords = this.extractKeywords(entry.query);
    keywords.forEach(keyword => {
      if (!this.queryIndex.has(keyword)) {
        this.queryIndex.set(keyword, []);
      }
      this.queryIndex.get(keyword)!.push(entry.id);
    });

    // Update file index
    if (!this.fileIndex.has(entry.filePath)) {
      this.fileIndex.set(entry.filePath, []);
    }
    this.fileIndex.get(entry.filePath)!.push(entry.id);
  }

  /**
   * Remove entry from indexes
   */
  private removeFromIndexes(entry: CacheEntry): void {
    const keywords = this.extractKeywords(entry.query);
    keywords.forEach(keyword => {
      const ids = this.queryIndex.get(keyword);
      if (ids) {
        const index = ids.indexOf(entry.id);
        if (index > -1) {
          ids.splice(index, 1);
        }
        if (ids.length === 0) {
          this.queryIndex.delete(keyword);
        }
      }
    });

    const fileIds = this.fileIndex.get(entry.filePath);
    if (fileIds) {
      const index = fileIds.indexOf(entry.id);
      if (index > -1) {
        fileIds.splice(index, 1);
      }
      if (fileIds.length === 0) {
        this.fileIndex.delete(entry.filePath);
      }
    }
  }

  /**
   * Clean up expired entries
   */
  private cleanup(): void {
    const now = Date.now();
    const expiredIds: string[] = [];

    this.cache.forEach((entry, id) => {
      if (now - entry.timestamp > this.config.ttl) {
        expiredIds.push(id);
      }
    });

    expiredIds.forEach(id => {
      const entry = this.cache.get(id);
      if (entry) {
        this.removeFromIndexes(entry);
        this.cache.delete(id);
      }
    });
  }

  /**
   * Evict least recently used entry if cache is full
   */
  private evictIfNeeded(): void {
    if (this.cache.size >= this.config.maxSize) {
      let lruId: string | null = null;
      let oldestAccess = Infinity;

      this.cache.forEach((entry, id) => {
        if (entry.lastAccess < oldestAccess) {
          oldestAccess = entry.lastAccess;
          lruId = id;
        }
      });

      if (lruId) {
        const entry = this.cache.get(lruId);
        if (entry) {
          this.removeFromIndexes(entry);
          this.cache.delete(lruId);
        }
      }
    }
  }

  /**
   * Get cached content by query and file path
   */
  async get(query: string, filePath: string): Promise<CacheEntry | null> {
    this.cleanup();

    const now = Date.now();
    let bestMatch: CacheEntry | null = null;
    let bestSimilarity = 0;

    // First, try exact match by file path
    const fileIds = this.fileIndex.get(filePath) || [];
    for (const id of fileIds) {
      const entry = this.cache.get(id);
      if (entry && now - entry.timestamp <= this.config.ttl) {
        const similarity = this.calculateSimilarity(query, entry.query);
        if (similarity > bestSimilarity) {
          bestSimilarity = similarity;
          bestMatch = entry;
        }
      }
    }

    // If no good match by file, try by query keywords
    if (!bestMatch || bestSimilarity < this.config.similarityThreshold) {
      const keywords = this.extractKeywords(query);
      const candidateIds = new Set<string>();

      keywords.forEach(keyword => {
        const ids = this.queryIndex.get(keyword) || [];
        ids.forEach(id => candidateIds.add(id));
      });

      for (const id of candidateIds) {
        const entry = this.cache.get(id);
        if (entry && now - entry.timestamp <= this.config.ttl) {
          const similarity = this.calculateSimilarity(query, entry.query);
          if (similarity > bestSimilarity) {
            bestSimilarity = similarity;
            bestMatch = entry;
          }
        }
      }
    }

    if (bestMatch && bestSimilarity >= this.config.similarityThreshold) {
      bestMatch.accessCount++;
      bestMatch.lastAccess = now;
      this.stats.hits++;
      return bestMatch;
    }

    this.stats.misses++;
    return null;
  }

  /**
   * Set cache entry
   */
  async set(query: string, filePath: string, content: string, tokens: number): Promise<void> {
    this.cleanup();
    this.evictIfNeeded();

    const id = this.generateKey(query, filePath);
    const now = Date.now();

    const entry: CacheEntry = {
      id,
      query,
      filePath,
      content,
      tokens,
      timestamp: now,
      accessCount: 0,
      lastAccess: now,
    };

    this.cache.set(id, entry);
    this.updateIndexes(entry);
  }

  /**
   * Find similar entries
   */
  async findSimilar(query: string, limit: number = 5): Promise<SimilarityResult[]> {
    const results: SimilarityResult[] = [];
    const keywords = this.extractKeywords(query);
    const candidateIds = new Set<string>();

    keywords.forEach(keyword => {
      const ids = this.queryIndex.get(keyword) || [];
      ids.forEach(id => candidateIds.add(id));
    });

    for (const id of candidateIds) {
      const entry = this.cache.get(id);
      if (entry) {
        const similarity = this.calculateSimilarity(query, entry.query);
        if (similarity > 0) {
          results.push({ entry, similarity });
        }
      }
    }

    // Sort by similarity descending
    results.sort((a, b) => b.similarity - a.similarity);

    return results.slice(0, limit);
  }

  /**
   * Get cache statistics
   */
  getStats(): CacheStats {
    const total = this.stats.hits + this.stats.misses;
    return {
      hits: this.stats.hits,
      misses: this.stats.misses,
      hitRate: total > 0 ? this.stats.hits / total : 0,
      totalEntries: this.cache.size,
    };
  }

  /**
   * Clear all cache entries
   */
  clear(): void {
    this.cache.clear();
    this.queryIndex.clear();
    this.fileIndex.clear();
    this.stats = { hits: 0, misses: 0 };
  }

  /**
   * Get cache size
   */
  size(): number {
    return this.cache.size;
  }

  /**
   * Remove entry by ID
   */
  delete(id: string): boolean {
    const entry = this.cache.get(id);
    if (entry) {
      this.removeFromIndexes(entry);
      return this.cache.delete(id);
    }
    return false;
  }

  /**
   * Get all entries
   */
  entries(): CacheEntry[] {
    return Array.from(this.cache.values());
  }

  /**
   * Get entry by ID
   */
  getEntry(id: string): CacheEntry | undefined {
    return this.cache.get(id);
  }
}
