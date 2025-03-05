import React from 'react';
export default function Navbar() {
    return (<><nav className="bg-white dark:bg-gray-800 shadow-lg p-4 flex justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Project Management Dashboard
        </h1>
        <div className="flex items-center space-x-4">
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700"
          >
            {isDarkMode ? (
              <Sun className="w-5 h-5 text-gray-300" />
            ) : (
              <Moon className="w-5 h-5 text-gray-600" />
            )}
          </button>
          <button
            onClick={logout}
            className="p-2 rounded-lg bg-red-500 text-white hover:bg-red-600"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </nav></>);
}