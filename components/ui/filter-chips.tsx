"use client";

import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { ChevronRight } from "lucide-react";

export type FilterChip = {
  id: string;
  text: string;
  isActive?: boolean;
  hasSettings?: boolean;
  onSettingsClick?: () => void;
};

interface FilterChipsProps {
  initialChips: FilterChip[];
  onChange?: (chips: FilterChip[]) => void;
  className?: string;
}

export function FilterChips({
  initialChips,
  onChange,
  className,
}: FilterChipsProps) {
  // Toggle a chip's active state
  const toggleChip = (chipId: string) => {
    console.log("Toggling chip:", chipId);
    
    const updatedChips = initialChips.map(chip => {
      if (chip.id === chipId) {
        const newChip = { ...chip, isActive: !chip.isActive };
        console.log(`Chip ${chip.id} (${chip.text}) state changing from ${chip.isActive} to ${!chip.isActive}`);
        return newChip;
      }
      return chip;
    });
    
    console.log("Updated chips:", updatedChips);
    onChange?.(updatedChips);
  };

  // Handle settings button click
  const handleSettingsClick = (e: React.MouseEvent, chip: FilterChip) => {
    e.stopPropagation(); // Prevent toggling the chip
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
            chip.isActive 
              ? "bg-[#D5EDF9] border-[#0D8DCF] text-[#0D8DCF]" 
              : "bg-white border-[#DEE0E8] text-gray-700 hover:bg-gray-50"
          )}
          type="button"
        >
          {chip.text}
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