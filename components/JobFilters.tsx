import React, { useState } from 'react'
import { Funnel, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'

const JobFilters = () => {
  const [filtersOpen, setFiltersOpen] = useState(false)
  
  return (
    <div className="mb-8">
      <button 
        onClick={() => setFiltersOpen(!filtersOpen)}
        className="flex items-center gap-2 text-gray-700 font-medium mb-4 hover:text-primary"
      >
        <Funnel className="h-5 w-5 text-gray-500" />
        Filters 
        <ChevronDown className={`h-5 w-5 transition-transform ${filtersOpen ? 'rotate-180' : ''}`} />
      </button>
      
      {filtersOpen && (
        <div className="bg-white p-6 rounded-lg border border-gray-200 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h3 className="font-medium mb-3 text-gray-700">Job type</h3>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input type="checkbox" className="rounded text-primary mr-2" />
                  <span className="text-gray-700">Full-time</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="rounded text-primary mr-2" />
                  <span className="text-gray-700">Part-time</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="rounded text-primary mr-2" />
                  <span className="text-gray-700">Contract</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="rounded text-primary mr-2" />
                  <span className="text-gray-700">Freelance</span>
                </label>
              </div>
            </div>
            
            <div>
              <h3 className="font-medium mb-3 text-gray-700">Experience level</h3>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input type="checkbox" className="rounded text-primary mr-2" />
                  <span className="text-gray-700">Entry level</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="rounded text-primary mr-2" />
                  <span className="text-gray-700">Mid level</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="rounded text-primary mr-2" />
                  <span className="text-gray-700">Senior level</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="rounded text-primary mr-2" />
                  <span className="text-gray-700">Director</span>
                </label>
              </div>
            </div>
            
            <div>
              <h3 className="font-medium mb-3 text-gray-700">Salary range</h3>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input type="checkbox" className="rounded text-primary mr-2" />
                  <span className="text-gray-700">$50k - $80k</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="rounded text-primary mr-2" />
                  <span className="text-gray-700">$80k - $100k</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="rounded text-primary mr-2" />
                  <span className="text-gray-700">$100k - $130k</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="rounded text-primary mr-2" />
                  <span className="text-gray-700">$130k+</span>
                </label>
              </div>
            </div>
          </div>
          
          <div className="mt-6 pt-6 border-t border-gray-200 flex justify-between">
            <Button variant="ghost" className="text-gray-600 font-medium">
              Clear all filters
            </Button>
            
            <Button className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800">
              Apply filters
            </Button>
          </div>
        </div>
      )}
      
      <div className="flex justify-between items-center">
        <div className="text-sm text-gray-500">Showing 150 job matches</div>
        
        <div className="flex items-center">
          <span className="mr-2 text-sm text-gray-700">Sort by:</span>
          <select className="text-sm border-0 focus:ring-0 text-gray-700 font-medium bg-transparent pr-7">
            <option>Most relevant</option>
            <option>Newest</option>
            <option>Highest salary</option>
            <option>Company name (A-Z)</option>
          </select>
        </div>
      </div>
    </div>
  )
}

export default JobFilters 