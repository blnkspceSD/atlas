"use client";

import { SessionNavBar } from "@/components/ui/sidebar"

export function SidebarDemo() {
  return (
    <div className="flex h-screen w-screen flex-row">
      <SessionNavBar />
      <main className="flex h-screen grow flex-col overflow-auto pl-12 md:pl-60">
        <div className="p-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Welcome to your Dashboard
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
            This is the main content area. The sidebar will collapse and expand on hover.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-2">Feature 1</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Some description of your first feature goes here.
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-2">Feature 2</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Some description of your second feature goes here.
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-2">Feature 3</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Some description of your third feature goes here.
              </p>
            </div>
          </div>
          
          <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg">
            <h3 className="text-xl font-semibold text-blue-900 dark:text-blue-100 mb-2">
              How to use the sidebar
            </h3>
            <ul className="text-blue-800 dark:text-blue-200 space-y-1">
              <li>• Hover over the sidebar to expand it</li>
              <li>• Move your mouse away to collapse it</li>
              <li>• Click on any navigation item to navigate</li>
              <li>• Use the dropdown menus for additional options</li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
} 