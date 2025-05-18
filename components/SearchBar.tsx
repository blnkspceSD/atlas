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
  const { featuredFilterSettings, setFeaturedFilterSettings, applyFeaturedFilters } = useJobFilters();
  
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
  };
  
  const handleSaveFilterSettings = async (settings: FeaturedFilterSettings) => {
    setFeaturedFilterSettings(settings);
    setIsFilterModalOpen(false);
  };

  const handleNaturalLanguageSearch = (query: string, withSearchActive: boolean) => {
    console.log("Natural language query:", query);
    console.log("Search (globe icon) active:", withSearchActive);
    applyFeaturedFilters();
  };

  return (
    <div className="mb-8">
      <div className="mb-6">
        <NaturalLanguageSearch onSubmit={handleNaturalLanguageSearch} />
      </div>
      
      <div className="flex items-center justify-between mb-6">
        <div className="flex flex-wrap gap-2">
          <FilterChips
            initialChips={regions}
            onChange={handleRegionChange}
          />
        </div>
        
        <div className="flex items-center">
          <span className="mr-2 text-sm text-gray-500">View</span>
          <Button variant="outline" size="icon" className="p-2">
            <List className="h-4 w-4 text-gray-600" />
          </Button>
          <Button variant="outline" size="icon" className="ml-2 p-2">
            <LayoutGrid className="h-4 w-4 text-gray-600" />
          </Button>
        </div>
      </div>
      
      <FeaturedFilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        onSave={handleSaveFilterSettings}
        initialSettings={featuredFilterSettings || undefined}
      />
    </div>
  )
}

export default SearchBar 