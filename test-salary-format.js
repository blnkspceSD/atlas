/**
 * Test script to verify salary parsing and formatting
 * Run with: node test-salary-format.js
 */

// Sample salaries from the screenshot
const sampleSalaries = [
  "$120,000 - $145,000",
  "$90,000~$100,000 base + $12,000 bonus",
  "$115,000 - $135,000/year",
  "usd $95,000 - $230,000 + equity + zrx tokens + benefits",
  "$60,000 - $124,000",
  "$150,000 - $200,000 per year",
  "$19.50 - $22.10 usd per hour",
  "gross salary: 17,600 - 33,400 pln/month"
];

// Mock the Salary component's display logic
function formatSalary(rawSalary) {
  // Parse salary
  const parsed = parseSalary(rawSalary);
  
  if (!parsed) {
    return "Salary not disclosed";
  }
  
  // Format according to the expected output
  if (parsed.period === 'year' || parsed.period === 'month') {
    // Convert monthly to annual if needed
    const factor = parsed.period === 'month' ? 12 : 1;
    const annualMin = parsed.min ? parsed.min * factor : undefined;
    const annualMax = parsed.max ? parsed.max * factor : undefined;
    
    if (annualMin && annualMax) {
      return `$${Math.round(annualMin).toLocaleString()} - $${Math.round(annualMax).toLocaleString()}`;
    } else if (annualMin) {
      return `$${Math.round(annualMin).toLocaleString()}`;
    } else if (annualMax) {
      return `$${Math.round(annualMax).toLocaleString()}`;
    }
  }
  
  // Hourly rate
  if (parsed.period === 'hour') {
    const hourlyRate = parsed.min ? 
      `$${parsed.min.toLocaleString()}` : "";
    const hourlyMax = parsed.max ? 
      ` - $${parsed.max.toLocaleString()}` : "";
    return `${hourlyRate}${hourlyMax} / hr`;
  }
  
  // Daily rate
  if (parsed.period === 'day') {
    const dailyRate = parsed.min ? 
      `$${parsed.min.toLocaleString()}` : "";
    const dailyMax = parsed.max ? 
      ` - $${parsed.max.toLocaleString()}` : "";
    return `${dailyRate}${dailyMax} / day`;
  }
  
  // Weekly rate
  if (parsed.period === 'week') {
    const weeklyRate = parsed.min ? 
      `$${parsed.min.toLocaleString()}` : "";
    const weeklyMax = parsed.max ? 
      ` - $${parsed.max.toLocaleString()}` : "";
    return `${weeklyRate}${weeklyMax} / week`;
  }
  
  // Fallback to original
  return rawSalary;
}

// Mock the parseSalary function
function parseSalary(raw) {
  if (!raw) return undefined;
  
  // This is a simplified version of your actual parser
  const numMatches = raw.match(/[\d,]+(?:\.\d+)?/g) || [];
  const nums = numMatches.map(m => parseFloat(m.replace(/,/g, "")));
  
  // Determine period
  let period = 'year'; // Default
  if (/hour|\/hr/.test(raw.toLowerCase())) {
    period = 'hour';
  } else if (/month|\/mo/.test(raw.toLowerCase())) {
    period = 'month';
  } else if (/week|\/wk/.test(raw.toLowerCase())) {
    period = 'week';
  } else if (/day/.test(raw.toLowerCase())) {
    period = 'day';
  }
  
  // Determine currency
  let currency = 'USD';
  if (/pln/i.test(raw)) {
    currency = 'PLN';
  } else if (/zrx/i.test(raw)) {
    currency = 'ZRX';
  } else if (/€|EUR/i.test(raw)) {
    currency = 'EUR';
  }
  
  // Extract min and max
  const [min, max] = nums.length === 1 ? [nums[0], undefined] : [nums[0], nums[1]];
  
  return { min, max, period, currency, note: '' };
}

// Test each salary format
console.log("Testing salary formatting\n------------------");
sampleSalaries.forEach(salary => {
  const parsed = parseSalary(salary);
  const formatted = formatSalary(salary);
  
  console.log(`Original: ${salary}`);
  console.log(`Parsed: ${JSON.stringify(parsed)}`);
  console.log(`Formatted: ${formatted}`);
  console.log("------------------");
});

/** 
 * Expected output should be:
 * 
 * $120,000 - $145,000
 * $90,000 - $100,000
 * $115,000 - $135,000
 * $95,000 - $230,000
 * $60,000 - $124,000
 * $150,000 - $200,000
 * $19.50 - $22.10 / hr
 * $211,200 - $400,800 (converted from monthly)
 */ 