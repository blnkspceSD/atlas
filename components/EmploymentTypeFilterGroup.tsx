import React from 'react';
import { FeaturedFilterSettings } from './FeaturedFilterModal'; // Adjust path if necessary

interface EmploymentTypeFilterGroupProps {
  currentType: FeaturedFilterSettings['employmentType'];
  onChange: (type: FeaturedFilterSettings['employmentType']) => void;
}

const employmentTypes: { value: FeaturedFilterSettings['employmentType']; label: string }[] = [
  { value: 'full-time', label: 'Full-time' },
  { value: 'part-time', label: 'Part-time' },
  { value: 'contract', label: 'Contract' },
];

const EmploymentTypeFilterGroup: React.FC<EmploymentTypeFilterGroupProps> = ({ currentType, onChange }) => {
  return (
    <div className="mb-6">
      <h3 className="text-base font-medium text-gray-900 mb-3">Employment Type</h3>
      <div className="space-y-2">
        {employmentTypes.map((type) => (
          <label key={type.value} className="flex items-center">
            <input
              type="radio"
              name="employmentType"
              className="form-radio text-blue-600 focus:ring-blue-500"
              checked={currentType === type.value}
              onChange={() => onChange(type.value)}
            />
            <span className="ml-2 text-gray-700">{type.label}</span>
          </label>
        ))}
      </div>
    </div>
  );
};

export default EmploymentTypeFilterGroup; 