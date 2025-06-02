import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token"); 
    navigate("/login"); 
  };

  const token = localStorage.getItem("token");

  return (
    <nav className="bg-blue-600 text-white p-4 flex justify-between items-center">
      <Link to="/dashboard  " className="font-bold text-xl">
        SkillForge
      </Link>

      <div>
        {token ? (
          <>
            <Link to="/dashboard" className="mr-4 hover:underline">
              Dashboard
            </Link>
            <button
              onClick={handleLogout}
              className="bg-red-500 px-3 py-1 rounded hover:bg-red-600 transition"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="mr-4 hover:underline">
              Login
            </Link>
            <Link to="/register" className="hover:underline">
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
