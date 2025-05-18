'use client'

import React, { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import Header from './Header'
import Sidebar from './Sidebar'

interface AppLayoutProps {
  children: React.ReactNode
}

const AppLayout = ({ children }: AppLayoutProps) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const pathname = usePathname()

  // For mobile: close sidebar when route changes
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsSidebarOpen(false)
      } else {
        setIsSidebarOpen(true)
      }
    }
    
    // Initialize based on screen size
    handleResize()
    
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Close sidebar on mobile when navigating
  useEffect(() => {
    if (window.innerWidth < 768) {
      setIsSidebarOpen(false)
    }
  }, [pathname])

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  const toggleCollapse = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed)
  }

  return (
    <div className="h-screen bg-gray-50">
      <Header 
        onMenuClick={toggleSidebar} 
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={toggleCollapse}
      />
      
      <div className="flex h-[calc(100vh-57px)] pt-[57px]">
        <Sidebar 
          isOpen={isSidebarOpen} 
          onClose={() => setIsSidebarOpen(false)} 
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={toggleCollapse}
          currentPath={pathname}
        />
        
        <main 
          className={`flex-1 overflow-y-auto bg-gray-50 p-6 ${
            !isSidebarCollapsed && isSidebarOpen ? 'md:ml-64' : ''
          }`}
        >
          <div className="min-h-full bg-gray-50">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}

export default AppLayout 