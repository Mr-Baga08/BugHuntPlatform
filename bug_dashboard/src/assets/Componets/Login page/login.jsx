import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaRegMoon, FaSun } from "react-icons/fa";
import axios from "axios";
import API_BASE_URL from "../Admin Dashboard/config";

const Login = ({ setUserRole }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("admin"); // Default role
  const [message, setMessage] = useState("");
  const [username, setusername] = useState("");
  const [darkMode, setDarkMode] = useState(localStorage.getItem("darkMode") === "true");

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem("darkMode", newDarkMode);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      let response;
      if (role === "admin") {
        response = await axios.post(`${API_BASE_URL}/admin/login`, { email, password });
      } else {
        response = await axios.post(`${API_BASE_URL}/auth/register`, { username ,  email, password, role });
      }

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("userRole", role);
      setUserRole(role);

      if (role === "admin") {
        navigate("/admin");
      } else {
        setMessage("Your registration is pending approval.");
      }
    } catch (error) {
      setMessage(error.response?.data?.message || "Login failed");
    }
  };

  return (
 <div className="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-900">
  <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg w-96">
    {/* Header */}
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-xl font-bold dark:text-white">Astraeus</h2>
      <button
        className="p-2 bg-gray-200 dark:bg-gray-700 rounded-lg transition duration-300"
        onClick={toggleDarkMode}
      >
        {darkMode ? (
          <FaSun className="text-yellow-400" />
        ) : (
          <FaRegMoon className="text-gray-800 dark:text-white" />
        )}
      </button>
    </div>

    {/* Title */}
    <h1 className="text-2xl font-bold text-center dark:text-white mb-2">
      Welcome back
    </h1>
    <p className="text-gray-500 dark:text-gray-300 text-center mb-6">
      Enter your credentials
    </p>

    {/* Error Message */}
    {message && <p className="text-red-500 text-center mb-4">{message}</p>}

    {/* Form */}
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Username */}
      <div>
        <label className="block font-medium dark:text-white">Username</label>
        <input
          type="text"
          placeholder="Enter username"
          value={username}
          onChange={(e) => setusername(e.target.value)}
          required
          className="w-full p-3 border border-gray-300 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-gray-500 focus:outline-none"
        />
      </div>

      {/* Role Selection */}
      <div>
        <label className="block font-medium dark:text-white">Role</label>
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-gray-500 focus:outline-none"
        >
          <option value="admin">Admin</option>
          <option value="coach">Coach</option>
          <option value="hunter">Hunter</option>
        </select>
      </div>

      {/* Email */}
      <div>
        <label className="block font-medium dark:text-white">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="name@example.com"
          required
          className="w-full p-3 border border-gray-300 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-gray-500 focus:outline-none"
        />
      </div>

      {/* Password */}
      <div>
        <label className="block font-medium dark:text-white">Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          required
          className="w-full p-3 border border-gray-300 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-gray-500 focus:outline-none"
        />
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600 transition duration-300"
      >
        Register/Sign in
      </button>
      <div className="flex justify-center text-white text-lg p-5">
      <p>
        Go to{" "}
        <span
          onClick={() => navigate("/signin")}
          className="underline cursor-pointer text-blue-400 hover:text-blue-300"
        >
          Login
        </span>
      </p>
    </div>
    </form>
    
  </div>
</div>

  );
};

export default Login;
