// src/components/NavBar.jsx
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaHeart, FaRegFileAlt, FaUser, FaMoon, FaSun } from "react-icons/fa";
import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;

const NavBar = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  // 🔑 Fetch user info từ BE
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    axios
      .get(`${API_URL}/users/me`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setUser(res.data))
      .catch((err) => {
        console.error("Error getMe:", err);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
      });
  }, []);

  const handleUserClick = () => {
    if (!user) {
      navigate("/login");
    } else {
      setShowDropdown((prev) => !prev);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setShowDropdown(false);
    navigate("/");
  };

  // Đồng bộ state darkMode -> class html
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 font-poppins shadow-md">
      {/* Background */}
      <div
        className={`absolute inset-0 overflow-hidden rounded-b-lg transition-colors duration-700 
          ${
            darkMode
              ? "bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900"
              : "bg-gradient-to-r from-blue-50 via-white to-pink-50"
          }`}
      >
        {darkMode && (
          <>
            <div className="stars"></div>
            <div className="stars2"></div>
            <div className="stars3"></div>
          </>
        )}
      </div>

      <div className="relative flex items-center justify-between py-4 px-6">
        {/* Bên trái: ⭐ Club */}
        <div className="text-xl font-bold flex items-center space-x-2 cursor-pointer">
          <span className={darkMode ? "text-white" : "text-gray-900"}>
            ⭐ Club
          </span>
        </div>

        {/* Logo CLB ở giữa */}
        <img
          src="https://portal.ut.edu.vn/images/sv_logo_dashboard.png"
          alt="Club Logo"
          className="h-16 cursor-pointer drop-shadow-lg"
          onClick={() => navigate("/")}
        />

        {/* Icons bên phải */}
        <div className="flex gap-6 items-center">
          {/* Toggle sáng/tối */}
          <button
            onClick={() => setDarkMode((prev) => !prev)}
            className={`p-2 rounded-full shadow transition 
              ${
                darkMode
                  ? "bg-gray-700 hover:bg-gray-600"
                  : "bg-gray-100 hover:bg-gray-200"
              }`}
          >
            {darkMode ? (
              <FaSun className="text-yellow-400 text-xl" />
            ) : (
              <FaMoon className="text-gray-700 text-xl" />
            )}
          </button>

          {/* Favorite */}
          <FaHeart
            className={`text-2xl cursor-pointer transition-colors 
              ${
                isFavorite
                  ? "text-red-500"
                  : darkMode
                  ? "text-yellow-300 hover:text-yellow-400"
                  : "text-gray-700 hover:text-red-400"
              }`}
            onClick={() => setIsFavorite(!isFavorite)}
          />

          {/* History */}
          <FaRegFileAlt
            className={`text-2xl cursor-pointer transition-colors 
              ${
                darkMode
                  ? "text-yellow-300 hover:text-yellow-400"
                  : "text-gray-700 hover:text-blue-500"
              }`}
            onClick={() => navigate("/hist")}
          />

          {/* User */}
          <div className="relative">
            {user ? (
              <img
                src={
                  user.avatarUrl
                    ? `${API_URL.replace(/\/api$/, "")}${user.avatarUrl}`
                    : "https://via.placeholder.com/40"
                }
                alt={user.name}
                className="w-10 h-10 rounded-full cursor-pointer border border-gray-300 hover:ring-2 hover:ring-blue-400 transition"
                onClick={handleUserClick}
              />
            ) : (
              <FaUser
                className={`text-2xl cursor-pointer transition-colors 
                  ${
                    darkMode
                      ? "text-yellow-300 hover:text-yellow-400"
                      : "text-gray-700 hover:text-green-500"
                  }`}
                onClick={handleUserClick}
              />
            )}

            {user && showDropdown && (
              <div className="absolute right-0 mt-2 w-56 bg-white shadow-lg rounded-lg border border-gray-200 py-2 z-50 animate-fadeIn">
                <div className="px-4 py-2 border-b border-gray-200">
                  <p className="font-semibold text-gray-700">{user.name}</p>
                  <p className="text-sm text-gray-500">{user.email}</p>
                </div>
                <button
                  className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                  onClick={() => {
                    setShowDropdown(false);
                    navigate("/profile");
                  }}
                >
                  Profile
                </button>
                <button
                  className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-100"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Menu */}
      <nav className="relative flex justify-center gap-16 border-t border-gray-200 py-3 z-10">
        <Link to="/clubs" className={`nav-link ${darkMode ? "dark-nav" : ""}`}>
          CLB
        </Link>
        <Link to="/events" className={`nav-link ${darkMode ? "dark-nav" : ""}`}>
          Sự kiện
        </Link>
        <Link
          to="/registration-status"
          className={`nav-link ${darkMode ? "dark-nav" : ""}`}
        >
          Điểm danh
        </Link>
        <Link
          to="/notifications"
          className={`nav-link ${darkMode ? "dark-nav" : ""}`}
        >
          Thông báo
        </Link>
      </nav>

      <style>
        {`
        .nav-link {
          color: #1e3a8a;
          text-decoration: none;
          font-size: 20px;
          font-weight: 600;
          transition: all 0.3s ease;
        }
        .nav-link:hover {
          color: #0284c7;
          text-shadow: 0 0 8px rgba(0, 180, 255, 0.4);
        }

        .dark-nav {
          color: #facc15;
          text-shadow: 0 0 10px rgba(250, 204, 21, 0.7);
        }
        .dark-nav:hover {
          color: #fde047;
          text-shadow: 0 0 15px rgba(250, 224, 47, 1);
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-5px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-in-out;
        }

        .stars, .stars2, .stars3 {
          position: absolute;
          top: 0; left: 0; right: 0; bottom: 0;
          background: transparent url("https://www.transparenttextures.com/patterns/stardust.png") repeat;
          z-index: 0;
        }
        .stars { animation: moveStars 100s linear infinite; }
        .stars2 { background-size: 200px 200px; animation: moveStars 200s linear infinite; }
        .stars3 { background-size: 300px 300px; animation: moveStars 300s linear infinite; }

        @keyframes moveStars {
          from { transform: translateY(0); }
          to { transform: translateY(-1000px); }
        }
        `}
      </style>
    </header>
  );
};

export default NavBar;
