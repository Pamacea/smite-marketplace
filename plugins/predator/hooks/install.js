#!/usr/bin/env node

/**
 * PostPluginInstall hook for predator
 *
 * Copies Predator command files to ~/.claude/commands/
 * without overwriting existing commands.
 */

const fs = require('fs');
const path = require('path');

const commands = [
  'predator.md',
  'debug.md',
  'brainstorm.md'
];

function installCommands() {
  const pluginDir = path.dirname(__dirname);
  const commandsDir = path.join(pluginDir, 'commands');
  const homeDir = process.env.HOME || process.env.USERPROFILE;
  const targetDir = path.join(homeDir, '.claude', 'commands');

  // Ensure target directory exists
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  let installed = 0;
  let skipped = 0;
  let updated = 0;

  commands.forEach(file => {
    const source = path.join(commandsDir, file);
    const target = path.join(targetDir, file);

    if (!fs.existsSync(source)) {
      console.log(`⚠️  Source file not found: ${file}`);
      return;
    }

    // Check if already exists
    if (fs.existsSync(target)) {
      // Overwrite to update to latest version
      fs.copyFileSync(source, target);
      updated++;
      console.log(`  🔄 ${file} (updated)`);
    } else {
      // New installation
      fs.copyFileSync(source, target);
      installed++;
      console.log(`  ✅ ${file} (installed)`);
    }
  });

  console.log('');
  console.log(`✅ Commands installed: ${installed}`);
  console.log(`🔄 Commands updated: ${updated}`);
  if (skipped > 0) {
    console.log(`⏭️  Skipped: ${skipped}`);
  }
  console.log('');
  console.log('Available commands:');
  commands.forEach(file => {
    const name = file.replace('.md', '');
    console.log(`  /${name}`);
  });
  console.log('');
  console.log('📚 Workflows:');
  console.log('  - predator: plugins/predator/workflows/predator/');
  console.log('  - debug: plugins/predator/workflows/debug/');
  console.log('  - brainstorm: plugins/predator/workflows/brainstorm/');
}

installCommands();
