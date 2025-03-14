import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Save, X } from "lucide-react";
import axios from "axios";
import API_BASE_URL from "../Admin Dashboard/config";
import Navbar from "../../../App/Common/Container/Appbar/NavBar";

export default function CreateTask() {
  const navigate = useNavigate();
  const [isDarkMode, setIsDarkMode] = useState(localStorage.getItem("darkMode") === "true");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    taskId: `BH-${Math.floor(1000 + Math.random() * 9000)}`, // Generate a random task ID
    projectName: "",
    industry: "",
    batch: "",
    toolLink: "",
    status: "Unclaimed"
  });
  const [errors, setErrors] = useState({});

  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    localStorage.setItem("darkMode", newMode);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error for this field if it exists
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.projectName.trim()) {
      newErrors.projectName = "Project name is required";
    }
    
    if (!formData.industry.trim()) {
      newErrors.industry = "Industry is required";
    }
    
    if (!formData.toolLink.trim()) {
      newErrors.toolLink = "Tool link is required";
    } else if (!/^(http|https):\/\//.test(formData.toolLink)) {
      newErrors.toolLink = "Tool link must be a valid URL starting with http:// or https://";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const token = localStorage.getItem("token");
      
      const response = await axios.post(`${API_BASE_URL}/task/add`, {
        ...formData,
        updatedBy: localStorage.getItem("userName") || "Admin"
      }, {
        headers: {
          Authorization: token
        }
      });
      
      setIsSubmitting(false);
      
      if (response.status === 201) {
        alert("Task created successfully!");
        navigate("/admin-dashboard");
      }
    } catch (error) {
      setIsSubmitting(false);
      alert("Error creating task: " + (error.response?.data?.message || error.message));
      console.error("Error creating task:", error);
    }
  };

  return (
    <div className={isDarkMode ? "dark" : ""}>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        <Navbar
          title="Create New Task"
          isDarkMode={isDarkMode}
          toggleDarkMode={toggleDarkMode}
          showHomeButton={true}
        />

        <main className="max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 transition-colors duration-300">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 transition-colors duration-300">
                    Task ID
                  </label>
                  <input
                    type="text"
                    name="taskId"
                    value={formData.taskId}
                    readOnly
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-colors duration-200 bg-gray-100 dark:bg-gray-600 cursor-not-allowed"
                  />
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    Task ID is auto-generated
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 transition-colors duration-300">
                    Project Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="projectName"
                    value={formData.projectName}
                    onChange={handleInputChange}
                    placeholder="Enter project name"
                    className={`w-full p-2 border ${
                      errors.projectName ? "border-red-500" : "border-gray-300 dark:border-gray-600"
                    } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-colors duration-200`}
                  />
                  {errors.projectName && (
                    <p className="mt-1 text-xs text-red-500">{errors.projectName}</p>
                  )}
                </div>
              </div>
              
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 transition-colors duration-300">
                    Industry <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="industry"
                    value={formData.industry}
                    onChange={handleInputChange}
                    placeholder="E.g. Technology, Healthcare, Finance"
                    className={`w-full p-2 border ${
                      errors.industry ? "border-red-500" : "border-gray-300 dark:border-gray-600"
                    } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-colors duration-200`}
                  />
                  {errors.industry && (
                    <p className="mt-1 text-xs text-red-500">{errors.industry}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 transition-colors duration-300">
                    Batch (Optional)
                  </label>
                  <input
                    type="text"
                    name="batch"
                    value={formData.batch}
                    onChange={handleInputChange}
                    placeholder="Enter batch identifier"
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-colors duration-200"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 transition-colors duration-300">
                  Tool Link <span className="text-red-500">*</span>
                </label>
                <input
                  type="url"
                  name="toolLink"
                  value={formData.toolLink}
                  onChange={handleInputChange}
                  placeholder="https://example.com/target-app"
                  className={`w-full p-2 border ${
                    errors.toolLink ? "border-red-500" : "border-gray-300 dark:border-gray-600"
                  } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-colors duration-200`}
                />
                {errors.toolLink && (
                  <p className="mt-1 text-xs text-red-500">{errors.toolLink}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 transition-colors duration-300">
                  Initial Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-colors duration-200"
                >
                  <option value="Unclaimed">Unclaimed</option>
                  <option value="In Progress">In Progress</option>
                </select>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  New tasks typically start as "Unclaimed"
                </p>
              </div>
              
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => navigate("/admin-dashboard")}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-150"
                >
                  <X size={16} className="mr-2" />
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-150 ${
                    isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Creating...
                    </>
                  ) : (
                    <>
                      <Save size={16} className="mr-2" />
                      Create Task
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}
