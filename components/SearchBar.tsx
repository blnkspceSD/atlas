import React, { useState, useEffect } from 'react'
import { Search, ChevronDown, LayoutGrid, List } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { FilterChips, FilterChip } from '@/components/ui/filter-chips'
import FeaturedFilterModal, { FeaturedFilterSettings } from '@/components/FeaturedFilterModal'
import { useJobFilters } from '@/contexts/JobFilterContext'
import { NaturalLanguageSearch } from './NaturalLanguageSearch'

const SearchBar = () => {
  // State for filter modal
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  
  // Get filter settings and methods from context
  const { 
    searchQuery,
    setSearchQuery,
    featuredFilterSettings, 
    setFeaturedFilterSettings, 
    applyFeaturedFilters 
  } = useJobFilters();
  
  const [regions, setRegions] = useState<FilterChip[]>(() => [
    { 
      id: '1', 
      text: 'Featured', 
      isActive: true, 
      hasSettings: true,
      onSettingsClick: () => setIsFilterModalOpen(true)
    },
    { id: '2', text: 'New', isActive: false },
    { id: '3', text: 'All', isActive: false },
    { id: '4', text: 'NA', isActive: false },
    { id: '5', text: 'EU', isActive: false },
    { id: '6', text: 'APAC', isActive: false },
    { id: '7', text: 'EMEA', isActive: false }
  ]);

  const handleRegionChange = (updatedChips: FilterChip[]) => {
    setRegions(updatedChips);
    // TODO: Update jobFilters context based on selected regions
  };
  
  const handleSaveFilterSettings = async (settings: FeaturedFilterSettings) => {
    setFeaturedFilterSettings(settings);
    setIsFilterModalOpen(false);
    applyFeaturedFilters();
  };

  // This function is called by NaturalLanguageSearch when a search is submitted
  const handleNaturalLanguageSearch = (query: string) => { 
    console.log("Natural language query submitted:", query);
    setSearchQuery(query);
    applyFeaturedFilters();
  };

  return (
    // Outermost container for the entire search bar section, with background and border
    <div className="sticky top-0 z-10 border-b bg-gray-50">
      {/* Centered container for the content within the search bar section */}
      <div className="py-4 container mx-auto max-w-[1440px]">
        {/* Container for the natural language search input */}
        <div className="mb-4">
          <NaturalLanguageSearch 
            initialQuery={searchQuery}
            onSearch={handleNaturalLanguageSearch} 
            className="w-full"
          />
        </div>
        
        {/* Container for filter chips and view toggle options */}
        <div className="flex items-center justify-between">
          {/* Container for the filter chips themselves */}
          <div className="flex flex-wrap gap-2">
            <FilterChips
              initialChips={regions}
              onChange={handleRegionChange}
            />
          </div>
          
          {/* Container for the view options (List/Grid) */}
          <div className="flex items-center">
            <span className="mr-2 text-sm text-gray-500 dark:text-gray-400">View</span>
            <Button variant="outline" size="icon" className="p-2">
              <List className="h-4 w-4 text-gray-600 dark:text-gray-300" />
            </Button>
            <Button variant="outline" size="icon" className="ml-2 p-2">
              <LayoutGrid className="h-4 w-4 text-gray-600 dark:text-gray-300" />
            </Button>
          </div>
        </div>
      </div>
      
      <FeaturedFilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        onSave={handleSaveFilterSettings}
        initialSettings={featuredFilterSettings || undefined} // Pass undefined if null
      />
    </div>
  );
}

export default SearchBar 