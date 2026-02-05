/**
 * Shared State Utilities for SMITE Implement Plugin
 *
 * Provides helper functions for managing shared state during parallel agent execution.
 *
 * Usage:
 *   node state-utils.js init
 *   node state-utils.js read
 *   node state-utils.js write --key="results.agent1" --value='{"done": true}'
 *   node state-utils.js status
 *   node state-utils.js archive
 */

const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('crypto');

// Paths
const STATE_DIR = '.claude/.smite';
const STATE_FILE = path.join(STATE_DIR, 'shared-state.json');
const HISTORY_DIR = path.join(STATE_DIR, 'history');
const TEMPLATE_FILE = path.join(__dirname, 'config/state-template.json');

/**
 * Initialize a new shared state session
 */
function init(options = {}) {
  const template = JSON.parse(fs.readFileSync(TEMPLATE_FILE, 'utf8'));

  const state = {
    ...template,
    session_id: options.sessionId || randomUUID(),
    timestamp: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    status: 'initializing',
    mode: options.mode || 'epct',
    phase: options.phase || 'init',
    context: {
      task: options.task || '',
      files: [],
      dependencies: {},
      flags: options.flags || {}
    }
  };

  ensureDir(STATE_DIR);
  fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2));

  console.log(`Session initialized: ${state.session_id}`);
  return state.session_id;
}

/**
 * Read current shared state
 */
function read() {
  if (!fs.existsSync(STATE_FILE)) {
    console.error('No active session found. Run "init" first.');
    process.exit(1);
  }

  const state = JSON.parse(fs.readFileSync(STATE_FILE, 'utf8'));
  console.log(JSON.stringify(state, null, 2));
  return state;
}

/**
 * Write to shared state
 */
function write(key, value) {
  if (!fs.existsSync(STATE_FILE)) {
    console.error('No active session found. Run "init" first.');
    process.exit(1);
  }

  const state = JSON.parse(fs.readFileSync(STATE_FILE, 'utf8'));

  // Support dot notation for nested keys
  const keys = key.split('.');
  let target = state;
  for (let i = 0; i < keys.length - 1; i++) {
    if (!target[keys[i]]) target[keys[i]] = {};
    target = target[keys[i]];
  }

  // Parse value if JSON string
  try {
    target[keys[keys.length - 1]] = JSON.parse(value);
  } catch {
    target[keys[keys.length - 1]] = value;
  }

  state.updated_at = new Date().toISOString();
  fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2));

  console.log(`Updated: ${key}`);
}

/**
 * Get session status
 */
function status() {
  if (!fs.existsSync(STATE_FILE)) {
    console.log('No active session');
    return;
  }

  const state = JSON.parse(fs.readFileSync(STATE_FILE, 'utf8'));

  console.log(`Session: ${state.session_id}`);
  console.log(`Status: ${state.status}`);
  console.log(`Mode: ${state.mode}`);
  console.log(`Phase: ${state.phase || 'N/A'}`);
  console.log(`Agents:`);
  console.log(`  Active: ${state.agents.active.join(', ') || 'none'}`);
  console.log(`  Completed: ${state.agents.completed.join(', ') || 'none'}`);
  console.log(`  Failed: ${state.agents.failed.join(', ') || 'none'}`);

  if (state.metrics) {
    console.log(`Metrics:`);
    console.log(`  Launched: ${state.metrics.agents_launched}`);
    console.log(`  Completed: ${state.metrics.agents_completed}`);
    console.log(`  Failed: ${state.metrics.agents_failed}`);
    console.log(`  Speedup: ${state.metrics.parallel_speedup}x`);
  }
}

/**
 * Add agent to active list
 */
function addAgent(agentName) {
  if (!fs.existsSync(STATE_FILE)) {
    console.error('No active session found.');
    process.exit(1);
  }

  const state = JSON.parse(fs.readFileSync(STATE_FILE, 'utf8'));

  if (!state.agents.active.includes(agentName)) {
    state.agents.active.push(agentName);
    state.agents.pending = state.agents.pending.filter(a => a !== agentName);
    state.metrics.agents_launched = (state.metrics.agents_launched || 0) + 1;
    state.updated_at = new Date().toISOString();

    fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2));
    console.log(`Agent added: ${agentName}`);
  }
}

/**
 * Mark agent as completed
 */
function completeAgent(agentName, result = null) {
  if (!fs.existsSync(STATE_FILE)) {
    console.error('No active session found.');
    process.exit(1);
  }

  const state = JSON.parse(fs.readFileSync(STATE_FILE, 'utf8'));

  state.agents.active = state.agents.active.filter(a => a !== agentName);
  if (!state.agents.completed.includes(agentName)) {
    state.agents.completed.push(agentName);
  }

  if (result !== null) {
    state.results[agentName] = result;
  }

  state.metrics.agents_completed = (state.metrics.agents_completed || 0) + 1;
  state.updated_at = new Date().toISOString();

  fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2));
  console.log(`Agent completed: ${agentName}`);
}

/**
 * Mark agent as failed
 */
function failAgent(agentName, error = null) {
  if (!fs.existsSync(STATE_FILE)) {
    console.error('No active session found.');
    process.exit(1);
  }

  const state = JSON.parse(fs.readFileSync(STATE_FILE, 'utf8'));

  state.agents.active = state.agents.active.filter(a => a !== agentName);
  if (!state.agents.failed.includes(agentName)) {
    state.agents.failed.push(agentName);
  }

  state.results[agentName] = { error, failed_at: new Date().toISOString() };
  state.metrics.agents_failed = (state.metrics.agents_failed || 0) + 1;
  state.updated_at = new Date().toISOString();

  fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2));
  console.log(`Agent failed: ${agentName}`);
}

/**
 * Archive current session
 */
function archive() {
  if (!fs.existsSync(STATE_FILE)) {
    console.error('No active session found.');
    process.exit(1);
  }

  const state = JSON.parse(fs.readFileSync(STATE_FILE, 'utf8'));
  ensureDir(HISTORY_DIR);

  const archiveFile = path.join(HISTORY_DIR, `${state.session_id}.json`);
  fs.writeFileSync(archiveFile, JSON.stringify(state, null, 2));

  // Create minimal state with archived reference
  const archivedState = {
    status: 'archived',
    previous_session: state.session_id,
    archived_at: new Date().toISOString()
  };

  fs.writeFileSync(STATE_FILE, JSON.stringify(archivedState, null, 2));

  console.log(`Session archived: ${archiveFile}`);
}

/**
 * Clean up (delete) current session
 */
function cleanup() {
  if (!fs.existsSync(STATE_FILE)) {
    console.log('No active session to clean up.');
    return;
  }

  fs.unlinkSync(STATE_FILE);
  console.log('Session cleaned up.');
}

/**
 * Generate a random UUID (Node.js built-in)
 */
function randomUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

/**
 * Ensure directory exists
 */
function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

// CLI
const args = process.argv.slice(2);
const command = args[0];

switch (command) {
  case 'init':
    init({
      mode: args['--mode'],
      phase: args['--phase'],
      task: args['--task'],
      flags: args['--flags'] ? JSON.parse(args['--flags']) : {}
    });
    break;

  case 'read':
    read();
    break;

  case 'write':
    write(args['--key'], args['--value']);
    break;

  case 'status':
    status();
    break;

  case 'add-agent':
    addAgent(args['--name']);
    break;

  case 'complete-agent':
    completeAgent(args['--name'], args['--result'] ? JSON.parse(args['--result']) : null);
    break;

  case 'fail-agent':
    failAgent(args['--name'], args['--error']);
    break;

  case 'archive':
    archive();
    break;

  case 'cleanup':
    cleanup();
    break;

  default:
    console.log(`
SMITE Shared State Utils

Usage:
  node state-utils.js init [--mode=MODE] [--task=TASK]
  node state-utils.js read
  node state-utils.js write --key=KEY --value=VALUE
  node state-utils.js status
  node state-utils.js add-agent --name=AGENT
  node state-utils.js complete-agent --name=AGENT [--result=JSON]
  node state-utils.js fail-agent --name=AGENT [--error=ERROR]
  node state-utils.js archive
  node state-utils.js cleanup

Examples:
  node state-utils.js init --mode=epct --task="Build feature"
  node state-utils.js add-agent --name=explore-patterns
  node state-utils.js complete-agent --name=explore-patterns --result='{"files": 12}'
  node state-utils.js status
    `);
}
