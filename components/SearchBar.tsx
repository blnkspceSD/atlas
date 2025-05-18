import React, { useState, useEffect } from 'react'
import { Search, ChevronDown, LayoutGrid, List } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { FilterChips, FilterChip } from '@/components/ui/filter-chips'
import FeaturedFilterModal, { FeaturedFilterSettings } from '@/components/FeaturedFilterModal'
import { useJobFilters } from '@/contexts/JobFilterContext'

const SearchBar = () => {
  // State for filter modal
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  
  // Get filter settings and methods from context
  const { featuredFilterSettings, setFeaturedFilterSettings, applyFeaturedFilters } = useJobFilters();
  
  const [regions, setRegions] = useState<FilterChip[]>([
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
    // Update the local state with the new chip values
    setRegions(updatedChips);
    // console.log('Region filters changed:', updatedChips);
  };
  
  // Handle saving filter settings - now uses context
  const handleSaveFilterSettings = async (settings: FeaturedFilterSettings) => {
    setFeaturedFilterSettings(settings);
    setIsFilterModalOpen(false);
  };

  // Handle search button click
  const handleSearch = () => {
    // Apply current filters when search button is clicked
    applyFeaturedFilters();
    // console.log('Search button clicked, applying filters');
  };

  return (
    <div className="mb-8">
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder="What's your job title?"
            className="w-full p-4 pr-10 border border-gray-300 rounded-lg"
          />
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
        </div>
        
        <div className="flex-1 relative">
          <select className="w-full p-4 appearance-none border border-gray-300 rounded-lg">
            <option value="">Location</option>
            <option value="remote">Remote</option>
            <option value="us">United States</option>
            <option value="europe">Europe</option>
            <option value="asia">Asia</option>
          </select>
          <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
        </div>
        
        <div className="flex-1 relative">
          <select className="w-full p-4 appearance-none border border-gray-300 rounded-lg">
            <option value="">Salary range</option>
            <option value="100k">$100,000+</option>
            <option value="125k">$125,000+</option>
            <option value="150k">$150,000+</option>
            <option value="200k">$200,000+</option>
          </select>
          <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
        </div>
        
        <Button size="lg" onClick={handleSearch}>
          <Search className="h-5 w-5" />
        </Button>
      </div>
      
      {/* New container for filters and view options on one line */}
      <div className="flex items-center justify-between mb-6">
        {/* Filter Chips - aligned to the left */}
        <div className="flex flex-wrap gap-2">
          <FilterChips
            initialChips={regions}
            onChange={handleRegionChange}
          />
        </div>
        
        {/* View Options - aligned to the right */}
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
      
      {/* Featured Filter Modal */}
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