import React from 'react';
import { FeaturedFilterSettings } from './FeaturedFilterModal'; // Adjust path if necessary

interface AdditionalCriteriaFilterGroupProps {
  criteria: FeaturedFilterSettings['criteria'];
  onChange: (key: keyof FeaturedFilterSettings['criteria'], checked: boolean) => void;
}

const criteriaOptions: { key: keyof FeaturedFilterSettings['criteria']; label: string }[] = [
  { key: 'hasSalary', label: 'Has salary posted' },
  { key: 'remoteOnly', label: 'Remote only' },
  { key: 'seniorLevel', label: 'Senior level' },
  { key: 'recentlyPosted', label: 'Posted within last 7 days' },
  // { key: 'largeCompany', label: 'Company size > 50' }, 
  // { key: 'hasEquity', label: 'Equity offered' },
  // { key: 'visaSponsorship', label: 'Visa sponsorship available' },
];

const AdditionalCriteriaFilterGroup: React.FC<AdditionalCriteriaFilterGroupProps> = ({ criteria, onChange }) => {
  return (
    <div>
      <h3 className="text-base font-medium text-gray-900 mb-3">Additional Criteria</h3>
      <p className="text-sm text-gray-500 mb-4">Select at least one criteria below:</p>
      <div className="space-y-2">
        {criteriaOptions.map((option) => (
          <label key={option.key} className="flex items-center">
            <input
              type="checkbox"
              className="form-checkbox text-blue-600 rounded focus:ring-blue-500"
              checked={criteria[option.key]}
              onChange={(e) => onChange(option.key, e.target.checked)}
            />
            {/* Handle potential HTML entities in labels if they come from an external source or need specific rendering */}
            <span className="ml-2 text-gray-700" dangerouslySetInnerHTML={{ __html: option.label }}></span>
          </label>
        ))}
      </div>
    </div>
  );
};

export default AdditionalCriteriaFilterGroup; 