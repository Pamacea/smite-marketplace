/**
 * Core Constants
 *
 * Shared constants used across the toolkit.
 *
 * @module core/constants
 */
/**
 * Analysis thresholds
 */
export declare const ANALYSIS_THRESHOLD: {
    /** Minimum character length for keyword extraction */
    readonly MIN_KEYWORD_LENGTH: 2;
    /** Minimum character length for meaningful keywords (semantic) */
    readonly MIN_KEYWORD_LENGTH_SEMANTIC: 4;
    /** Query length threshold for scoring (characters) */
    readonly QUERY_SCORING_LENGTH: 50;
    /** Character threshold for detecting potential secrets/credentials */
    readonly SECRET_MIN_LENGTH: 8;
};
/**
 * Cache defaults
 */
export declare const CACHE_DEFAULTS: {
    /** Maximum number of entries in cache */
    readonly MAX_SIZE: 100;
    /** Time to live for cache entries (milliseconds) - 1 hour */
    readonly TTL: 3600000;
    /** Similarity threshold for cache matching (0-1) */
    readonly SIMILARITY_THRESHOLD: 0.8;
};
/**
 * Stop words for keyword extraction
 */
export declare const STOP_WORDS: Set<string>;
//# sourceMappingURL=constants.d.ts.map