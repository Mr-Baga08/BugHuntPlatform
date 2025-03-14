import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ExternalLink, Play, RotateCw, Upload, Save, Star, StarHalf } from "lucide-react";
import Navbar from "../../App/Common/Container/Appbar/NavBar";

const Tool = () => {
  const { taskId } = useParams();
  const navigate = useNavigate();
  const [isDarkMode, setIsDarkMode] = useState(localStorage.getItem("darkMode") === "true");
  const [activeTab, setActiveTab] = useState("testing");
  const [testScript, setTestScript] = useState("");
  const [scriptName, setScriptName] = useState("");
  const [testOutput, setTestOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [observedBehavior, setObservedBehavior] = useState("");
  const [vulnerabilities, setVulnerabilities] = useState("");
  const [finalReport, setFinalReport] = useState("");
  const [difficulty, setDifficulty] = useState("Medium");
  const [scriptFile, setScriptFile] = useState(null);
  const [supportFile, setSupportFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [task, setTask] = useState({
    taskId: taskId || "BH-001",
    projectName: "Project Alpha",
    toolLink: "http://example.com/target-app",
    status: "In Progress"
  });

  useEffect(() => {
    // Fetch task details from API
    // For now using mock data
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [taskId, isDarkMode]);

  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    localStorage.setItem("darkMode", newMode);
  };

  const handleRunScript = () => {
    setIsRunning(true);
    setTestOutput("Running script...");
    
    // Simulate script execution
    setTimeout(() => {
      setTestOutput(`[INFO] Executing ${scriptName || "Unnamed script"}...\n\n[RESULT] Script executed successfully. Found potential XSS vulnerability in the input field. The application accepts and renders unsanitized input: <script>alert('XSS')</script>\n\n[WARNING] This vulnerability could allow attackers to execute arbitrary JavaScript in users' browsers.`);
      setIsRunning(false);
    }, 2000);
  };

  const handleScriptFileChange = (e) => {
    setScriptFile(e.target.files[0]);
  };

  const handleSupportFileChange = (e) => {
    setSupportFile(e.target.files[0]);
  };

  const handleSubmitReview = () => {
    if (!observedBehavior) {
      alert("Please provide observed behavior before submitting");
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      alert("Review submitted successfully!");
      setObservedBehavior("");
      setVulnerabilities("");
      setScriptFile(null);
      setSupportFile(null);
    }, 1500);
  };

  const handleSubmitReport = () => {
    if (!finalReport) {
      alert("Please provide a final report before submitting");
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      alert("Final report submitted successfully!");
      setFinalReport("");
    }, 1500);
  };

  return (
    <div className={isDarkMode ? "dark" : ""}>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        <Navbar
          title={`Tool - ${task.taskId}`}
          isDarkMode={isDarkMode}
          toggleDarkMode={toggleDarkMode}
        />

        {/* Task Header */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-lg shadow-md text-white p-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
              <div>
                <h2 className="text-xl font-semibold mb-2">{task.projectName}</h2>
                <p className="text-blue-100">Task ID: {task.taskId}</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 mt-4 md:mt-0">
                <a 
                  href={task.toolLink} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2 bg-white/20 hover:bg-white/30 rounded-md text-sm font-medium transition duration-150"
                >
                  <ExternalLink size={16} className="mr-2" />
                  Open Target
                </a>
                <span className="inline-flex items-center px-4 py-2 bg-white/10 rounded-md text-sm font-medium">
                  Status: {task.status}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
          <div className="flex border-b border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setActiveTab("testing")}
              className={`py-3 px-6 font-medium text-sm ${
                activeTab === "testing"
                  ? "border-b-2 border-blue-500 text-blue-600 dark:text-blue-400"
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              } transition-colors duration-150`}
            >
              Interactive Testing
            </button>
            <button
              onClick={() => setActiveTab("review")}
              className={`py-3 px-6 font-medium text-sm ${
                activeTab === "review"
                  ? "border-b-2 border-blue-500 text-blue-600 dark:text-blue-400"
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              } transition-colors duration-150`}
            >
              Review & Feedback
            </button>
            <button
              onClick={() => setActiveTab("report")}
              className={`py-3 px-6 font-medium text-sm ${
                activeTab === "report"
                  ? "border-b-2 border-blue-500 text-blue-600 dark:text-blue-400"
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              } transition-colors duration-150`}
            >
              Final Report
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
          {/* Interactive Testing Tab */}
          {activeTab === "testing" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 transition-colors duration-300">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 transition-colors duration-300">
                  Script Configuration
                </h3>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 transition-colors duration-300">
                    Script Name
                  </label>
                  <input
                    type="text"
                    value={scriptName}
                    onChange={(e) => setScriptName(e.target.value)}
                    placeholder="E.g. XSS Test"
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-colors duration-200"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 transition-colors duration-300">
                    Script Code
                  </label>
                  <textarea
                    value={testScript}
                    onChange={(e) => setTestScript(e.target.value)}
                    placeholder="Paste your script here..."
                    rows={8}
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white font-mono text-sm transition-colors duration-200"
                  />
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between gap-3">
                  <div>
                    <select
                      className="w-full sm:w-auto p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-colors duration-200"
                    >
                      <option>Load Standard Scripts</option>
                      <option>XSS Test Script</option>
                      <option>SQL Injection Test</option>
                      <option>CSRF Vulnerability Test</option>
                    </select>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <button
                      onClick={handleRunScript}
                      disabled={isRunning || !testScript}
                      className={`inline-flex items-center justify-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium transition duration-150 ${
                        isRunning || !testScript ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                    >
                      {isRunning ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Running...
                        </>
                      ) : (
                        <>
                          <Play size={16} className="mr-2" />
                          Execute Script
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => setTestScript("")}
                      className="inline-flex items-center justify-center px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-md text-sm font-medium transition duration-150"
                    >
                      <RotateCw size={16} className="mr-2" />
                      Reset
                    </button>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 transition-colors duration-300">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 transition-colors duration-300">
                  Script Output
                </h3>
                <div className="h-64 bg-gray-100 dark:bg-gray-900 rounded-lg p-4 font-mono text-sm overflow-auto transition-colors duration-200">
                  {testOutput ? (
                    <pre className="whitespace-pre-wrap text-gray-800 dark:text-gray-300">{testOutput}</pre>
                  ) : (
                    <div className="text-gray-500 dark:text-gray-400 h-full flex items-center justify-center">
                      Output will appear here after executing the script
                    </div>
                  )}
                </div>
                <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
                  <p className="mb-2">Available Script Templates:</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>XSS Testing Scripts</li>
                    <li>SQL Injection Tests</li>
                    <li>CSRF Vulnerability Tests</li>
                    <li>Authentication Bypass Attempts</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Review & Feedback Tab */}
          {activeTab === "review" && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 transition-colors duration-300">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 transition-colors duration-300">
                Submit Review & Feedback
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 transition-colors duration-300">
                      Observed Behavior <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      value={observedBehavior}
                      onChange={(e) => setObservedBehavior(e.target.value)}
                      placeholder="Describe what you observed during testing..."
                      rows={4}
                      required
                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-colors duration-200"
                    />
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 transition-colors duration-300">
                      Potential Vulnerabilities
                    </label>
                    <textarea
                      value={vulnerabilities}
                      onChange={(e) => setVulnerabilities(e.target.value)}
                      placeholder="List any security vulnerabilities identified..."
                      rows={4}
                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-colors duration-200"
                    />
                  </div>
                </div>
                
                <div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 transition-colors duration-300">
                      Script File <span className="text-red-500">*</span>
                    </label>
                    <div className="flex items-center justify-center w-full">
                      <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:bg-gray-700 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <Upload className="w-8 h-8 mb-2 text-gray-500 dark:text-gray-400" />
                          <p className="mb-1 text-sm text-gray-500 dark:text-gray-400">
                            {scriptFile ? scriptFile.name : "Click to upload script file"}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            JavaScript, Python, Shell script (MAX. 10MB)
                          </p>
                        </div>
                        <input 
                          type="file" 
                          className="hidden" 
                          onChange={handleScriptFileChange}
                          accept=".js,.py,.sh,.txt"
                        />
                      </label>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 transition-colors duration-300">
                      Supporting Evidence (optional)
                    </label>
                    <div className="flex items-center justify-center w-full">
                      <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:bg-gray-700 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <Upload className="w-8 h-8 mb-2 text-gray-500 dark:text-gray-400" />
                          <p className="mb-1 text-sm text-gray-500 dark:text-gray-400">
                            {supportFile ? supportFile.name : "Click to upload supporting files"}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            Screenshots, logs, data (MAX. 20MB)
                          </p>
                        </div>
                        <input 
                          type="file" 
                          className="hidden" 
                          onChange={handleSupportFileChange}
                          accept=".jpg,.jpeg,.png,.pdf,.txt,.log"
                        />
                      </label>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 flex justify-end">
                <button
                  onClick={handleSubmitReview}
                  disabled={isSubmitting || !observedBehavior || !scriptFile}
                  className={`inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium transition duration-150 ${
                    isSubmitting || !observedBehavior || !scriptFile ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Save size={16} className="mr-2" />
                      Submit Review
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Final Report Tab */}
          {activeTab === "report" && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 transition-colors duration-300">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 transition-colors duration-300">
                Final Report
              </h3>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 transition-colors duration-300">
                  Comprehensive Report <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={finalReport}
                  onChange={(e) => setFinalReport(e.target.value)}
                  placeholder="Provide a detailed report of your findings, including methodology, discovered vulnerabilities, potential impact, and recommended fixes..."
                  rows={10}
                  required
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-colors duration-200"
                />
              </div>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-300">
                  Difficulty Rating <span className="text-red-500">*</span>
                </label>
                <div className="flex flex-wrap gap-4">
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="difficulty"
                      value="Easy"
                      checked={difficulty === "Easy"}
                      onChange={() => setDifficulty("Easy")}
                      className="form-radio h-4 w-4 text-blue-600"
                    />
                    <span className="ml-2 flex items-center text-gray-700 dark:text-gray-300">
                      <Star size={16} className="text-green-500 mr-1" />
                      Easy
                    </span>
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="difficulty"
                      value="Medium"
                      checked={difficulty === "Medium"}
                      onChange={() => setDifficulty("Medium")}
                      className="form-radio h-4 w-4 text-blue-600"
                    />
                    <span className="ml-2 flex items-center text-gray-700 dark:text-gray-300">
                      <Star size={16} className="text-yellow-500 mr-1" />
                      <Star size={16} className="text-yellow-500 mr-1" />
                      Medium
                    </span>
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="difficulty"
                      value="Hard"
                      checked={difficulty === "Hard"}
                      onChange={() => setDifficulty("Hard")}
                      className="form-radio h-4 w-4 text-blue-600"
                    />
                    <span className="ml-2 flex items-center text-gray-700 dark:text-gray-300">
                      <Star size={16} className="text-red-500 mr-1" />
                      <Star size={16} className="text-red-500 mr-1" />
                      <Star size={16} className="text-red-500 mr-1" />
                      Hard
                    </span>
                  </label>
                </div>
              </div>
              
              <div className="mt-6 flex justify-end">
                <button
                  onClick={handleSubmitReport}
                  disabled={isSubmitting || !finalReport}
                  className={`inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium transition duration-150 ${
                    isSubmitting || !finalReport ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Save size={16} className="mr-2" />
                      Submit Final Report
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Tool;
