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
        { href: '/profile', label: 'Resume', icon: <UserCircle className="w-5 h-5" /> },
      ],
    },
    {
      title: 'COMMUNITY',
      links: [
        { href: '/feed', label: 'Feed', icon: <MessageSquare className="w-5 h-5" /> },
      ],
    },
    {
      title: 'ACCOUNT',
      links: [
        { href: '/settings', label: 'Settings', icon: <Settings className="w-5 h-5" /> },
        { href: '/logout', label: 'Logout', icon: <LogOut className="w-5 h-5" /> },
      ],
    },
  ];
  
  return (
    <>
      {/* Mobile Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            className="fixed inset-0 bg-black/50 md:hidden z-40"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
          />
        )}
      </AnimatePresence>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <motion.aside 
            className="flex flex-col flex-shrink-0 overflow-y-auto w-64 bg-white dark:bg-neutral-900 border-r border-neutral-200 dark:border-neutral-800 z-40 h-full fixed top-0 inset-y-auto left-0 md:hidden shadow-lg"
            initial={{ x: -320 }}
            animate={{ x: 0 }}
            exit={{ x: -320 }}
            transition={{ 
              type: "tween", 
              duration: 0.3,
              ease: "easeInOut"
            }}
          >
            <div className="flex flex-col h-full">
              {/* Mobile Header */}
              <div className="flex items-center justify-between p-4 border-b border-neutral-200 dark:border-neutral-800">
                <div className="text-primary text-xl font-bold">atlas.</div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                  aria-label="Close sidebar"
                >
                  <X className="w-5 h-5 text-neutral-600 dark:text-neutral-400" />
                </button>
              </div>

              {/* Navigation Links */}
              <nav className="flex-grow p-4 space-y-6 overflow-y-auto">
                {navItems.map((group) => (
                  <div key={group.title}>
                    <h2 className="px-3 mb-3 text-xs font-semibold tracking-wider text-neutral-500 dark:text-neutral-400 uppercase">
                      {group.title}
                    </h2>
                    <ul className="space-y-1">
                      {group.links.map((item) => (
                        <SidebarNavItem
                          key={item.href}
                          href={item.href}
                          icon={item.icon}
                          label={item.label}
                          isActive={isActive(item.href)}
                          isCollapsed={false}
                          onClick={onClose} // Close mobile sidebar on nav
                        />
                      ))}
                    </ul>
                  </div>
                ))}
              </nav>

              {/* Mobile Footer */}
              <div className="p-4 border-t border-neutral-200 dark:border-neutral-800">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-neutral-50 dark:bg-neutral-800">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-medium">A</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100 truncate">
                      Atlas User
                    </p>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 truncate">
                      user@example.com
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar - Always present, just changes width */}
      <motion.aside 
        className="hidden md:flex flex-col flex-shrink-0 overflow-y-auto bg-white dark:bg-neutral-900 border-r border-neutral-200 dark:border-neutral-800 z-40 h-full relative md:h-screen md:max-h-screen shadow-sm"
        animate={{ 
          width: isCollapsed ? 80 : 256,
        }}
        transition={{ 
          type: "tween", 
          duration: 0.3,
          ease: "easeInOut"
        }}
      >
        <div className={`flex flex-col h-full ${isCollapsed ? 'items-center' : ''}`}>
          {/* Desktop Header */}
          <div className="flex items-center justify-between p-4 border-b border-neutral-200 dark:border-neutral-800 h-16">
            <motion.div 
              className="text-primary text-xl font-bold overflow-hidden whitespace-nowrap"
              animate={{ 
                opacity: isCollapsed ? 0 : 1,
                width: isCollapsed ? 0 : 'auto'
              }}
              transition={{ 
                duration: 0.3,
                ease: "easeInOut"
              }}
            >
              atlas.
            </motion.div>
            {isCollapsed && (
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white text-sm font-bold">A</span>
              </div>
            )}
          </div>

          {/* Navigation Links */}
          <nav className="flex-grow p-4 space-y-6 overflow-y-auto">
            {navItems.map((group, groupIndex) => (
              <div key={group.title}>
                <motion.h2 
                  className="px-3 mb-3 text-xs font-semibold tracking-wider text-neutral-500 dark:text-neutral-400 uppercase overflow-hidden whitespace-nowrap"
                  animate={{ 
                    opacity: isCollapsed ? 0 : 1,
                    height: isCollapsed ? 0 : 'auto',
                    marginBottom: isCollapsed ? 0 : 12
                  }}
                  transition={{ 
                    duration: 0.3,
                    ease: "easeInOut"
                  }}
                >
                  {group.title}
                </motion.h2>
                <ul className={`space-y-1 ${isCollapsed && groupIndex > 0 ? 'mt-4 pt-4 border-t border-neutral-200 dark:border-neutral-800' : ''}`}>
                  {group.links.map((item) => (
                    <SidebarNavItem
                      key={item.href}
                      href={item.href}
                      icon={item.icon}
                      label={item.label}
                      isActive={isActive(item.href)}
                      isCollapsed={isCollapsed}
                    />
                  ))}
                </ul>
              </div>
            ))}
          </nav>

          {/* Desktop Footer */}
          <div className="p-4 border-t border-neutral-200 dark:border-neutral-800">
            <motion.div 
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
              animate={{
                justifyContent: isCollapsed ? 'center' : 'flex-start'
              }}
              transition={{ 
                duration: 0.3,
                ease: "easeInOut"
              }}
            >
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white text-sm font-medium">A</span>
              </div>
              <motion.div 
                className="flex-1 min-w-0 overflow-hidden"
                animate={{ 
                  opacity: isCollapsed ? 0 : 1,
                  width: isCollapsed ? 0 : 'auto'
                }}
                transition={{ 
                  duration: 0.3,
                  ease: "easeInOut"
                }}
              >
                <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100 truncate">
                  Atlas User
                </p>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 truncate">
                  user@example.com
                </p>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </motion.aside>
    </>
  )
}

export default Sidebar 