/**
 * Debug script to test salary parsing and formatting
 * Run with: node test-salary-format-debug.js
 */

// Import the actual parser or create a simplified version for testing
const { SalaryRange } = require('./types/job');
const { parseSalary } = require('./lib/salaryParser');

// Log a pretty heading for each test
function logTestCase(testName) {
  console.log('\n' + '='.repeat(50));
  console.log(`TEST CASE: ${testName}`);
  console.log('='.repeat(50));
}

// Format a salary for display (simplified version of the component logic)
function formatSalary(salaryRange, rawSalary) {
  if (!salaryRange || (!salaryRange.min && !salaryRange.max)) {
    return rawSalary || 'Salary not disclosed';
  }

  const { min, max, currency = 'USD', period = 'year' } = salaryRange;

  // Helper function to format currency values
  const formatCurrency = (value) => {
    if (currency === 'USD') {
      return `$${Math.round(value).toLocaleString()}`;
    }
    return `${Math.round(value).toLocaleString()} ${currency}`;
  };

  // Convert monthly to annual
  const getAnnualValue = (value) => {
    if (period === 'month') {
      return value * 12;
    }
    return value;
  };

  // Annual or monthly (converted to annual) salary
  if (period === 'year' || period === 'month') {
    const annualMin = min ? getAnnualValue(min) : undefined;
    const annualMax = max ? getAnnualValue(max) : undefined;

    if (annualMin && annualMax) {
      return `${formatCurrency(annualMin)} - ${formatCurrency(annualMax)}`;
    }
    if (annualMin) {
      return formatCurrency(annualMin);
    }
    if (annualMax) {
      return formatCurrency(annualMax);
    }
  }

  // Hourly rate
  if (period === 'hour' && min) {
    return `${formatCurrency(min)}${max ? ` - ${formatCurrency(max)}` : ''} / hr`;
  }

  // Daily rate
  if (period === 'day' && min) {
    return `${formatCurrency(min)}${max ? ` - ${formatCurrency(max)}` : ''} / day`;
  }

  // Weekly rate
  if (period === 'week' && min) {
    return `${formatCurrency(min)}${max ? ` - ${formatCurrency(max)}` : ''} / week`;
  }

  // Fallback to raw salary
  return rawSalary || 'Salary not disclosed';
}

// Test the parser and formatter with various salary formats
function runTests() {
  // Test 1: Annual USD range
  logTestCase('Annual USD Range');
  const test1 = '$120,000 - $145,000';
  const parsed1 = parseSalary(test1);
  console.log('Raw:', test1);
  console.log('Parsed:', parsed1);
  console.log('Formatted:', formatSalary(parsed1, test1));

  // Test 2: Hourly rate with USD
  logTestCase('Hourly Rate');
  const test2 = '$19.50 - $22.10 usd per hour';
  const parsed2 = parseSalary(test2);
  console.log('Raw:', test2);
  console.log('Parsed:', parsed2);
  console.log('Formatted:', formatSalary(parsed2, test2));

  // Test 3: Monthly salary in PLN
  logTestCase('Monthly Salary in PLN');
  const test3 = 'gross salary: 17,600 - 33,400 pln/month';
  const parsed3 = parseSalary(test3);
  console.log('Raw:', test3);
  console.log('Parsed:', parsed3);
  console.log('Formatted:', formatSalary(parsed3, test3));

  // Test 4: Annual single value
  logTestCase('Annual Single Value');
  const test4 = '$85,000 per year';
  const parsed4 = parseSalary(test4);
  console.log('Raw:', test4);
  console.log('Parsed:', parsed4);
  console.log('Formatted:', formatSalary(parsed4, test4));

  // Test 5: Non-parseable salary
  logTestCase('Non-parseable Salary');
  const test5 = 'competitive compensation';
  const parsed5 = parseSalary(test5);
  console.log('Raw:', test5);
  console.log('Parsed:', parsed5);
  console.log('Formatted:', formatSalary(parsed5, test5));
}

// Run all tests
runTests();

// Check if the module exports are properly set up
console.log('\n' + '='.repeat(50));
console.log('MODULE EXPORTS CHECK:');
console.log('='.repeat(50));
console.log('parseSalary from lib/salaryParser:', typeof parseSalary);
console.log('SalaryRange from types/job:', typeof SalaryRange); 