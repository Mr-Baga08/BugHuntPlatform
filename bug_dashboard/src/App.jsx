import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./assets/Componets/Login page/login";
import Signin from "./assets/Componets/Login page/signin";
import Admin from "./assets/Componets/Admin Dashboard/Admin";
import Hunter from "./assets/Componets/Hunter Dashboard/hunter";
import Coach from "./assets/Componets/Coach Dashboard/coach";
import Protected from "./App/Common/Auth/Protected";
import AdminBoard from "./assets/Componets/Admin Dashboard/AdminDashboard";
import Tool from "./assets/Componets/Tool/tool";
import CreateTask from "./assets/Componets/Admin Dashboard/CreateTask";

function App() {
  const [userRole, setUserRole] = useState(localStorage.getItem("userRole"));
  const [darkMode, setDarkMode] = useState(localStorage.getItem("darkMode") === "true");

  useEffect(() => {
    setUserRole(localStorage.getItem("userRole"));
    
    // Apply dark mode
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem("darkMode", newMode);
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/signin" replace />} />
        <Route path="/login" element={<Login setUserRole={setUserRole} />} />
        <Route path="/signin" element={<Signin setUserRole={setUserRole} />} />
        
        <Route path="/hunter" element={
          <Protected>
            <Hunter />
          </Protected>
        } />
        
        <Route path="/coach" element={
          <Protected>
            <Coach />
          </Protected>
        } />
        
        <Route path="/admin-dashboard" element={
          <Protected>
            <AdminBoard />
          </Protected>
        } />
        
        <Route path="/admin" element={
          userRole === "admin" ? <Admin /> : <Navigate to="/signin" replace />
        } />
        
        <Route path="/tool/:taskId" element={
          <Protected>
            <Tool />
          </Protected>
        } />
        
        <Route path="/create-task" element={
          <Protected>
            <CreateTask />
          </Protected>
        } />
        
        {/* Fallback route for any unmatched path */}
        <Route path="*" element={<Navigate to="/signin" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
