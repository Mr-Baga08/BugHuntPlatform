import React, { useState } from "react";
import { Moon, Sun, Search, Edit, Eye, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import TaskDisplayView from "../../../App/Common/Container/TaskDisplay/TaskDisplayView";

// export default function Coach() {
//   const [isDarkMode, setIsDarkMode] = useState(false);
//   const [searchQuery, setSearchQuery] = useState("");
//   const navigate = useNavigate(); // For navigation after logout

//   const toggleDarkMode = () => {
//     setIsDarkMode((prevMode) => !prevMode);
//   };

//   const logout = () => {
//     // Clear any stored data like user session, role, etc.
//     localStorage.removeItem("userRole");
//     // Navigate the user back to login page
//     navigate("/login"); 
//   };

//   const projects = [
//     {
//       taskId: "TASK-001",
//       projectName: "Project Alpha",
//       industry: "Technology",
//       toolLink: "#",
//       status: "In Progress",
//       lastUpdated: "2024-02-09",
//       updatedBy: "John Doe",
//     },
//   ];

//   return (
//     <div className={`min-h-screen ${isDarkMode ? "dark bg-gray-900" : "bg-gray-50"}`}>
//       {/* Navbar */}
//       <nav className="bg-white dark:bg-gray-800 shadow-lg p-4 flex justify-between">
//         <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Project Management Dashboard</h1>
//         <div className="flex items-center space-x-4">
//           <button onClick={toggleDarkMode} className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700">
//             {isDarkMode ? <Sun className="w-5 h-5 text-gray-300" /> : <Moon className="w-5 h-5 text-gray-600" />}
//           </button>
//           {/* Logout Button */}
//           <button onClick={logout} className="p-2 rounded-lg bg-red-500 text-white hover:bg-red-600">
//             <LogOut className="w-5 h-5" />
//           </button>
//         </div>
//       </nav>

//       {/* Main Content */}
//       <main className="max-w-6xl mx-auto py-6 px-4">
//         <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
//           {/* Search Bar */}
//           <div className="relative mb-4">
//             <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
//             <input
//               type="text"
//               placeholder="Search by Project Name, Task ID, or keywords..."
//               className="w-full pl-10 pr-4 py-2 border rounded-lg dark:bg-gray-700 dark:text-white"
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//             />
//           </div>

//           {/* Filters */}
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
//             <select className="border p-2 rounded dark:bg-gray-700 dark:text-white">
//               <option>Select Industry</option>
//             </select>
//             <select className="border p-2 rounded dark:bg-gray-700 dark:text-white">
//               <option>Status</option>
//             </select>
//             <select className="border p-2 rounded dark:bg-gray-700 dark:text-white">
//               <option>Team Member</option>
//             </select>
//           </div>

//           {/* Date Filters */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
//             <input type="date" className="border p-2 rounded dark:bg-gray-700 dark:text-white" />
//             <input type="date" className="border p-2 rounded dark:bg-gray-700 dark:text-white" />
//           </div>

//           {/* Table */}
//           <div className="overflow-x-auto">
//             <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
//               <thead className="bg-gray-50 dark:bg-gray-800">
//                 <tr>
//                   {["Task ID", "Project Name", "Industry", "Tool Link", "Status", "Last Updated", "Updated By", "Actions"].map((heading) => (
//                     <th key={heading} className="px-6 py-3 text-left text-xs font-medium dark:text-gray-400">{heading}</th>
//                   ))}
//                 </tr>
//               </thead>
//               <tbody className="bg-white dark:bg-gray-800">
//                 {projects.map((project) => (
//                   <tr key={project.taskId} className="border-b dark:border-gray-700">
//                     <td className="px-6 py-4 text-sm">{project.taskId}</td>
//                     <td className="px-6 py-4 text-sm">{project.projectName}</td>
//                     <td className="px-6 py-4 text-sm">{project.industry}</td>
//                     <td className="px-6 py-4 text-sm">
//                       <a href={project.toolLink} className="text-blue-500 hover:underline">View Link</a>
//                     </td>
//                     <td className="px-6 py-4 text-sm">
//                       <span className="px-3 py-1 bg-yellow-200 text-yellow-800 text-xs font-medium rounded-full">
//                         {project.status}
//                       </span>
//                     </td>
//                     <td className="px-6 py-4 text-sm">{project.lastUpdated}</td>
//                     <td className="px-6 py-4 text-sm">{project.updatedBy}</td>
//                     <td className="px-6 py-4 text-sm flex space-x-2">
//                       <button className="px-3 py-1 bg-gray-300 rounded text-sm hover:bg-gray-400">
//                         <Edit className="h-4 w-4 inline-block" /> Edit
//                       </button>
//                       <button className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600">
//                         <Eye className="h-4 w-4 inline-block" /> Review
//                       </button>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// }
export default function Coach(){
  return (
    <div>
      <TaskDisplayView title="Team Lead Dashboard" role="coach"/>
    </div>
  ); 
}
