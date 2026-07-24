/* Unified Backend Test Suite Runner */
const { execSync } = require('child_process');
const path = require('path');

const tests = [
  { name: 'Auth Unit Tests (test_auth.js)', file: 'test_auth.js' },
  { name: 'Complaint Unit Tests (test_complaint.js)', file: 'test_complaint.js' },
  { name: 'AI Pipeline Integration (verify-integration.js)', file: 'verify-integration.js' },
  { name: 'Dashboard & Notification APIs (verify-dashboard.js)', file: 'verify-dashboard.js' }
];

console.log('==================================================');
console.log('   STARTING FULL CIVICSMART BACKEND TEST SUITE   ');
console.log('==================================================\n');

let passedCount = 0;
let failedCount = 0;

tests.forEach((test, idx) => {
  console.log(`[Test ${idx + 1}/${tests.length}] Running: ${test.name}...`);
  try {
    const output = execSync(`node "${path.join(__dirname, test.file)}"`, {
      encoding: 'utf-8',
      stdio: 'pipe'
    });
    console.log(output);
    console.log(`✅ ${test.name} PASSED!\n`);
    passedCount++;
  } catch (error) {
    console.error(`❌ ${test.name} FAILED!`);
    if (error.stdout) {
      console.log('--- Test Output ---');
      console.log(error.stdout);
    }
    if (error.stderr) {
      console.error('--- Test Error ---');
      console.error(error.stderr);
    }
    console.log('\n');
    failedCount++;
  }
});

console.log('==================================================');
console.log('               TEST RUN COMPLETE                  ');
console.log('==================================================');
console.log(`Total Run: ${tests.length}`);
console.log(`Passed:    ${passedCount}`);
console.log(`Failed:    ${failedCount}`);
console.log('==================================================');

if (failedCount > 0) {
  process.exit(1);
} else {
  console.log('🎉 SYSTEM INTEGRATION COMPLETE: ALL SYSTEMS NOMINAL');
  process.exit(0);
}
