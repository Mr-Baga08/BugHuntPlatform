import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./assets/Componets/Login page/login";
import Signin from "./assets/Componets/Login page/signin";
import Admin from "./assets/Componets/Admin Dashboard/Admin";
import Hunter from "./assets/Componets/Hunter Dashboard/hunter";
import Coach from "./assets/Componets/Coach Dashboard/coach";
import Protected from "./App/Common/Auth/Protected";
import AdminBoard from "./assets/Componets/Admin Dashboard/AdminDashboard";
function App() {
  const [userRole, setUserRole] = useState(localStorage.getItem("userRole"));

  useEffect(() => {
    setUserRole(localStorage.getItem("userRole"));
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login setUserRole={setUserRole} />} />
        <Route path="/signin" element={<Signin setUserRole={setUserRole} />} />   
        <Route path="/hunter" element={ <Protected><Hunter/></Protected>} /> 
        <Route path="/coach" element={<Protected><Coach/></Protected>} />
        <Route path="/admin-dashboard" element={<Protected><AdminBoard/></Protected>} />
        <Route path="/admin" element={userRole === "admin" ? <Admin /> : <Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
