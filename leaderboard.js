import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Trophy, Medal, Target, Calendar, Shield } from "lucide-react";
import axios from "axios";
import API_BASE_URL from "../Admin Dashboard/config";
import Navbar from "../../../App/Common/Container/Appbar/NavBar";

const Leaderboard = ({ role }) => {
  const navigate = useNavigate();
  const [timeRange, setTimeRange] = useState("weekly");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(localStorage.getItem("darkMode") === "true");
  const [error, setError] = useState(null);

  useEffect(() => {
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

  useEffect(() => {
    fetchLeaderboard();
  }, [timeRange, role]);

  const fetchLeaderboard = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Authentication required");
      }

      const response = await axios.get(`${API_BASE_URL}/leaderboard`, {
        params: { timeRange, role },
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      if (!Array.isArray(response.data)) {
        throw new Error("Invalid response format");
      }

      const formattedData = response.data.map((user, index) => ({
        id: index + 1,
        name: user.userName || "Unknown",
        tasksCompleted: user.tasksCompleted || 0,
        role: user.role || role
      }));
      
      setUsers(formattedData);
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
      setError("Failed to load leaderboard data. Please try again later.");
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const getLeaderboardTitle = () => {
    if (role === "hunter") return "Bug Hunters Leaderboard";
    if (role === "coach") return "Team Coaches Leaderboard";
    return "Astraeus Leaderboard";
  };

  const getRoleIcon = (userRole) => {
    if (userRole === "hunter") return <Target className="h-5 w-5 text-green-400 mr-2" />;
    if (userRole === "coach") return <Shield className="h-5 w-5 text-blue-400 mr-2" />;
    return null;
  };

  return (
    <div className={isDarkMode ? "dark" : ""}>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        <Navbar
          title={getLeaderboardTitle()}
          isDarkMode={isDarkMode}
          toggleDarkMode={toggleDarkMode}
        />

        <main className="max-w-5xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex items-center justify-center mb-8">
            <Trophy className="h-12 w-12 text-yellow-500" />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white ml-3">{getLeaderboardTitle()}</h1>
          </div>

          {/* Time Range Selector */}
          <div className="flex justify-center space-x-4 mb-8">
            {["weekly", "monthly", "quarterly", "all-time"].map((range) => (
              <button
                key={range}
                className={`px-4 py-2 rounded-md flex items-center text-sm font-medium transition-colors duration-150 ${
                  timeRange === range 
                    ? "bg-blue-600 text-white shadow-md" 
                    : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
                onClick={() => setTimeRange(range)}
              >
                <Calendar className="h-4 w-4 mr-1" />
                {range.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
              </button>
            ))}
          </div>

          {/* Leaderboard Table */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition-colors duration-300">
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
              </div>
            ) : error ? (
              <div className="text-center p-8 text-red-500 dark:text-red-400">
                <p>{error}</p>
                <button 
                  onClick={fetchLeaderboard}
                  className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors duration-150"
                >
                  Try Again
                </button>
              </div>
            ) : users.length === 0 ? (
              <div className="text-center p-8 text-gray-500 dark:text-gray-400">
                <p>No data available for this time period.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-900">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Rank</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Member</th>
                      {!role && (
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Role</th>
                      )}
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Tasks Completed</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {users.map((user, index) => (
                      <tr 
                        key={user.id} 
                        className={`${index < 3 ? 'bg-opacity-50 dark:bg-opacity-50' : ''} 
                        ${index === 0 ? 'bg-yellow-50 dark:bg-yellow-900' : index === 1 ? 'bg-gray-50 dark:bg-gray-900' : index === 2 ? 'bg-orange-50 dark:bg-orange-900' : ''}
                        hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150`}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            {index === 0 ? (
                              <Trophy className="h-6 w-6 text-yellow-500" />
                            ) : index === 1 ? (
                              <Medal className="h-6 w-6 text-gray-400" />
                            ) : index === 2 ? (
                              <Medal className="h-6 w-6 text-orange-500" />
                            ) : (
                              <span className="text-gray-700 dark:text-gray-300 font-medium w-6 text-center">{index + 1}</span>
                            )}
                            <span className="ml-2 text-gray-700 dark:text-gray-300">
                              {index < 3 ? `#${index + 1}` : ''}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                          {user.name}
                        </td>
                        {!role && (
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                            <div className="flex items-center">
                              {getRoleIcon(user.role)}
                              {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                            </div>
                          </td>
                        )}
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-700 dark:text-gray-300">
                          <span className="px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                            {user.tasksCompleted}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Leaderboard;
