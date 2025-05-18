'use client'

import { ButtonDemo } from '@/components/ui/button-demo'
import { InputWithTagsDemo } from '@/components/ui/input-with-tags'
import { FilterChips, FilterChip } from '@/components/ui/filter-chips'
import AppLayout from '@/components/AppLayout'
import { useState } from 'react'

export default function UIShowcase() {
  const [filterChips, setFilterChips] = useState<FilterChip[]>([
    { id: '1', text: 'Featured', isActive: true },
    { id: '2', text: 'New', isActive: false },
    { id: '3', text: 'All', isActive: false },
    { id: '4', text: 'Remote', isActive: false },
    { id: '5', text: 'Full-time', isActive: true },
    { id: '6', text: 'Contract', isActive: false },
  ]);

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto py-8">
        <h1 className="text-3xl font-bold mb-8">UI Component Showcase</h1>
        
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Filter Chips</h2>
          <div className="p-6 bg-white rounded-lg border border-gray-200">
            <h3 className="text-xl mb-4">Filter Chips</h3>
            <FilterChips 
              initialChips={filterChips}
              onChange={setFilterChips}
            />
            
            <div className="mt-8">
              <h4 className="text-sm font-medium mb-2">States:</h4>
              <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                <div>
                  <h5 className="text-xs font-medium mb-2 text-gray-500">Default / Resting State:</h5>
                  <div className="relative h-7 px-3 rounded-full font-medium text-xs flex items-center border bg-white border-[#DEE0E8] text-gray-700 w-fit">
                    Unselected
                  </div>
                  <div className="mt-2 text-xs">
                    <p>Background: #FFFFFF</p>
                    <p>Border: #DEE0E8</p>
                    <p>Text: Default gray</p>
                  </div>
                </div>
                <div>
                  <h5 className="text-xs font-medium mb-2 text-gray-500">Active / Selected State:</h5>
                  <div className="relative h-7 px-3 rounded-full font-medium text-xs flex items-center border bg-[#D5EDF9] border-[#0D8DCF] text-[#0D8DCF] w-fit">
                    Selected
                  </div>
                  <div className="mt-2 text-xs">
                    <p>Background: #D5EDF9</p>
                    <p>Border: #0D8DCF</p>
                    <p>Text: #0D8DCF</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <h4 className="text-sm font-medium mb-2">Current State:</h4>
              <pre className="text-xs overflow-auto">{JSON.stringify(filterChips, null, 2)}</pre>
            </div>
          </div>
        </section>
        
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Input With Tags</h2>
          <div className="p-6 bg-white rounded-lg border border-gray-200">
            <InputWithTagsDemo />
          </div>
        </section>
        
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Buttons</h2>
          <div className="p-6 bg-white rounded-lg border border-gray-200">
            <ButtonDemo />
          </div>
        </section>
      </div>
    </AppLayout>
  )
} 