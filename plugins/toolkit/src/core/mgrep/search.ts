/**
 * Semantic Search API - High-level search interface
 *
 * Provides semantic search capabilities with:
 * - Query-based search
 * - Result ranking and filtering
 * - Fallback to RAG-only mode
 * - Configurable thresholds and limits
 */

import chalk from 'chalk';
import {
  MgrepClient,
  MgrepSearchOptions,
  MgrepSearchResult,
  type MgrepClientConfig,
} from './client.js';

/**
 * Search result with extended metadata
 */
export interface SearchResult extends MgrepSearchResult {
  /** Result rank position */
  rank: number;
  /** Result quality indicator */
  quality: 'high' | 'medium' | 'low';
}

/**
 * Search configuration
 */
export interface SearchConfig {
  /** Maximum number of results to return */
  maxResults?: number;
  /** Minimum relevance threshold (0-1) */
  minThreshold?: number;
  /** Enable reranking */
  rerank?: boolean;
  /** Include content snippets */
  includeContent?: boolean;
  /** Recursive search */
  recursive?: boolean;
  /** Fallback to RAG if mgrep unavailable */
  fallbackToRag?: boolean;
}

/**
 * Search statistics
 */
export interface SearchStats {
  /** Total results found */
  totalResults: number;
  /** Results after filtering */
  filteredResults: number;
  /** Average relevance score */
  avgScore: number;
  /** Search duration in milliseconds */
  duration: number;
  /** Whether fallback was used */
  usedFallback: boolean;
}

/**
 * Search response
 */
export interface SearchResponse {
  /** Search results */
  results: SearchResult[];
  /** Search statistics */
  stats: SearchStats;
  /** Error if search failed */
  error?: string;
}

/**
 * Default search configuration
 */
export const DEFAULT_SEARCH_CONFIG: SearchConfig = {
  maxResults: 20,
  minThreshold: 0.3,
  rerank: true,
  includeContent: true,
  recursive: true,
  fallbackToRag: true,
};

/**
 * Semantic Search class
 */
export class SemanticSearch {
  private client: MgrepClient;
  private config: SearchConfig;

  constructor(
    config?: Partial<SearchConfig>,
    clientConfig?: Partial<MgrepClientConfig>
  ) {
    this.config = { ...DEFAULT_SEARCH_CONFIG, ...config };
    this.client = new MgrepClient(clientConfig);
  }

  /**
   * Determine result quality based on score
   */
  private getQuality(score: number): 'high' | 'medium' | 'low' {
    if (score >= 0.7) return 'high';
    if (score >= 0.5) return 'medium';
    return 'low';
  }

  /**
   * Filter and rank results
   */
  private filterAndRankResults(
    results: MgrepSearchResult[],
    config: SearchConfig
  ): SearchResult[] {
    let filtered = results;

    // Apply threshold filter
    if (config.minThreshold !== undefined) {
      filtered = filtered.filter((r) => r.score >= config.minThreshold!);
    }

    // Sort by score (descending)
    filtered.sort((a, b) => b.score - a.score);

    // Apply max results limit
    if (config.maxResults !== undefined) {
      filtered = filtered.slice(0, config.maxResults);
    }

    // Add rank and quality metadata
    return filtered.map((result, index) => ({
      ...result,
      rank: index + 1,
      quality: this.getQuality(result.score),
    }));
  }

  /**
   * Calculate search statistics
   */
  private calculateStats(
    totalResults: number,
    filteredResults: SearchResult[],
    startTime: number,
    usedFallback: boolean
  ): SearchStats {
    const avgScore =
      filteredResults.length > 0
        ? filteredResults.reduce((sum, r) => sum + r.score, 0) /
          filteredResults.length
        : 0;

    return {
      totalResults,
      filteredResults: filteredResults.length,
      avgScore,
      duration: Date.now() - startTime,
      usedFallback,
    };
  }

  /**
   * Execute semantic search
   */
  async search(
    query: string,
    path?: string,
    options?: Partial<SearchConfig>
  ): Promise<SearchResponse> {
    const startTime = Date.now();
    const searchConfig = { ...this.config, ...options };

    // Check if mgrep is available
    const isAvailable = await this.client.isAvailable();

    if (!isAvailable) {
      if (searchConfig.fallbackToRag) {
        console.warn(
          chalk.yellow(
            '⚠️  mgrep unavailable, falling back to RAG-only mode'
          )
        );

        return {
          results: [],
          stats: this.calculateStats(0, [], startTime, true),
          error: 'mgrep unavailable - RAG fallback not yet implemented',
        };
      } else {
        return {
          results: [],
          stats: this.calculateStats(0, [], startTime, false),
          error: 'mgrep is not available and fallback is disabled',
        };
      }
    }

    // Build mgrep search options
    const mgrepOptions: MgrepSearchOptions = {
      maxCount: searchConfig.maxResults,
      noRerank: !searchConfig.rerank,
      recursive: searchConfig.recursive,
      content: searchConfig.includeContent,
    };

    // Execute search
    const result = await this.client.search(query, path, mgrepOptions);

    if (!result.success) {
      return {
        results: [],
        stats: this.calculateStats(0, [], startTime, false),
        error: result.error || 'Search failed',
      };
    }

    // Filter and rank results
    const rankedResults = this.filterAndRankResults(
      result.results || [],
      searchConfig
    );

    return {
      results: rankedResults,
      stats: this.calculateStats(
        result.results?.length || 0,
        rankedResults,
        startTime,
        false
      ),
    };
  }

  /**
   * Quick search with default options
   */
  async quickSearch(
    query: string,
    path?: string
  ): Promise<SearchResponse> {
    return this.search(query, path);
  }

  /**
   * High-precision search (stricter thresholds)
   */
  async highPrecisionSearch(
    query: string,
    path?: string
  ): Promise<SearchResponse> {
    return this.search(query, path, {
      minThreshold: 0.7,
      rerank: true,
      maxResults: 10,
    });
  }

  /**
   * High-recall search (more results, lower threshold)
   */
  async highRecallSearch(
    query: string,
    path?: string
  ): Promise<SearchResponse> {
    return this.search(query, path, {
      minThreshold: 0.2,
      rerank: false,
      maxResults: 50,
    });
  }

  /**
   * Get search client
   */
  getClient(): MgrepClient {
    return this.client;
  }

  /**
   * Check if semantic search is available
   */
  async isAvailable(): Promise<boolean> {
    return this.client.isAvailable();
  }
}

/**
 * Create a semantic search instance with default config
 */
export function createSearch(
  config?: Partial<SearchConfig>
): SemanticSearch {
  return new SemanticSearch(config);
}
