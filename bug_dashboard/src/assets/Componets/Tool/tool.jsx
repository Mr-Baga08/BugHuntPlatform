import React from "react";

const Tool = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Task Header */}
      <div className="bg-black text-white p-4 rounded-md flex justify-between items-center">
        <h2 className="text-lg font-bold">Task ID: BH-001</h2>
        <div className="flex gap-3">
          <a href="http://example.com/target-app" className="text-blue-400 underline">
            Tool Link: http://example.com/target-app
          </a>
          <button className="bg-gray-700 px-3 py-1 rounded">Launch in Sandbox</button>
          <span className="bg-yellow-400 text-black px-3 py-1 rounded">Status: In Progress</span>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        
        {/* Help & Resources */}
        <div className="bg-white p-4 rounded-md shadow">
          <h3 className="font-bold">Help & Resources</h3>
          <div className="flex gap-2 mt-2">
            <button className="bg-gray-300 px-3 py-1 rounded">Standard Scripts</button>
            <button className="bg-gray-300 px-3 py-1 rounded">Documentation</button>
            <button className="bg-gray-300 px-3 py-1 rounded">Add New Script</button>
          </div>
          <input type="text" placeholder="Script Name" className="border p-2 w-full mt-3 rounded" />
          <textarea placeholder="Paste your script here" className="border p-2 w-full mt-3 rounded"></textarea>
          <button className="bg-black text-white px-4 py-2 mt-3 rounded w-full">Submit for Review</button>
        </div>

        {/* Review and Feedback */}
        <div className="bg-white p-4 rounded-md shadow">
          <h3 className="font-bold">Review and Feedback</h3>
          <textarea placeholder="Description of the test performed" className="border p-2 w-full mt-3 rounded"></textarea>
          <textarea placeholder="Observed behavior/output" className="border p-2 w-full mt-3 rounded"></textarea>
          <textarea placeholder="Potential vulnerabilities identified" className="border p-2 w-full mt-3 rounded"></textarea>
          <input type="file" className="mt-3" />
          <button className="bg-black text-white px-4 py-2 mt-3 rounded w-full">Submit Review</button>
        </div>

        {/* Interactive Testing Area */}
        <div className="bg-white p-4 rounded-md shadow">
          <h3 className="font-bold">Interactive Testing Area</h3>
          <select className="border p-2 w-full mt-3 rounded">
            <option>XSS Test Script</option>
            <option>SQL Injection Test Script</option>
          </select>
          <div className="flex gap-2 mt-3">
            <button className="bg-black text-white px-4 py-2 rounded">▶ Execute Script</button>
            <button className="bg-gray-600 text-white px-4 py-2 rounded">🔄 Rerun Script</button>
          </div>
          <textarea placeholder="Output will appear here" className="border p-2 w-full mt-3 rounded"></textarea>
        </div>

        {/* Final Report */}
        <div className="bg-white p-4 rounded-md shadow">
          <h3 className="font-bold">Final Report</h3>
          <textarea placeholder="Provide a comprehensive report of your findings" className="border p-2 w-full mt-3 rounded"></textarea>
          <p className="mt-3 font-medium">Select difficulty rating</p>
          <div className="flex gap-4 mt-2">
            <label>
              <input type="radio" name="difficulty" className="mr-2" /> Easy
            </label>
            <label>
              <input type="radio" name="difficulty" className="mr-2" /> Medium
            </label>
            <label>
              <input type="radio" name="difficulty" className="mr-2" /> Hard
            </label>
          </div>
          <button className="bg-black text-white px-4 py-2 mt-3 rounded w-full">Submit Final Report</button>
        </div>

      </div>
    </div>
  );
};

export default Tool;