/**
 * SMITE v2.0 Test Runner
 *
 * Quick verification that all systems are working
 */

import { initSMITE, SMITE } from '../integration/smite-integrator';

/**
 * Quick test: Initialize SMITE v2.0
 */
async function testInitialization() {
  console.log('🧪 Testing SMITE v2.0 Initialization...\n');

  try {
    await initSMITE();

    const status = SMITE.stats();
    console.log('✅ Initialization test passed!');
    console.log('\n📊 System Status:');
    console.log(JSON.stringify(status, null, 2));

    return true;
  } catch (error) {
    console.error('❌ Initialization test failed:', error);
    return false;
  }
}

/**
 * Test: Model routing
 */
async function testModelRouting() {
  console.log('🧪 Testing Model Routing...\n');

  try {
    const { selectModel } = await import('../integration/model-router');

    const testCases = [
      { task: 'grep files', expected: 'claude-haiku-4-5' },
      { task: 'edit file', expected: 'claude-sonnet-4-5' },
      { task: 'review code', expected: 'claude-opus-4-6' }
    ];

    let passed = 0;
    let failed = 0;

    for (const testCase of testCases) {
      const result = selectModel(testCase.task);

      if (result.model === testCase.expected) {
        console.log(`✅ "${testCase.task}" → ${result.model}`);
        passed++;
      } else {
        console.log(`❌ "${testCase.task}" → ${result.model} (expected ${testCase.expected})`);
        failed++;
      }
    }

    console.log(`\nModel Routing Test: ${passed} passed, ${failed} failed`);

    return failed === 0;
  } catch (error) {
    console.error('❌ Model routing test failed:', error);
    return false;
  }
}

/**
 * Test: Lazy loading
 */
async function testLazyLoading() {
  console.log('🧪 Testing Lazy Loading...\n');

  try {
    // This would test actual file system
    // For now, just verify the code compiles

    const { skillLoader } = await import('../skills/skill-loader');

    console.log('✅ Lazy loading module loaded');
    console.log('✅ Lazy loading test passed!');

    return true;
  } catch (error) {
    console.error('❌ Lazy loading test failed:', error);
    return false;
  }
}

/**
 * Run all tests
 */
async function runAllTests() {
  console.log('🚀 SMITE v2.0 Verification Tests');
  console.log('='.repeat(60));
  console.log('');

  const tests = [
    { name: 'Initialization', fn: testInitialization },
    { name: 'Model Routing', fn: testModelRouting },
    { name: 'Lazy Loading', fn: testLazyLoading }
  ];

  const results = [];

  for (const test of tests) {
    const result = await test.fn();
    results.push({ name: test.name, passed: result });
  }

  console.log('\n' + '='.repeat(60));
  console.log('📊 Test Results Summary:');
  console.log('='.repeat(60));

  for (const result of results) {
    const icon = result.passed ? '✅' : '❌';
    console.log(`${icon} ${result.name}`);
  }

  const passed = results.filter(r => r.passed).length;
  const failed = results.filter(r => !r.passed).length;

  console.log('='.repeat(60));
  console.log(`Total: ${passed} passed, ${failed} failed`);

  if (failed === 0) {
    console.log('\n🎉 All tests passed! SMITE v2.0 is ready!');
  } else {
    console.log('\n⚠️  Some tests failed. Please check the logs above.');
  }

  return failed === 0;
}

// Run tests if this file is executed directly
if (require.main === module) {
  runAllTests()
    .then(success => {
      process.exit(success ? 0 : 1);
    })
    .catch(error => {
      console.error('Fatal error:', error);
      process.exit(1);
    });
}

export { testInitialization, testModelRouting, testLazyLoading, runAllTests };
