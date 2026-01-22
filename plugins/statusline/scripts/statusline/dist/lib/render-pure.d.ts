import type { StatuslineConfig } from "./config-types.js";
export interface UsageLimit {
    utilization: number;
    resets_at: string;
}
export interface StatuslineData {
    branch: string;
    dirPath: string;
    modelName: string;
    sessionCost: string;
    sessionDuration: string;
    contextTokens: number | null;
    contextPercentage: number | null;
    lastOutputTokens: number | null;
    tokenDiff?: number;
    baseContext?: number;
    transcriptContext?: number;
    userTokens?: number;
    usageLimits?: {
        five_hour: UsageLimit | null;
        seven_day: UsageLimit | null;
    };
    periodCost?: number;
    todayCost?: number;
}
/**
 * Render statusline output
 *
 * CRITICAL: Put tokens + progressbar + percentage FIRST after branch
 * so they're always visible even on narrow terminals
 *
 * Order: Branch • Tokens • Progressbar • Model • Cost • Duration • GitChanges • Path
 */
export declare function renderStatusline(data: StatuslineData, config: StatuslineConfig): string;
