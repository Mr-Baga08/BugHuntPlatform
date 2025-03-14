import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Sun, Moon, LogOut, Home } from 'lucide-react';

const Navbar = ({ title, isDarkMode, toggleDarkMode, showHomeButton = false }) => {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("userRole");
    localStorage.removeItem("userName");
    localStorage.removeItem("token");
    navigate("/signin");
  };

  return (
    <nav className="bg-white shadow-sm dark:bg-gray-800 px-6 py-4 transition-colors duration-300">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white transition-colors duration-300">
          {title}
        </h1>
        
        <div className="flex items-center space-x-3">
          {showHomeButton && (
            <button 
              onClick={() => navigate("/admin-dashboard")} 
              className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 transition-colors duration-200"
              aria-label="Home"
            >
              <Home size={18} />
            </button>
          )}
          
          <button 
            onClick={toggleDarkMode} 
            className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 transition-colors duration-200"
            aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
          >
            {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          
          <button 
            onClick={logout} 
            className="p-2 rounded-full bg-red-500 hover:bg-red-600 text-white transition-colors duration-200"
            aria-label="Logout"
          >
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
