import React, { useState, useEffect } from "react";
import { Moon, Sun, Search, Edit, Eye, LogOut, Check, X, HomeIcon } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import API_BASE_URL from "./config";

export default function Admin() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [pendingUsers, setPendingUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPendingUsers();
  }, []);

  const fetchPendingUsers = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/auth/pending-users`);
      console.log("Fetched Users:", response.data); 
      setPendingUsers(Array.isArray(response.data) ? response.data : []);
  
      console.log("Updated State:", pendingUsers); 
    } catch (error) {
      console.error("Error fetching pending users", error);
      setPendingUsers([]); 
    }
  };

  const approveUser = async (pendingUserId) => {
    try {
      await axios.post(`${API_BASE_URL}/auth/approve-user`, { pendingUserId });
      setPendingUsers((prevUsers) => prevUsers.filter((user) => user._id !== pendingUserId));
      console.log("User approved successfully!");
    } catch (error) {
      console.error("Error approving user:", error.response?.data || error.message);
    }
  };

  const rejectUser = async (userId) => {
    try {
      await axios.post(`${API_BASE_URL}/auth/reject-user`, { userId });
      setPendingUsers((prevUsers) => prevUsers.filter((user) => user._id !== userId));
    } catch (error) {
      console.error("Error rejecting user", error);
    }
  };

  const projects = [
    {
      taskId: "TASK-001",
      projectName: "Project Alpha",
      industry: "Technology",
      toolLink: "/tool",
      status: "In Progress",
      lastUpdated: "2024-02-09",
      updatedBy: "John Doe",
    },
    {
      taskId: "TASK-002",
      projectName: "Project Beta",
      industry: "Healthcare",
      toolLink: "/tool",
      status: "Completed",
      lastUpdated: "2024-02-10",
      updatedBy: "Jane Smith",
    },
  ];

  return (
    <div className={`min-h-screen ${isDarkMode ? "dark bg-gray-900" : "bg-gray-50"}`}>
      <nav className="bg-white dark:bg-gray-800 shadow-lg p-4 flex justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Project Management Dashboard</h1>
        <div className="flex items-center space-x-4">
        <button onClick={() => { navigate("/admin-dashboard"); }} className="p-2 rounded-lg bg-yellow-500 text-white hover:bg-red-600">
            <HomeIcon></HomeIcon>
          </button>
          <button onClick={() => setIsDarkMode(!isDarkMode)} className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700">
            {isDarkMode ? <Sun className="w-5 h-5 text-gray-300" /> : <Moon className="w-5 h-5 text-gray-600" />}
          </button>
          <button onClick={() => { localStorage.removeItem("userRole"); navigate("/login"); }} className="p-2 rounded-lg bg-red-500 text-white hover:bg-red-600">
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto py-6 px-4 space-y-6">
        {/* Pending Users Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Pending User Approvals</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium dark:text-gray-400">Username</th>
                  <th className="px-6 py-3 text-left text-xs font-medium dark:text-gray-400">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium dark:text-gray-400">Role</th>
                  <th className="px-6 py-3 text-left text-xs font-medium dark:text-gray-400">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800">
                {pendingUsers.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="text-center py-4 text-gray-500 dark:text-gray-400">No pending users</td>
                  </tr>
                ) : (
                  pendingUsers.map((user) => (
                    <tr key={user._id} className="border-b dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 transition">
                      <td className="px-6 py-4 text-sm">{user.username}</td>
                      <td className="px-6 py-4 text-sm">{user.email}</td>
                      <td className="px-6 py-4 text-sm">{user.role}</td>
                      <td className="px-6 py-4 text-sm flex space-x-2">
                        <button onClick={() => approveUser(user._id)} className="px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600 transition">
                          <Check className="h-4 w-4 inline-block" /> Approve
                        </button>
                        <button onClick={() => rejectUser(user._id)} className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600 transition">
                          <X className="h-4 w-4 inline-block" /> Reject
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Projects Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search by Project Name, Task ID, or keywords..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg dark:bg-gray-700 dark:text-white"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <select className="border p-2 rounded dark:bg-gray-700 dark:text-white">
              <option>Select Industry</option>
            </select>
            <select className="border p-2 rounded dark:bg-gray-700 dark:text-white">
              <option>Status</option>
            </select>
            <select className="border p-2 rounded dark:bg-gray-700 dark:text-white">
              <option>Team Member</option>
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <input type="date" className="border p-2 rounded dark:bg-gray-700 dark:text-white" />
            <input type="date" className="border p-2 rounded dark:bg-gray-700 dark:text-white" />
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  {["Task ID", "Project Name", "Industry", "Tool Link", "Status", "Last Updated", "Updated By", "Actions"].map((heading) => (
                    <th key={heading} className="px-6 py-3 text-left text-xs font-medium dark:text-gray-400">{heading}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800">
                {projects.map((project) => (
                  <tr key={project.taskId} className="border-b dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 transition">
                    <td className="px-6 py-4 text-sm">
                      <Link to={`/task-details/${project.taskId}`} className="text-blue-500 hover:underline">
                        {project.taskId}
                      </Link>
                    </td>
                    <td className="px-6 py-4 text-sm">{project.projectName}</td>
                    <td className="px-6 py-4 text-sm">{project.industry}</td>
                    <td className="px-6 py-4 text-sm">
                      <Link to={project.toolLink} className="text-blue-500 hover:underline">View Link</Link>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                        project.status === "Completed" 
                          ? "bg-green-200 text-green-800" 
                          : "bg-yellow-200 text-yellow-800"
                      }`}>
                        {project.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">{project.lastUpdated}</td>
                    <td className="px-6 py-4 text-sm">{project.updatedBy}</td>
                    <td className="px-6 py-4 text-sm flex space-x-2">
                      <button className="px-3 py-1 bg-gray-300 rounded text-sm hover:bg-gray-400 transition">
                        <Edit className="h-4 w-4 inline-block" /> Edit
                      </button>
                      <button className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 transition">
                        <Eye className="h-4 w-4 inline-block" /> Review
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
