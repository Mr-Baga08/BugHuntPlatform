


import React, { useState, useEffect } from "react";
import { Moon, Sun, Search, Edit, Eye, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Navbar from "../Appbar/NavBar";

export default function TaskDisplayView({title, role}) {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const [status, setStatus] = useState("All");
  const [industry, setIndustry] = useState("All");
  const toggleDarkMode = () => {
    setIsDarkMode((prevMode) => !prevMode);
  };

  const logout = () => {
    localStorage.removeItem("userRole");
    navigate("/login");
  };

  const handleToolClick = (taskId) => {
    navigate(`/tool/${taskId}`);
  };
  const [project ,setProject] = useState([]);
  const Status = [
    "Unclaimed" , "In Process" ,"Complete" , "Reviewed"
  ];
  const [ColoumParam , setColoumParam ] = useState([
    "Task ID",
    "Project Name",
    "Industry",
    "Tool Link",
    "Status",
    "Last Updated",
    "Updated By",
  ]); 

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [IndustryArray,setIndustryArray] = useState([]);
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await fetch("http://localhost:3000/api/task", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: token, 
          },
        });
        
        if (!response.ok) {
          throw new Error("Failed to fetch tasks");
        }
        const data = await response.json();
        
        setTasks(data);
        setProject(data);

        const array = data.map((task)=>task.industry);
        setIndustryArray(array);

      } catch (error) {
        alert("Unable to fetch tasks", error);
        setTasks([]); 
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
    // console.log(project)
  }, []);

  useEffect(()=>{
    if(role=="coach"){
      setColoumParam([...ColoumParam , "Action"]);
      // ColoumParam.add("Action");
    }
  },[]);

  useEffect(() => {

        const filtered = tasks.filter((task) => {
          var count =0;
          if(task.industry === industry || industry=='All')count+=1  ;
          if(task.status === status || status=='All')count+=1  ;
          if(task.industry.toLowerCase().includes(searchQuery.toLowerCase()) ||
            task.projectName.toLowerCase().includes(searchQuery.toLowerCase()) || 
            task.taskId.toLowerCase().includes(searchQuery.toLowerCase())  )count+=1;
          if(count==3)return true;
        });
        setProject(filtered);
        

  }, [searchQuery, status, industry]); 

  const handleStatusChange = async (newStatus, taskId) => {
    try {
      const response = await fetch(`http://localhost:3000/api/task/update-status/${taskId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization" : localStorage.getItem("token"),
        },
        body: JSON.stringify({ status: newStatus,updatedBy:localStorage.getItem("userName") }),
      });
      if (!response.ok) throw new Error("Failed to update status");
  
      const data = await response.json(); 
  
      setTasks((prevTasks) =>
        prevTasks.map((task) => (task.taskId === taskId ? data.updatedTask : task))
      );
  
      alert("Status updated successfully!");
    } catch (error) {
      alert("Error updating status");
    }
  };

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [filteredTasks, setFilteredTasks] = useState(tasks);

  useEffect(() => {
    // Run the filter only if both dates are selected
    if (startDate && endDate) {
      const filtered = tasks.filter((task) => {
        const taskDate = new Date(task.lastUpdated).toISOString().split("T")[0]; // Convert to YYYY-MM-DD format
        return taskDate >= startDate && taskDate <= endDate;
      });

      setProject(filtered);
    } else {
      setProject(tasks); // Show all tasks if no filter is applied
    }
  }, [startDate, endDate]); 

  
  
  
  // if(loading) return <p>Loading task ...</p>;
  return (
    <div
      className={`min-h-screen ${
        isDarkMode ? "dark bg-gray-900" : "bg-gray-50"
      }`}
    >
      {/* <Navbar/> */}
      <nav className="bg-white dark:bg-gray-800 shadow-lg p-4 flex justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          {title}
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
      </nav>
      {/* Main Content */}
      <main className="max-w-6xl mx-auto py-6 px-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        
        {/* Search Bar */}
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

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <select
            className="border p-2 rounded dark:bg-gray-700 dark:text-white"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="All">All Status</option>
            {["Unclaimed", "In Progress", "Completed" , "Reviewed"].map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>

          <select
            className="border p-2 rounded dark:bg-gray-700 dark:text-white"
            value={industry}
            onChange={(e) => setIndustry(e.target.value)}
          >
            <option value="All">Select Industry</option>
            { IndustryArray.map((i) => (
              <option key={i} value={i}>{i}</option>
            ))}
          </select>
        </div>

          {/* Date Filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <input
          type="date"
          className="border p-2 rounded dark:bg-gray-700 dark:text-white"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
        <input
          type="date"
          className="border p-2 rounded dark:bg-gray-700 dark:text-white"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
      </div>

          {/* Table */}
          <div className="overflow-x-auto ">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 ">
              <thead className="bg-gray-50 dark:bg-gray-800 ">
                <tr>
                  {ColoumParam.map((heading) => (
                    <th
                      key={heading}
                      className="px-6 py-3 text-left text-xs font-medium dark:text-gray-400"
                    >
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 ">
                {project.map((project) => (
                  <tr
                    key={project.taskId}
                    className="border-b dark:border-gray-700"
                  >
                    <td className="px-6 py-4 text-sm">{project.taskId}</td>
                    <td className="px-6 py-4 text-sm">{project.projectName}</td>
                    <td className="px-6 py-4 text-sm">{project.industry}</td>
                    <td className="px-6 py-4 text-sm">
                      <button
                        onClick={() => handleToolClick(project.taskId)}
                        className="text-blue-500 hover:underline cursor-pointer">
                        View Link
                      </button>
                    </td>
                    <td className="px-4 py-5 text-sm">
                      <div className="px-3 py-1 bg-yellow-200 text-yellow-800 text-xs font-medium rounded-full">
                        {project.status}
                      </div>
                      {/* <select
                        className="px-3 py-1 bg-yellow-200 text-yellow-800 text-xs font-medium rounded-full"
                        value={project.status}
                        onChange={(e) => handleStatusChange(e.target.value, project._id)}
                      >
                        <option value="Unclaimed">Unclaimed</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                        <option value="Reviewed">Reviewed</option>
                      </select> */}
                    </td>
                    <td className="px-6 py-4 text-sm">{project.lastUpdated}</td>
                    <td className="px-6 py-4 text-sm">{project.updatedBy}</td>
                    { role === "coach" && (<td className="px-6 py-4 text-sm flex space-x-2">
                      <button className="px-3 py-1 bg-gray-300 rounded text-sm hover:bg-gray-400">
                        <Edit className="h-4 w-4 inline-block" /> Edit
                      </button>
                      <button className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600">
                        <Eye className="h-4 w-4 inline-block" /> Review
                      </button>
                    </td>)}
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
