#!/usr/bin/env node

/**
 * SMITE Toolkit - Session Start Hook
 *
 * Runs when a Claude Code session starts.
 * Initializes token budget and loads toolkit memory.
 */

const fs = require('fs');
const path = require('path');

// Paths
const projectDir = process.cwd();
const smiteDir = path.join(projectDir, '.claude', '.smite');
const toolkitDir = path.join(smiteDir, 'toolkit');
const budgetPath = path.join(toolkitDir, 'budget.json');
const statsPath = path.join(toolkitDir, 'stats.json');

// Default configuration
const DEFAULT_BUDGET = 100000; // 100k tokens
const WARN_THRESHOLD = 0.7; // 70%
const CRITICAL_THRESHOLD = 0.9; // 90%

function initializeToolkit() {
  try {
    // Create toolkit directory if it doesn't exist
    if (!fs.existsSync(toolkitDir)) {
      fs.mkdirSync(toolkitDir, { recursive: true });
    }

    // Initialize budget if it doesn't exist
    if (!fs.existsSync(budgetPath)) {
      const budget = {
        maxTokens: DEFAULT_BUDGET,
        usedTokens: 0,
        warnThreshold: WARN_THRESHOLD,
        criticalThreshold: CRITICAL_THRESHOLD,
        createdAt: new Date().toISOString(),
        lastReset: new Date().toISOString()
      };
      fs.writeFileSync(budgetPath, JSON.stringify(budget, null, 2));
    }

    // Initialize stats if they don't exist
    if (!fs.existsSync(statsPath)) {
      const stats = {
        sessions: 0,
        totalTokens: 0,
        totalSavings: 0,
        searches: 0,
        detections: 0,
        lastUpdated: new Date().toISOString()
      };
      fs.writeFileSync(statsPath, JSON.stringify(stats, null, 2));
    }

    // Read budget
    const budget = JSON.parse(fs.readFileSync(budgetPath, 'utf-8'));
    const usedPercent = (budget.usedTokens / budget.maxTokens * 100).toFixed(1);

    console.log('');
    console.log('🛠️  SMITE Toolkit ready');
    console.log(`   Token budget: ${budget.usedTokens.toLocaleString()}/${budget.maxTokens.toLocaleString()} (${usedPercent}%)`);
    console.log('');

    return true;
  } catch (error) {
    console.error('⚠️  Toolkit initialization failed:', error.message);
    return false;
  }
}

// Run initialization
module.exports = initializeToolkit();
