import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Upload, FileSpreadsheet, AlertCircle, Check, X, ArrowLeft } from "lucide-react";
import axios from "axios";
import * as XLSX from 'xlsx';
import API_BASE_URL from "./config";
import Navbar from "../../../App/Common/Container/Appbar/NavBar";

const TaskExcelUploader = () => {
  const navigate = useNavigate();
  const [isDarkMode, setIsDarkMode] = useState(localStorage.getItem("darkMode") === "true");
  const [file, setFile] = useState(null);
  const [previewData, setPreviewData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [validationErrors, setValidationErrors] = useState([]);
  const fileInputRef = useRef(null);

  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    localStorage.setItem("darkMode", newMode);
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;
    
    // Validate file type
    const fileExtension = selectedFile.name.split('.').pop().toLowerCase();
    if (!['xlsx', 'xls', 'csv'].includes(fileExtension)) {
      setUploadStatus({
        type: "error",
        message: "Please upload a valid Excel or CSV file"
      });
      return;
    }
    
    setFile(selectedFile);
    setUploadStatus(null);
    readExcelFile(selectedFile);
  };

  const readExcelFile = (file) => {
    setIsLoading(true);
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = e.target.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const parsedData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        
        // Validate the structure
        if (parsedData.length < 2) {
          setUploadStatus({
            type: "error",
            message: "The Excel file is empty or has no data rows"
          });
          setIsLoading(false);
          return;
        }
        
        // Assuming the first row contains headers
        const headers = parsedData[0];
        const requiredHeaders = ['projectName', 'industry', 'toolLink'];
        
        // Check if all required columns exist
        const missingHeaders = requiredHeaders.filter(header => 
          !headers.map(h => h.toLowerCase()).includes(header.toLowerCase())
        );
        
        if (missingHeaders.length > 0) {
          setUploadStatus({
            type: "error",
            message: `Missing required columns: ${missingHeaders.join(', ')}`
          });
          setIsLoading(false);
          return;
        }
        
        // Convert the headers to the correct format
        const formattedHeaders = headers.map(header => {
          const lowerHeader = String(header).toLowerCase();
          if (requiredHeaders.includes(lowerHeader)) {
            return lowerHeader;
          }
          return String(header);
        });
        
        // Prepare data for preview (skip header, take first 5 rows)
        const dataRows = parsedData.slice(1, 6).map(row => {
          const rowData = {};
          row.forEach((cell, index) => {
            if (index < formattedHeaders.length) {
              rowData[formattedHeaders[index]] = cell;
            }
          });
          return rowData;
        });
        
        setPreviewData(dataRows);
        validateData(parsedData.slice(1), formattedHeaders);
        
      } catch (error) {
        console.error("Error parsing Excel file:", error);
        setUploadStatus({
          type: "error",
          message: "Failed to parse the Excel file. Please check the file format."
        });
      }
      
      setIsLoading(false);
    };
    
    reader.onerror = () => {
      setUploadStatus({
        type: "error",
        message: "Failed to read the file"
      });
      setIsLoading(false);
    };
    
    reader.readAsBinaryString(file);
  };

  const validateData = (rows, headers) => {
    const errors = [];
    const projectNameIndex = headers.indexOf('projectName');
    const industryIndex = headers.indexOf('industry');
    const toolLinkIndex = headers.indexOf('toolLink');
    
    rows.forEach((row, rowIndex) => {
      // Check for empty required fields
      if (!row[projectNameIndex]) {
        errors.push(`Row ${rowIndex + 2}: Project Name is required`);
      }
      
      if (!row[industryIndex]) {
        errors.push(`Row ${rowIndex + 2}: Industry is required`);
      }
      
      if (!row[toolLinkIndex]) {
        errors.push(`Row ${rowIndex + 2}: Tool Link is required`);
      } else if (row[toolLinkIndex] && !isValidUrl(row[toolLinkIndex])) {
        errors.push(`Row ${rowIndex + 2}: Tool Link must be a valid URL (starting with http:// or https://)`);
      }
    });
    
    setValidationErrors(errors);
  };

  const isValidUrl = (url) => {
    try {
      return /^(http|https):\/\//.test(url);
    } catch (e) {
      return false;
    }
  };

  const handleUpload = async () => {
    if (!file || validationErrors.length > 0) return;
    
    setIsLoading(true);
    setUploadProgress(0);
    
    const formData = new FormData();
    formData.append('file', file);
    formData.append('updatedBy', localStorage.getItem("userName") || "Admin");
    
    try {
      const token = localStorage.getItem("token");
      
      const response = await axios.post(`${API_BASE_URL}/task/bulk-upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress(percentCompleted);
        }
      });
      
      setUploadStatus({
        type: "success",
        message: `Successfully uploaded ${response.data.tasksCreated} tasks`,
        details: response.data.details
      });
      
      // Reset form
      setFile(null);
      setPreviewData([]);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      
    } catch (error) {
      console.error("Error uploading tasks:", error);
      setUploadStatus({
        type: "error",
        message: error.response?.data?.message || "Failed to upload tasks"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/admin-dashboard");
  };

  return (
    <div className={isDarkMode ? "dark" : ""}>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        <Navbar
          title="Bulk Task Upload"
          isDarkMode={isDarkMode}
          toggleDarkMode={toggleDarkMode}
          showHomeButton={true}
        />

        <main className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 transition-colors duration-300">
            {/* Header */}
            <div className="flex items-center mb-6">
              <FileSpreadsheet className="h-8 w-8 text-green-500 mr-3" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Excel Task Upload
              </h2>
            </div>

            {/* Instructions */}
            <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900 rounded-lg">
              <h3 className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-2">
                Instructions:
              </h3>
              <ul className="list-disc list-inside text-sm text-blue-700 dark:text-blue-300 space-y-1">
                <li>Upload an Excel file (.xlsx, .xls) or CSV file</li>
                <li>File must include columns: projectName, industry, toolLink</li>
                <li>Optional columns: batch, status</li>
                <li>Task IDs will be automatically generated if not provided</li>
                <li>Tool links must start with http:// or https://</li>
              </ul>
            </div>

            {/* Template Download */}
            <div className="flex justify-end mb-6">
              <button
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                onClick={() => {
                  // In a real app, this would be a proper download link
                  alert("In a production app, this would download a template Excel file");
                }}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Download Template
              </button>
            </div>

            {/* File Upload */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Upload Tasks Excel File
              </label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-lg">
                <div className="space-y-1 text-center">
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="flex text-sm text-gray-600 dark:text-gray-400">
                    <label
                      htmlFor="file-upload"
                      className="relative cursor-pointer bg-white dark:bg-gray-800 rounded-md font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 focus-within:outline-none"
                    >
                      <span>Upload a file</span>
                      <input
                        id="file-upload"
                        name="file-upload"
                        type="file"
                        className="sr-only"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        accept=".xlsx,.xls,.csv"
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    XLSX, XLS, or CSV up to 10MB
                  </p>
                </div>
              </div>
            </div>

            {/* File information */}
            {file && (
              <div className="mb-6 flex items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <FileSpreadsheet className="h-5 w-5 text-gray-500 dark:text-gray-400 mr-2" />
                <span className="text-sm text-gray-700 dark:text-gray-300 font-medium">
                  {file.name}
                </span>
                <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                  ({Math.round(file.size / 1024)} KB)
                </span>
                <button
                  className="ml-auto text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                  onClick={() => {
                    setFile(null);
                    setPreviewData([]);
                    setValidationErrors([]);
                    if (fileInputRef.current) {
                      fileInputRef.current.value = "";
                    }
                  }}
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            )}

            {/* Validation Errors */}
            {validationErrors.length > 0 && (
              <div className="mb-6 p-4 bg-red-50 dark:bg-red-900 rounded-lg">
                <h3 className="text-sm font-medium text-red-800 dark:text-red-200 mb-2 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  Validation Errors:
                </h3>
                <ul className="list-disc list-inside text-sm text-red-700 dark:text-red-300 space-y-1 max-h-40 overflow-y-auto">
                  {validationErrors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Data Preview */}
            {previewData.length > 0 && (
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Data Preview (first 5 rows):
                </h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-900">
                      <tr>
                        {Object.keys(previewData[0]).map((header) => (
                          <th
                            key={header}
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                          >
                            {header}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                      {previewData.map((row, rowIndex) => (
                        <tr key={rowIndex}>
                          {Object.values(row).map((cell, cellIndex) => (
                            <td
                              key={cellIndex}
                              className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300"
                            >
                              {String(cell)}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Upload Status */}
            {uploadStatus && (
              <div 
                className={`mb-6 p-4 rounded-lg ${
                  uploadStatus.type === "success" 
                    ? "bg-green-50 dark:bg-green-900 text-green-800 dark:text-green-200" 
                    : "bg-red-50 dark:bg-red-900 text-red-800 dark:text-red-200"
                }`}
              >
                <div className="flex items-center">
                  {uploadStatus.type === "success" ? (
                    <Check className="h-5 w-5 mr-2" />
                  ) : (
                    <AlertCircle className="h-5 w-5 mr-2" />
                  )}
                  <p className="font-medium">{uploadStatus.message}</p>
                </div>
                {uploadStatus.details && (
                  <div className="mt-2 text-sm">
                    <p>Created: {uploadStatus.details.created || 0}</p>
                    <p>Skipped: {uploadStatus.details.skipped || 0}</p>
                    <p>Failed: {uploadStatus.details.failed || 0}</p>
                  </div>
                )}
              </div>
            )}

            {/* Progress Bar */}
            {isLoading && (
              <div className="mb-6">
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                  <div
                    className="bg-blue-600 h-2.5 rounded-full"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 text-center">
                  {uploadProgress}% Complete
                </p>
              </div>
            )}

            {/* Actions */}
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={handleCancel}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none transition-colors duration-150"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleUpload}
                disabled={!file || isLoading || validationErrors.length > 0}
                className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none transition-colors duration-150 ${
                  (!file || isLoading || validationErrors.length > 0) && "opacity-50 cursor-not-allowed"
                }`}
              >
                {isLoading ? "Uploading..." : "Upload Tasks"}
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default TaskExcelUploader;
