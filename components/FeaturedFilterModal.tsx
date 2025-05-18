import React, { useEffect, useState, useRef } from 'react';
import { X } from 'lucide-react';
import EmploymentTypeFilterGroup from './EmploymentTypeFilterGroup';
import AdditionalCriteriaFilterGroup from './AdditionalCriteriaFilterGroup';

export interface FeaturedFilterSettings {
  employmentType: 'full-time' | 'part-time' | 'contract';
  criteria: {
    hasSalary: boolean;
    remoteOnly: boolean;
    seniorLevel: boolean;
    recentlyPosted: boolean;
  };
}

interface FeaturedFilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (settings: FeaturedFilterSettings) => void;
  initialSettings?: Partial<FeaturedFilterSettings>;
}

const defaultSettings: FeaturedFilterSettings = {
  employmentType: 'full-time',
  criteria: {
    hasSalary: false,
    remoteOnly: false,
    seniorLevel: false,
    recentlyPosted: false,
  }
};

const FeaturedFilterModal: React.FC<FeaturedFilterModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialSettings = {},
}) => {
  const [settings, setSettings] = useState<FeaturedFilterSettings>({
    ...defaultSettings,
    ...initialSettings,
    criteria: {
      ...defaultSettings.criteria,
      ...initialSettings.criteria,
    }
  });
  
  const modalRef = useRef<HTMLDivElement>(null);
  const firstFocusableElement = useRef<HTMLButtonElement>(null);
  const lastFocusableElement = useRef<HTMLButtonElement>(null);
  
  // Check if at least one criteria is selected
  const isValid = settings.criteria.hasSalary || 
    settings.criteria.remoteOnly || 
    settings.criteria.seniorLevel || 
    settings.criteria.recentlyPosted;

  // Handle employment type change
  const handleEmploymentTypeChange = (type: FeaturedFilterSettings['employmentType']) => {
    setSettings(prev => ({
      ...prev,
      employmentType: type
    }));
  };

  // Handle criteria change
  const handleCriteriaChange = (key: keyof FeaturedFilterSettings['criteria'], checked: boolean) => {
    setSettings(prev => ({
      ...prev,
      criteria: {
        ...prev.criteria,
        [key]: checked
      }
    }));
  };

  // Handle ESC key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
      
      // Trap focus
      if (e.key === 'Tab' && isOpen) {
        if (e.shiftKey) {
          if (document.activeElement === firstFocusableElement.current) {
            e.preventDefault();
            lastFocusableElement.current?.focus();
          }
        } else {
          if (document.activeElement === lastFocusableElement.current) {
            e.preventDefault();
            firstFocusableElement.current?.focus();
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  // Focus management
  useEffect(() => {
    if (isOpen) {
      firstFocusableElement.current?.focus();
      
      // Save previous active element to restore focus on close
      const previousActiveElement = document.activeElement as HTMLElement;
      
      return () => {
        previousActiveElement?.focus();
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 animate-fadeIn">
      <div 
        ref={modalRef}
        className="w-full max-w-lg bg-white rounded-2xl shadow-xl animate-scaleIn" 
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div className="flex justify-between items-center border-b border-gray-200 p-6">
          <h2 id="modal-title" className="text-xl font-semibold text-gray-900">Configure Featured Jobs</h2>
          <button
            ref={firstFocusableElement}
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 p-2 rounded-full hover:bg-gray-100 transition"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6">
          <EmploymentTypeFilterGroup 
            currentType={settings.employmentType}
            onChange={handleEmploymentTypeChange}
          />
          
          <AdditionalCriteriaFilterGroup 
            criteria={settings.criteria}
            onChange={handleCriteriaChange}
          />
        </div>
        
        <div className="border-t border-gray-200 p-6 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
          >
            Cancel
          </button>
          <button
            ref={lastFocusableElement}
            onClick={() => onSave(settings)}
            disabled={!isValid}
            className={isValid 
              ? "px-4 py-2 rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition" 
              : "px-4 py-2 rounded-lg text-white bg-blue-400 cursor-not-allowed transition"}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default FeaturedFilterModal; 