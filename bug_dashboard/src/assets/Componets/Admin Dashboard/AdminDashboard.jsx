import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Check, X, Home } from "lucide-react";
import axios from "axios";
import API_BASE_URL from "./config";
import Navbar from "../../../App/Common/Container/Appbar/NavBar";

export default function Admin() {
  const [isDarkMode, setIsDarkMode] = useState(localStorage.getItem("darkMode") === "true");
  const [searchQuery, setSearchQuery] = useState("");
  const [pendingUsers, setPendingUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [actionInProgress, setActionInProgress] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPendingUsers();

    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    localStorage.setItem("darkMode", newMode);
  };

  const fetchPendingUsers = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/auth/pending-users`);
      setPendingUsers(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Error fetching pending users", error);
      setPendingUsers([]);
    } finally {
      setIsLoading(false);
    }
  };

  const approveUser = async (pendingUserId) => {
    setActionInProgress(pendingUserId);
    try {
      await axios.post(`${API_BASE_URL}/auth/approve-user`, { pendingUserId });
      setPendingUsers((prevUsers) => prevUsers.filter((user) => user._id !== pendingUserId));
      showToast("User approved successfully!");
    } catch (error) {
      console.error("Error approving user:", error.response?.data || error.message);
      showToast("Failed to approve user. Please try again.", "error");
    } finally {
      setActionInProgress(null);
    }
  };

  const rejectUser = async (userId) => {
    setActionInProgress(userId);
    try {
      await axios.post(`${API_BASE_URL}/auth/reject-user`, { userId });
      setPendingUsers((prevUsers) => prevUsers.filter((user) => user._id !== userId));
      showToast("User rejected successfully.");
    } catch (error) {
      console.error("Error rejecting user", error);
      showToast("Failed to reject user. Please try again.", "error");
    } finally {
      setActionInProgress(null);
    }
  };

  const showToast = (message, type = "success") => {
    // This is a placeholder for a toast notification system
    // In a real app, you would implement a proper toast notification
    alert(message);
  };

  const filteredUsers = searchQuery
    ? pendingUsers.filter(user => 
        user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.role.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : pendingUsers;

  return (
    <div className={isDarkMode ? "dark" : ""}>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        <Navbar
          title="Admin Dashboard"
          isDarkMode={isDarkMode}
          toggleDarkMode={toggleDarkMode}
          showHomeButton={true}
        />

        <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          {/* Pending Users Section */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 transition-colors duration-300">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white transition-colors duration-300">
                Pending User Approvals
              </h2>
              
              {/* Search Bar */}
              <div className="relative w-64">
                <input
                  type="text"
                  placeholder="Search users..."
                  className="w-full pl-4 pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-colors duration-200"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <button
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                    onClick={() => setSearchQuery("")}
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
            </div>

            {isLoading ? (
              <div className="flex justify-center items-center p-8">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="text-center p-8 text-gray-500 dark:text-gray-400">
                {searchQuery ? "No users match your search criteria" : "No pending users to approve"}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-800">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Username
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Role
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {filteredUsers.map((user) => (
                      <tr 
                        key={user._id} 
                        className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150"
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                          {user.username}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                          {user.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                            user.role === "coach" 
                              ? "bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100" 
                              : "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100"
                          }`}>
                            {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <div className="flex space-x-2">
                            <button 
                              onClick={() => approveUser(user._id)} 
                              disabled={actionInProgress === user._id}
                              className="inline-flex items-center px-3 py-1 bg-green-500 hover:bg-green-600 text-white rounded text-xs font-medium transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {actionInProgress === user._id ? (
                                <svg className="animate-spin h-4 w-4 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                              ) : (
                                <Check size={16} className="mr-1" />
                              )}
                              Approve
                            </button>
                            <button 
                              onClick={() => rejectUser(user._id)} 
                              disabled={actionInProgress === user._id}
                              className="inline-flex items-center px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded text-xs font-medium transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {actionInProgress === user._id ? (
                                <svg className="animate-spin h-4 w-4 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                              ) : (
                                <X size={16} className="mr-1" />
                              )}
                              Reject
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Navigation Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden transition-colors duration-300">
              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2 transition-colors duration-300">
                  Project Dashboard
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4 transition-colors duration-300">
                  View and manage all projects, tasks, and assignments.
                </p>
                <button
                  onClick={() => navigate("/admin-dashboard")}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition-colors duration-150"
                >
                  Go to Dashboard
                </button>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden transition-colors duration-300">
              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2 transition-colors duration-300">
                  Create New Task
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4 transition-colors duration-300">
                  Create a new bug-hunting task and assign it to teams.
                </p>
                <button
                  onClick={() => navigate("/create-task")}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded transition-colors duration-150"
                >
                  Create Task
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
