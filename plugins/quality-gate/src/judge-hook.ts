#!/usr/bin/env node

/**
 * Judge Hook - PreToolUse Entry Point
 * Claude Code hook for code quality validation
 *
 * This script is the main entry point that:
 * 1. Reads hook input from stdin
 * 2. Runs quality validation
 * 3. Outputs decision to stdout
 *
 * Usage: Called by Claude Code's hook system
 */

import * as fs from 'fs';
import { Judge } from './judge';
import { JudgeHookInput, JudgeHookOutput } from './types';

/**
 * Read hook input from stdin
 */
function readStdin(): JudgeHookInput {
  try {
    const inputData = fs.readFileSync(0, 'utf-8'); // 0 = stdin
    return JSON.parse(inputData);
  } catch (error) {
    console.error('Failed to read stdin:', error);
    throw error;
  }
}

/**
 * Main execution function
 */
async function main() {
  let inputData: JudgeHookInput;
  let cwd: string;

  try {
    // Read hook input
    inputData = readStdin();
    cwd = inputData.cwd || process.cwd();

    // Validate input
    if (!inputData.tool_name || !inputData.tool_input) {
      throw new Error('Invalid hook input: missing tool_name or tool_input');
    }

    // Create judge instance and run validation
    const judge = new Judge(cwd);
    const result = await judge.validate(inputData);

    // Output result as JSON to stdout
    console.log(JSON.stringify(result));

    // Exit with appropriate code
    const decision = result.hookSpecificOutput.permissionDecision;
    if (decision === 'allow') {
      process.exit(0);
    } else if (decision === 'deny') {
      process.exit(2); // Exit code 2 indicates deny
    } else {
      process.exit(3); // Exit code 3 indicates ask
    }
  } catch (error) {
    // Handle errors gracefully
    const errorMessage = error instanceof Error ? error.message : String(error);

    const errorOutput: JudgeHookOutput = {
      hookSpecificOutput: {
        hookEventName: 'PreToolUse',
        permissionDecision: 'ask',
        permissionDecisionReason: `⚠️ Quality Gate Error: ${errorMessage}`,
      },
    };

    console.log(JSON.stringify(errorOutput));
    process.exit(1);
  }
}

// Run main function
main().catch((error) => {
  console.error('Unhandled error:', error);
  process.exit(1);
});
