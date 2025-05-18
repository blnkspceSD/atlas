'use client';

import React from "react";
import { SalaryRange } from "@/types/job";

interface SalaryProps extends Partial<SalaryRange> {
  className?: string;
  showLabel?: boolean;
  rawSalary?: string; // Optional raw salary string for fallback
}

/**
 * Renders a salary range in a consistent format as per requirements:
 * 1. Annual: "$Min - $Max" or just "$Salary"
 * 2. Hourly: "$Rate / hr"
 * 3. Daily: "$Rate / day"
 * 4. Monthly: Convert to annual and display as annual
 */
export function Salary({ 
  min, 
  max, 
  currency = 'USD', 
  period = 'year', 
  note,
  className = '',
  showLabel = false,
  rawSalary
}: SalaryProps) {
  
  // Month to year conversion factor
  const MONTH_TO_YEAR = 12;
  
  // Format currency values
  const formatCurrency = (value: number): string => {
    // For USD, use $ prefix
    if (currency === 'USD') {
      return `$${Math.round(value).toLocaleString()}`;
    }
    
    // For other currencies, use the code as a prefix
    return `${Math.round(value).toLocaleString()} ${currency}`;
  };
  
  // Convert to annual if monthly
  const getAnnualValue = (value: number): number => {
    if (period === 'month') {
      return value * MONTH_TO_YEAR;
    }
    return value;
  };
  
  // No salary data
  if (!min && !max) {
    return (
      <span className={className}>
        {showLabel && <span className="text-gray-500 mr-2">Salary:</span>}
        <span>Salary not disclosed</span>
      </span>
    );
  }
  
  // Annual or monthly (converted to annual) salary
  if (period === 'year' || period === 'month') {
    // Convert monthly to annual if needed
    const annualMin = min ? getAnnualValue(min) : undefined;
    const annualMax = max ? getAnnualValue(max) : undefined;
    
    // Range: Both min and max
    if (annualMin && annualMax) {
      return (
        <span className={className}>
          {showLabel && <span className="text-gray-500 mr-2">Salary:</span>}
          <span>{formatCurrency(annualMin)} - {formatCurrency(annualMax)}</span>
        </span>
      );
    }
    
    // Just min, no max (fixed salary)
    if (annualMin) {
      return (
        <span className={className}>
          {showLabel && <span className="text-gray-500 mr-2">Salary:</span>}
          <span>{formatCurrency(annualMin)}</span>
        </span>
      );
    }
    
    // Just max, no min (rare case)
    if (annualMax) {
      return (
        <span className={className}>
          {showLabel && <span className="text-gray-500 mr-2">Salary:</span>}
          <span>{formatCurrency(annualMax)}</span>
        </span>
      );
    }
  }
  
  // Hourly rate
  if (period === 'hour' && min) {
    return (
      <span className={className}>
        {showLabel && <span className="text-gray-500 mr-2">Salary:</span>}
        <span>
          {formatCurrency(min)}
          {max ? ` - ${formatCurrency(max)}` : ''}
          {' / hr'}
        </span>
      </span>
    );
  }
  
  // Daily rate
  if (period === 'day' && min) {
    return (
      <span className={className}>
        {showLabel && <span className="text-gray-500 mr-2">Salary:</span>}
        <span>
          {formatCurrency(min)}
          {max ? ` - ${formatCurrency(max)}` : ''}
          {' / day'}
        </span>
      </span>
    );
  }
  
  // Weekly rate - show as weekly
  if (period === 'week' && min) {
    return (
      <span className={className}>
        {showLabel && <span className="text-gray-500 mr-2">Salary:</span>}
        <span>
          {formatCurrency(min)}
          {max ? ` - ${formatCurrency(max)}` : ''}
          {' / week'}
        </span>
      </span>
    );
  }
  
  // Fallback to raw salary if unable to format consistently
  if (rawSalary) {
    return (
      <span className={className}>
        {showLabel && <span className="text-gray-500 mr-2">Salary:</span>}
        <span>{rawSalary}</span>
      </span>
    );
  }
  
  // Should never reach here, but TypeScript wants it
  return null;
} 