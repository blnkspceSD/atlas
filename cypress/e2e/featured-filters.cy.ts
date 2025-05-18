describe('Featured Jobs Filter', () => {
  beforeEach(() => {
    // Visit the page with the featured jobs demo
    cy.visit('/featured-jobs-demo');
    
    // Clear localStorage before each test to start fresh
    cy.clearLocalStorage();
  });
  
  it('should open the filter modal when clicking the settings icon', () => {
    // Find a job card with the featured badge
    cy.get('[aria-label="Configure featured jobs"]').first().click();
    
    // Verify modal appears
    cy.contains('Configure Featured Jobs').should('be.visible');
    cy.contains('Employment Type').should('be.visible');
    cy.contains('Additional Criteria').should('be.visible');
  });
  
  it('should close the modal when clicking Cancel', () => {
    // Open modal
    cy.get('[aria-label="Configure featured jobs"]').first().click();
    
    // Click Cancel
    cy.contains('Cancel').click();
    
    // Verify modal is closed
    cy.contains('Configure Featured Jobs').should('not.exist');
  });
  
  it('should save filter settings and update featured jobs', () => {
    // Open modal
    cy.get('[aria-label="Configure featured jobs"]').first().click();
    
    // Change employment type to Part-time
    cy.contains('Part-time').click();
    
    // Select some criteria
    cy.contains('Remote only').click();
    cy.contains('Has salary posted').click();
    
    // Save changes
    cy.contains('Save').click();
    
    // Verify modal is closed
    cy.contains('Configure Featured Jobs').should('not.exist');
    
    // Check if the featured badge appears only on matching jobs
    // This depends on your implementation details, but we can check for a basic pattern
    
    // Part-time UI Designer should be featured (matches criteria)
    cy.contains('Part-time UI Designer')
      .parents('.bg-\\[\\#F7F7F7\\]') // Parent job card
      .contains('Featured')
      .should('be.visible');
    
    // Backend Engineer should not be featured (not remote)
    cy.contains('Backend Engineer')
      .parents('.bg-\\[\\#F7F7F7\\]') // Parent job card
      .contains('Featured')
      .should('not.exist');
  });
  
  it('should persist filter settings in localStorage', () => {
    // Open modal
    cy.get('[aria-label="Configure featured jobs"]').first().click();
    
    // Change employment type to Contract
    cy.contains('Contract').click();
    
    // Select senior level criteria
    cy.contains('Senior level').click();
    
    // Save changes
    cy.contains('Save').click();
    
    // Verify localStorage was updated with filter settings
    cy.window().then((win) => {
      const storedSettings = JSON.parse(win.localStorage.getItem('featuredFilters') || '{}');
      expect(storedSettings.employmentType).to.equal('contract');
      expect(storedSettings.criteria.seniorLevel).to.be.true;
    });
    
    // Reload the page to verify persistence
    cy.reload();
    
    // Open modal again
    cy.get('[aria-label="Configure featured jobs"]').first().click();
    
    // Verify settings are still applied
    cy.get('input[type="radio"]').check('contract');
    cy.get('input[type="checkbox"]').should('be.checked');
  });
  
  it('should disable Save button when no criteria are selected', () => {
    // Open modal
    cy.get('[aria-label="Configure featured jobs"]').first().click();
    
    // Uncheck all criteria
    cy.get('input[type="checkbox"]:checked').each(($el) => {
      cy.wrap($el).click();
    });
    
    // Save button should be disabled
    cy.contains('Save').should('be.disabled');
    
    // Check one criteria
    cy.contains('Remote only').click();
    
    // Save button should be enabled
    cy.contains('Save').should('not.be.disabled');
  });
}); 