'use client'

import React from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import SidebarNavItem from './SidebarNavItem'
import {
  LayoutGrid, Bookmark, FileText, UserCircle, MessageSquare, Settings, LogOut, ChevronLeft, X
} from 'lucide-react'

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  currentPath: string;
}

const Sidebar = ({ isOpen, onClose, isCollapsed, onToggleCollapse, currentPath }: SidebarProps) => {
  // Helper function to determine if the link is active
  const isActive = (path: string) => {
    // Handle base path and specific paths
    if (path === '/') return currentPath === '/';
    return currentPath.startsWith(path) && (currentPath === path || currentPath.charAt(path.length) === '/');
  };

  const navItems = [
    {
      title: 'EXPLORE',
      links: [
        { href: '/', label: 'Jobs', icon: <LayoutGrid className="w-5 h-5" /> },
        { href: '/saved', label: 'Saved', icon: <Bookmark className="w-5 h-5" /> },
      ],
    },
    {
      title: 'PERSONAL',
      links: [
        { href: '/applications', label: 'Applications', icon: <FileText className="w-5 h-5" /> },
        { href: '/profile', label: 'Resume', icon: <UserCircle className="w-5 h-5" /> }, // Changed from # to /profile
      ],
    },
    {
      title: 'COMMUNITY',
      links: [
        { href: '/feed', label: 'Feed', icon: <MessageSquare className="w-5 h-5" /> },
      ],
    },
  ];

  const bottomNavItems = [
    { href: '/settings', label: 'Settings', icon: <Settings className="w-5 h-5" /> },
    { href: '/logout', label: 'Logout', icon: <LogOut className="w-5 h-5" /> }, // Example, actual logout handled by auth
  ];
  
  return (
    <>
      {/* Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            className="fixed inset-0 bg-black bg-opacity-50 md:hidden z-40"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <AnimatePresence initial={false}>
        {(isOpen || !isCollapsed) && (
          <motion.aside 
            className={`
              flex flex-col flex-shrink-0 overflow-y-auto
              ${isOpen ? 'translate-x-0' : '-translate-x-full'}
              md:translate-x-0 z-40 h-full
              bg-gray-50 border-r border-gray-200
              fixed top-0 md:top-0 inset-y-auto left-0 transform
              md:relative md:h-screen md:max-h-screen 
            `} // Adjusted for stickiness
            initial={false}
            animate={{ 
              width: isCollapsed ? 80 : 256, // Adjusted collapsed width
              x: isOpen && !isCollapsed ? 0 : (isCollapsed ? 0 : -320), // Simpler x logic for mobile
              opacity: 1 // Always keep opacity 1 for smoother transition with width
            }}
            exit={{ 
              width: 0, 
              x: -320,
              opacity: 0 
            }}
            transition={{ 
              type: "tween", 
              duration: 0.2
            }}
          >
            <div className={`flex flex-col h-full ${isCollapsed ? 'items-center' : ''}`}>
              {/* Sidebar Header (Logo and Collapse Toggle for desktop) */}
              <div className={`flex items-center border-b border-gray-200 ${isCollapsed ? 'justify-center h-[57px]' : 'justify-between h-[57px] px-4'}`}>
                {!isCollapsed && (
                  <Link href="/" className="text-xl font-bold text-blue-600">
                    Atlas
                  </Link>
                )}
                <button
                  onClick={onToggleCollapse}
                  className={`p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full hidden md:block 
                              ${isCollapsed ? 'transform rotate-180' : ''}`}
                  aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                {/* Mobile close button */}
                <button
                  onClick={onClose}
                  className="p-2 text-gray-600 hover:text-gray-900 md:hidden"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Navigation Links */}
              <nav className="flex-grow p-4 space-y-6 overflow-y-auto">
                {navItems.map((group) => (
                  <div key={group.title}>
                    {!isCollapsed && (
                      <h2 className="px-3 mb-2 text-xs font-semibold tracking-wider text-gray-500 uppercase">
                        {group.title}
                      </h2>
                    )}
                    <ul className={`${isCollapsed && group.title ? 'mt-2 border-t border-gray-200 pt-2' : ''}`}>
                      {group.links.map((item) => (
                        <SidebarNavItem
                          key={item.href}
                          href={item.href}
                          icon={item.icon}
                          label={item.label}
                          isActive={isActive(item.href)}
                          isCollapsed={isCollapsed}
                          onClick={isOpen && !isCollapsed ? onClose : undefined} // Close mobile sidebar on nav
                        />
                      ))}
                    </ul>
                  </div>
                ))}
              </nav>

              {/* Bottom Navigation (Settings, Logout) */}
              <div className="p-4 border-t border-gray-200">
                <ul>
                  {bottomNavItems.map((item) => (
                     <SidebarNavItem
                        key={item.href}
                        href={item.href}
                        icon={item.icon}
                        label={item.label}
                        isActive={isActive(item.href)}
                        isCollapsed={isCollapsed}
                        onClick={isOpen && !isCollapsed ? onClose : undefined}
                      />
                  ))}
                </ul>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  )
}

export default Sidebar 