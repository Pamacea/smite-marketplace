"use strict";
/**
 * Unified Search Module
 *
 * Provides intelligent search routing that automatically selects the best
 * search strategy based on query type and context.
 *
 * @module core/unified
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.SearchRouter = exports.StrategyFactory = exports.HybridSearchStrategy = exports.LiteralSearchStrategy = exports.SemanticSearchStrategy = exports.QueryAnalyzer = exports.DEFAULT_ROUTER_CONFIG = exports.QueryType = exports.SearchStrategy = void 0;
exports.createSearchRouter = createSearchRouter;
// Type exports
var types_js_1 = require("./types.js");
Object.defineProperty(exports, "SearchStrategy", { enumerable: true, get: function () { return types_js_1.SearchStrategy; } });
Object.defineProperty(exports, "QueryType", { enumerable: true, get: function () { return types_js_1.QueryType; } });
Object.defineProperty(exports, "DEFAULT_ROUTER_CONFIG", { enumerable: true, get: function () { return types_js_1.DEFAULT_ROUTER_CONFIG; } });
// Analyzer exports
var analyzer_js_1 = require("./analyzer.js");
Object.defineProperty(exports, "QueryAnalyzer", { enumerable: true, get: function () { return analyzer_js_1.QueryAnalyzer; } });
// Strategy exports
var strategies_js_1 = require("./strategies.js");
Object.defineProperty(exports, "SemanticSearchStrategy", { enumerable: true, get: function () { return strategies_js_1.SemanticSearchStrategy; } });
Object.defineProperty(exports, "LiteralSearchStrategy", { enumerable: true, get: function () { return strategies_js_1.LiteralSearchStrategy; } });
Object.defineProperty(exports, "HybridSearchStrategy", { enumerable: true, get: function () { return strategies_js_1.HybridSearchStrategy; } });
Object.defineProperty(exports, "StrategyFactory", { enumerable: true, get: function () { return strategies_js_1.StrategyFactory; } });
// Router exports
var router_js_1 = require("./router.js");
Object.defineProperty(exports, "SearchRouter", { enumerable: true, get: function () { return router_js_1.SearchRouter; } });
/**
 * Quick access factory for creating search router
 */
function createSearchRouter(config) {
    const { SearchRouter: Router } = require('./router.js');
    return new Router(config);
}
//# sourceMappingURL=index.js.map