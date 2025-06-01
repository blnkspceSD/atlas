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
    // Main container with full screen height
    <div className="h-screen bg-background">
      {/* Header component with menu controls */}
      <Header 
        onMenuClick={toggleSidebar}  // Hamburger menu click handler
        isCollapsed={isSidebarCollapsed}  // Pass collapse state to header
        onToggleCollapse={toggleCollapse}  // Collapse toggle handler
      />
      
      {/* Sidebar component with all state and handlers */}
      <Sidebar 
        isOpen={isSidebarOpen}  // Controls sidebar visibility
        onClose={() => setIsSidebarOpen(false)}  // Handler to close sidebar
        isCollapsed={isSidebarCollapsed}  // Controls sidebar collapse state
        onToggleCollapse={toggleCollapse}  // Handler to toggle collapse
        currentPath={pathname}  // Current route for active navigation highlighting
      />
      
      {/* Main content area that adapts to sidebar state */}
      <main 
        className={`flex-1 overflow-y-auto transition-all duration-200 pt-16 bg-background ${
          isSidebarCollapsed 
            ? 'md:pl-[3.05rem]' // Collapsed sidebar width
            : 'md:pl-[15rem]'   // Expanded sidebar width
        }`}
      >
        {/* Inner container with minimum full height */}
        <div className="min-h-full w-full">
          {/* Render child components/pages passed to the layout */}
          {children}
        </div>
      </main>
    </div>
  )
}

export default AppLayout 