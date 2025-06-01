import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

interface SidebarNavItemProps {
  href: string;
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  isCollapsed: boolean;
  onClick?: () => void; // For mobile, to close sidebar on nav
}

const SidebarNavItem: React.FC<SidebarNavItemProps> = ({ href, icon, label, isActive, isCollapsed, onClick }) => {
  return (
    <li className="mb-1">
      <Link
        href={href}
        onClick={onClick}
        className={`flex items-center py-2.5 px-3 rounded-lg transition-all duration-200 ease-in-out group relative
          ${isCollapsed ? 'justify-center' : ''}
          ${isActive
            ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 shadow-sm' 
            : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-neutral-900 dark:hover:text-neutral-100'
          }
        `}
      >
        <div className={`flex-shrink-0 relative
          ${isCollapsed ? 'flex justify-center w-full' : ''}
          ${isActive
            ? 'text-blue-600 dark:text-blue-400'
            : 'text-neutral-500 dark:text-neutral-400 group-hover:text-neutral-700 dark:group-hover:text-neutral-300'
          }`}>
          {icon}
          {/* Active indicator for collapsed state */}
          {isCollapsed && isActive && (
            <div className="absolute -right-1 top-1/2 transform -translate-y-1/2 w-1 h-6 bg-blue-600 dark:bg-blue-400 rounded-full" />
          )}
        </div>
        <motion.span 
          className="ml-3 text-sm font-medium overflow-hidden whitespace-nowrap"
          animate={{ 
            opacity: isCollapsed ? 0 : 1,
            width: isCollapsed ? 0 : 'auto'
          }}
          transition={{ 
            duration: 0.3,
            ease: "easeInOut"
          }}
        >
          {label}
        </motion.span>
        
        {/* Tooltip for collapsed state */}
        {isCollapsed && (
          <div className="absolute left-full ml-2 px-2 py-1 bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
            {label}
            <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 w-2 h-2 bg-neutral-900 dark:bg-neutral-100 rotate-45" />
          </div>
        )}
      </Link>
    </li>
  );
};

export default SidebarNavItem; 