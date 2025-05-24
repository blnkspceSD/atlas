'use client'

import React, { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import Header from './Header'
import Sidebar from './Sidebar'

interface AppLayoutProps {
  children: React.ReactNode
}

const AppLayout = ({ children }: AppLayoutProps) => {
  // State to control whether the sidebar is open or closed (primarily for mobile)
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  
  // State to control whether the sidebar is collapsed (minimized) or expanded
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  
  // Get the current pathname to detect route changes
  const pathname = usePathname()

  // Effect to handle responsive behavior - automatically hide sidebar on mobile screens
  useEffect(() => {
    const handleResize = () => {
      // If screen is smaller than tablet size (768px), close the sidebar
      if (window.innerWidth < 768) {
        setIsSidebarOpen(false)
      } else {
        // On larger screens, keep sidebar open by default
        setIsSidebarOpen(true)
      }
    }
    
    // Set initial state based on current screen size
    handleResize()
    
    // Listen for window resize events to adjust sidebar visibility
    window.addEventListener('resize', handleResize)
    
    // Cleanup event listener when component unmounts
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Effect to automatically close sidebar on mobile when user navigates to a new page
  useEffect(() => {
    // Only close sidebar on mobile screens to improve UX
    if (window.innerWidth < 768) {
      setIsSidebarOpen(false)
    }
  }, [pathname]) // Runs whenever the pathname changes

  // Function to toggle sidebar open/closed state (used by hamburger menu)
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  // Function to toggle sidebar collapsed/expanded state (minimizes sidebar while keeping it visible)
  const toggleCollapse = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed)
  }

  return (
    // Main container with full screen height and light gray background
    <div className="h-screen bg-gray-50">
      {/* Header component with menu controls */}
      <Header 
        onMenuClick={toggleSidebar}  // Hamburger menu click handler
        isCollapsed={isSidebarCollapsed}  // Pass collapse state to header
        onToggleCollapse={toggleCollapse}  // Collapse toggle handler
      />
      
      {/* Main content area below the header */}
      <div className="flex h-full">
        {/* Sidebar component with all state and handlers */}
        <Sidebar 
          isOpen={isSidebarOpen}  // Controls sidebar visibility
          onClose={() => setIsSidebarOpen(false)}  // Handler to close sidebar
          isCollapsed={isSidebarCollapsed}  // Controls sidebar collapse state
          onToggleCollapse={toggleCollapse}  // Handler to toggle collapse
          currentPath={pathname}  // Current route for active navigation highlighting
        />
        
        {/* Main content area that takes remaining space */}
        <main 
          className="flex-1 overflow-y-auto bg-gray-50"
        >
          {/* Inner container with minimum full height */}
          <div className="min-h-full bg-gray-50">
            {/* Render child components/pages passed to the layout */}
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}

export default AppLayout 