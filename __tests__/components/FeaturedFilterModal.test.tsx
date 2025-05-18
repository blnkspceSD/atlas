import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import FeaturedFilterModal, { FeaturedFilterSettings } from '@/components/FeaturedFilterModal';

// Mock default settings
const mockSettings: FeaturedFilterSettings = {
  employmentType: 'full-time',
  criteria: {
    hasSalary: true,
    remoteOnly: false,
    seniorLevel: false,
    recentlyPosted: false,
    largeCompany: false,
    hasEquity: false,
    visaSponsorship: false,
  }
};

describe('FeaturedFilterModal', () => {
  // Test modal rendering
  it('should not render when isOpen is false', () => {
    render(
      <FeaturedFilterModal 
        isOpen={false}
        onClose={() => {}}
        onSave={() => {}}
      />
    );
    
    const modalTitle = screen.queryByText('Configure Featured Jobs');
    expect(modalTitle).not.toBeInTheDocument();
  });
  
  it('should render when isOpen is true', () => {
    render(
      <FeaturedFilterModal 
        isOpen={true}
        onClose={() => {}}
        onSave={() => {}}
      />
    );
    
    const modalTitle = screen.getByText('Configure Featured Jobs');
    expect(modalTitle).toBeInTheDocument();
    
    // Check for the form elements
    expect(screen.getByText('Employment Type')).toBeInTheDocument();
    expect(screen.getByText('Additional Criteria')).toBeInTheDocument();
    expect(screen.getByText('Full-time')).toBeInTheDocument();
    expect(screen.getByText('Has salary posted')).toBeInTheDocument();
  });
  
  // Test initial settings
  it('should initialize with provided settings', () => {
    render(
      <FeaturedFilterModal 
        isOpen={true}
        onClose={() => {}}
        onSave={() => {}}
        initialSettings={mockSettings}
      />
    );
    
    // Check that the Full-time option is selected
    const fullTimeRadio = screen.getByLabelText('Full-time') as HTMLInputElement;
    expect(fullTimeRadio.checked).toBe(true);
    
    // Check that the Has salary posted checkbox is checked
    const hasSalaryCheckbox = screen.getByLabelText('Has salary posted') as HTMLInputElement;
    expect(hasSalaryCheckbox.checked).toBe(true);
  });
  
  // Test Save button state
  it('should disable Save button when no criteria are selected', () => {
    const customSettings: FeaturedFilterSettings = {
      employmentType: 'full-time',
      criteria: {
        hasSalary: false,
        remoteOnly: false,
        seniorLevel: false,
        recentlyPosted: false,
        largeCompany: false,
        hasEquity: false,
        visaSponsorship: false,
      }
    };
    
    render(
      <FeaturedFilterModal 
        isOpen={true}
        onClose={() => {}}
        onSave={() => {}}
        initialSettings={customSettings}
      />
    );
    
    const saveButton = screen.getByText('Save');
    expect(saveButton).toBeDisabled();
  });
  
  it('should enable Save button when at least one criteria is selected', () => {
    render(
      <FeaturedFilterModal 
        isOpen={true}
        onClose={() => {}}
        onSave={() => {}}
        initialSettings={mockSettings} // hasSalary is true
      />
    );
    
    const saveButton = screen.getByText('Save');
    expect(saveButton).not.toBeDisabled();
  });
  
  // Test callbacks
  it('should call onClose when Cancel button is clicked', () => {
    const mockOnClose = jest.fn();
    
    render(
      <FeaturedFilterModal 
        isOpen={true}
        onClose={mockOnClose}
        onSave={() => {}}
      />
    );
    
    const cancelButton = screen.getByText('Cancel');
    fireEvent.click(cancelButton);
    
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });
  
  it('should call onSave with updated settings when Save button is clicked', () => {
    const mockOnSave = jest.fn();
    
    render(
      <FeaturedFilterModal 
        isOpen={true}
        onClose={() => {}}
        onSave={mockOnSave}
        initialSettings={mockSettings}
      />
    );
    
    // Change some settings
    const partTimeRadio = screen.getByLabelText('Part-time') as HTMLInputElement;
    fireEvent.click(partTimeRadio);
    
    const remoteOnlyCheckbox = screen.getByLabelText('Remote only') as HTMLInputElement;
    fireEvent.click(remoteOnlyCheckbox);
    
    // Click save
    const saveButton = screen.getByText('Save');
    fireEvent.click(saveButton);
    
    // Check that onSave was called with the updated settings
    expect(mockOnSave).toHaveBeenCalledTimes(1);
    expect(mockOnSave).toHaveBeenCalledWith(expect.objectContaining({
      employmentType: 'part-time',
      criteria: expect.objectContaining({
        hasSalary: true,
        remoteOnly: true,
      })
    }));
  });
}); 