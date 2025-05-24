"use client";

import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { ChevronRight } from "lucide-react";

// Type definition for individual filter chip data structure
export type FilterChip = {
  id: string;
  text: string;
  isActive?: boolean;
  hasSettings?: boolean;  // Determines if chip shows settings button when active
  onSettingsClick?: () => void;  // Callback for when settings button is clicked
};

interface FilterChipsProps {
  initialChips: FilterChip[];
  onChange?: (chips: FilterChip[]) => void;  // Callback when chip states change
  className?: string;
}

export function FilterChips({
  initialChips,
  onChange,
  className,
}: FilterChipsProps) {
  // Core function to toggle a chip's active/inactive state
  const toggleChip = (chipId: string) => {
    console.log("Toggling chip:", chipId);
    
    // Create new array with updated chip state, keeping others unchanged
    const updatedChips = initialChips.map(chip => {
      if (chip.id === chipId) {
        const newChip = { ...chip, isActive: !chip.isActive };
        console.log(`Chip ${chip.id} (${chip.text}) state changing from ${chip.isActive} to ${!chip.isActive}`);
        return newChip;
      }
      return chip;
    });
    
    console.log("Updated chips:", updatedChips);
    // Notify parent component of state changes
    onChange?.(updatedChips);
  };

  // Handle settings button click without toggling the chip itself
  const handleSettingsClick = (e: React.MouseEvent, chip: FilterChip) => {
    e.stopPropagation(); // Prevent the chip toggle from firing
    if (chip.onSettingsClick) {
      chip.onSettingsClick();
    }
  };

  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {initialChips.map((chip) => (
        <button
          key={chip.id}
          onClick={() => toggleChip(chip.id)}
          className={cn(
            "relative h-7 px-3 rounded-full font-medium text-xs flex items-center cursor-pointer transition-colors border",
            // Conditional styling based on active state
            chip.isActive 
              ? "bg-[#D5EDF9] border-[#0D8DCF] text-[#0D8DCF]"  // Active: blue theme
              : "bg-white border-[#DEE0E8] text-gray-700 hover:bg-gray-50"  // Inactive: gray theme
          )}
          type="button"
        >
          {chip.text}
          {/* Settings button - only shown when chip is active and has settings enabled */}
          {chip.hasSettings && chip.isActive && (
            <span 
              onClick={(e) => handleSettingsClick(e, chip)}
              className="ml-1.5 p-0.5 rounded-full hover:bg-[#0D8DCF] hover:bg-opacity-10 transition-colors"
              aria-label={`Configure ${chip.text} settings`}
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </span>
          )}
        </button>
      ))}
    </div>
  );
} 