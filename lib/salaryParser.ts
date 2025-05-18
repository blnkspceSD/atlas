import { SalaryRange } from '@/types/job';

const numberRx = /([\d,]+(?:\.\d+)?)/g;
const currencyRx = /(USD|EUR|GBP|PLN|usd|zrx|\$|€|£)/i;
const periodRx = /(per year|annually|\/year|per hour|\/hour|hourly|monthly|per month|\/month|per week|weekly|\/week|\/mo|\/yr)/i;

/**
 * Parses a raw salary string into a structured SalaryRange object
 * Focuses on extracting clear min/max values and determining the period
 */
export function parseSalary(raw: string | null | undefined): SalaryRange | undefined {
  if (!raw) return undefined;
  
  // Check if there are any numbers in the salary string
  if (!numberRx.test(raw)) return undefined;
  
  // Reset regex lastIndex
  numberRx.lastIndex = 0;
  
  // Extract numbers
  const matches = raw.match(numberRx) || [];
  const nums = matches.map(match => {
    // Convert string number to float
    let num = parseFloat(match.replace(/,/g, ""));
    
    // Handle k/K suffix (e.g., 70k = 70,000)
    if (/\b\d+[kK]\b/.test(raw)) {
      num *= 1000;
    }
    
    return num;
  });
  
  // Get currency
  const currencyMatch = raw.match(currencyRx);
  let currency = 'USD'; // Default
  
  if (currencyMatch) {
    const detectedCurrency = currencyMatch[1].toLowerCase();
    
    switch (detectedCurrency) {
      case '$':
        currency = 'USD';
        break;
      case '€':
        currency = 'EUR';
        break;
      case '£':
        currency = 'GBP';
        break;
      case 'pln':
        currency = 'PLN';
        break;
      case 'zrx':
        currency = 'ZRX'; // Cryptocurrency token
        break;
      case 'usd':
        currency = 'USD';
        break;
      default:
        currency = detectedCurrency.toUpperCase();
    }
  }
  
  // Get period
  const periodMatch = raw.match(periodRx);
  let period: SalaryRange['period'] = 'year'; // Default
  
  if (periodMatch) {
    const periodText = periodMatch[0].toLowerCase();
    if (/hour|\/hr/.test(periodText)) {
      period = 'hour';
    } else if (/month|\/mo/.test(periodText)) {
      period = 'month';
    } else if (/week|weekly|\/wk/.test(periodText)) {
      period = 'week';
    } else if (/day/.test(periodText)) {
      period = 'day';
    }
  } else {
    // Check for special cases without explicit period markers
    if (/pln\/month|\/month|monthly|per month|\/mo/.test(raw.toLowerCase())) {
      period = 'month';
    } else if (/\/hour|hourly|per hour|\/hr/.test(raw.toLowerCase())) {
      period = 'hour';
    } else if (/pln\/month/.test(raw.toLowerCase())) {
      period = 'month';
      currency = 'PLN';
    } else if (/gross salary/.test(raw.toLowerCase())) {
      // Gross salary is usually monthly
      period = 'month';
    }
  }
  
  // Extract min and max (if range)
  let [min, max] = nums.length === 1 ? [nums[0], undefined] : nums.slice(0, 2);
  
  // Return simplified salary range
  return {
    min,
    max,
    currency,
    period,
    note: '' // No extra notes in the simplified format
  };
}

/**
 * Determines if a salary contains numeric values and appears to be
 * a proper salary range rather than a generic message
 */
export function isValidSalaryFormat(salary: string | null | undefined): boolean {
  if (!salary) return false;
  
  // Parse the salary
  const parsedSalary = parseSalary(salary);
  
  // Must have at least a min value
  return !!parsedSalary?.min;
} 