import React from 'react';
import Link from 'next/link';

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
        className={`flex items-center py-2.5 rounded-lg transition-colors duration-150 ease-in-out
          ${isCollapsed ? 'justify-center px-2' : 'px-3'}
          ${isActive
            ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-sm' 
            : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
          }
        `}
      >
        <div className={`flex-shrink-0 ${isCollapsed ? 'flex justify-center w-full' : ''}`}>
          {icon}
        </div>
        {!isCollapsed && <span className="ml-3 text-sm font-medium">{label}</span>}
      </Link>
    </li>
  );
};

export default SidebarNavItem; 