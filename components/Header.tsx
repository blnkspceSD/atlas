'use client'

import React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

interface HeaderProps {
  onMenuClick: () => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

const Header = ({ onMenuClick, isCollapsed, onToggleCollapse }: HeaderProps) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-gray-50 border-b border-gray-200">
      <div className="flex items-center justify-between h-full px-4">
        <div className="flex items-center">
          {/* Mobile menu toggle */}
          <button
            onClick={onMenuClick}
            className="p-2 -ml-2 md:hidden"
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
          
          {/* Desktop sidebar collapse toggle - now on the left of atlas logo */}
          <button
            onClick={onToggleCollapse}
            className={`hidden md:flex p-2 mr-2 rounded-md ${isCollapsed ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <svg
              className="w-5 h-5 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
          
          <div className="text-primary text-2xl font-bold">atlas.</div>
        </div>
        
        <div className="flex gap-3 items-center">
          <Link href="/ui-showcase" className="text-gray-600 hover:text-gray-900 text-sm mr-2">
            UI Showcase
          </Link>
          <Button variant="outline" size="sm">
            Register
          </Button>
          <Button size="sm">
            Sign in
          </Button>
        </div>
      </div>
    </header>
  )
}

export default Header 