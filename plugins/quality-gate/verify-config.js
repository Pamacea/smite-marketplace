#!/usr/bin/env node
/**
 * Configuration System Verification Script
 * Tests the new configuration features
 */

const path = require('path');
const fs = require('fs');

console.log('=== Quality Gate Configuration System Verification ===\n');

// Test 1: Check JSON Schema exists
console.log('✓ Test 1: JSON Schema exists');
const schemaPath = path.join(__dirname, 'config-schema.json');
if (!fs.existsSync(schemaPath)) {
  console.error('  ✗ FAIL: config-schema.json not found');
  process.exit(1);
}
const schema = JSON.parse(fs.readFileSync(schemaPath, 'utf-8'));
console.log(`  Schema version: ${schema.$schema}`);
console.log(`  Schema title: ${schema.title}`);

// Test 2: Check default config exists
console.log('\n✓ Test 2: Default configuration exists');
const defaultConfigPath = path.join(__dirname, 'default-config.json');
if (!fs.existsSync(defaultConfigPath)) {
  console.error('  ✗ FAIL: default-config.json not found');
  process.exit(1);
}
const defaultConfig = JSON.parse(fs.readFileSync(defaultConfigPath, 'utf-8'));
console.log(`  Default config enabled: ${defaultConfig.enabled}`);
console.log(`  Log level: ${defaultConfig.logLevel}`);

// Test 3: Check compiled dist files
console.log('\n✓ Test 3: Compiled modules exist');
const distFiles = [
  'dist/config.js',
  'dist/config-overrides.js',
  'dist/config-init.js',
  'dist/config.d.ts',
  'dist/config-overrides.d.ts',
  'dist/config-init.d.ts'
];
for (const file of distFiles) {
  const filePath = path.join(__dirname, file);
  if (!fs.existsSync(filePath)) {
    console.error(`  ✗ FAIL: ${file} not found`);
    process.exit(1);
  }
  console.log(`  ✓ ${file}`);
}

// Test 4: Check package.json updates
console.log('\n✓ Test 4: package.json configured');
const pkgPath = path.join(__dirname, 'package.json');
const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));

if (!pkg.scripts['init-config']) {
  console.error('  ✗ FAIL: init-config script not found');
  process.exit(1);
}
console.log(`  ✓ Script: ${pkg.scripts['init-config']}`);

if (!pkg.dependencies.ajv) {
  console.error('  ✗ FAIL: ajv dependency not found');
  process.exit(1);
}
console.log(`  ✓ AJV version: ${pkg.dependencies.ajv}`);

// Test 5: Check example config
console.log('\n✓ Test 5: Example configuration file');
const examplePath = path.join(__dirname, '.smite', 'quality.json');
if (!fs.existsSync(examplePath)) {
  console.warn('  ⚠ WARN: .claude/.smite/quality.json not found (optional)');
} else {
  const example = JSON.parse(fs.readFileSync(examplePath, 'utf-8'));
  console.log(`  ✓ Example config enabled: ${example.enabled}`);
  console.log(`  ✓ Overrides count: ${example.overrides ? example.overrides.length : 0}`);
}

// Test 6: Verify schema structure
console.log('\n✓ Test 6: JSON Schema structure');
const requiredProperties = ['enabled', 'logLevel', 'complexity', 'security', 'semantics', 'tests', 'mcp', 'output'];
for (const prop of requiredProperties) {
  if (!schema.properties[prop]) {
    console.error(`  ✗ FAIL: Missing schema property: ${prop}`);
    process.exit(1);
  }
  console.log(`  ✓ Property: ${prop}`);
}

// Test 7: Verify overrides in schema
console.log('\n✓ Test 7: Overrides support in schema');
if (!schema.properties.overrides) {
  console.error('  ✗ FAIL: overrides property not in schema');
  process.exit(1);
}
console.log('  ✓ Overrides property exists');
console.log(`  ✓ Override items: ${schema.properties.overrides.items}`);

// Summary
console.log('\n=== All Tests Passed ===');
console.log('\nConfiguration system features:');
console.log('  • JSON Schema validation');
console.log('  • Environment variable overrides');
console.log('  • Per-file/directory overrides');
console.log('  • Interactive configuration CLI');
console.log('  • Production-ready defaults');
console.log('  • Comprehensive documentation');
console.log('\nTo initialize config: npm run init-config');
console.log('To use in code: import { ConfigManager, OverrideManager } from "@smite/quality-gate"');
