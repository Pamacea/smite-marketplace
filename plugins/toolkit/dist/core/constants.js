"use strict";
/**
 * Core Constants
 *
 * Shared constants used across the toolkit.
 *
 * @module core/constants
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.STOP_WORDS = exports.CACHE_DEFAULTS = exports.ANALYSIS_THRESHOLD = void 0;
/**
 * Analysis thresholds
 */
exports.ANALYSIS_THRESHOLD = {
    /** Minimum character length for keyword extraction */
    MIN_KEYWORD_LENGTH: 2,
    /** Minimum character length for meaningful keywords (semantic) */
    MIN_KEYWORD_LENGTH_SEMANTIC: 4,
    /** Query length threshold for scoring (characters) */
    QUERY_SCORING_LENGTH: 50,
    /** Character threshold for detecting potential secrets/credentials */
    SECRET_MIN_LENGTH: 8,
};
/**
 * Cache defaults
 */
exports.CACHE_DEFAULTS = {
    /** Maximum number of entries in cache */
    MAX_SIZE: 100,
    /** Time to live for cache entries (milliseconds) - 1 hour */
    TTL: 3600000,
    /** Similarity threshold for cache matching (0-1) */
    SIMILARITY_THRESHOLD: 0.8,
};
/**
 * Stop words for keyword extraction
 */
exports.STOP_WORDS = new Set([
    'the', 'a', 'an', 'is', 'are', 'was', 'were', 'be', 'been', 'being',
    'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could',
    'should', 'may', 'might', 'must', 'shall', 'can', 'need', 'dare',
    'ought', 'used', 'to', 'of', 'in', 'for', 'on', 'with', 'at', 'by',
    'from', 'as', 'into', 'through', 'during', 'before', 'after', 'above',
    'below', 'between', 'under', 'again', 'further', 'then', 'once',
]);
//# sourceMappingURL=constants.js.map