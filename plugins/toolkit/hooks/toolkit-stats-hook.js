#!/usr/bin/env node

/**
 * SMITE Toolkit - Post-Tool Use Hook
 *
 * Runs after each tool use during a Claude Code session.
 * Tracks token usage and warns at thresholds.
 */

const fs = require('fs');
const path = require('path');

// Paths
const homeDir = process.env.USERPROFILE || process.env.HOME;
const smiteDir = path.join(homeDir, '.smite');
const toolkitDir = path.join(smiteDir, 'toolkit');
const budgetPath = path.join(toolkitDir, 'budget.json');
const statsPath = path.join(toolkitDir, 'stats.json');

// Get last assistant output
const lastOutput = process.env.LAST_ASSISTANT_OUTPUT || '';

function trackTokenUsage() {
  try {
    if (!fs.existsSync(budgetPath)) {
      return false;
    }

    // Read budget
    const budget = JSON.parse(fs.readFileSync(budgetPath, 'utf-8'));

    // Estimate tokens from output (rough estimate: 4 chars per token)
    const estimatedTokens = Math.ceil(lastOutput.length / 4);
    budget.usedTokens += estimatedTokens;

    const usedPercent = budget.usedTokens / budget.maxTokens;

    // Check thresholds
    if (usedPercent >= budget.criticalThreshold) {
      console.log('');
      console.warn(`🚨 CRITICAL: Token budget at ${(usedPercent * 100).toFixed(1)}%`);
      console.warn(`   Used: ${budget.usedTokens.toLocaleString()}/${budget.maxTokens.toLocaleString()}`);
      console.warn('');
    } else if (usedPercent >= budget.warnThreshold) {
      console.log('');
      console.log(`⚠️  Warning: Token budget at ${(usedPercent * 100).toFixed(1)}%`);
      console.log(`   Used: ${budget.usedTokens.toLocaleString()}/${budget.maxTokens.toLocaleString()}`);
      console.log('');
    }

    // Save updated budget
    budget.lastUpdated = new Date().toISOString();
    fs.writeFileSync(budgetPath, JSON.stringify(budget, null, 2));

    return true;
  } catch (error) {
    console.error('⚠️  Token tracking failed:', error.message);
    return false;
  }
}

// Run token tracking
module.exports = trackTokenUsage();
