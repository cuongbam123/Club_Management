import React, { useState, useEffect } from "react";
import { FaBars } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

export default function Navbar({ toggleSidebar }) {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const [clubName, setClubName] = useState("CLB ???");
  const [user, setUser] = useState({
    name: "",
    role: "",
    avatarUrl: "https://i.pravatar.cc/150?img=3",
  });

  const navigate = useNavigate();

  useEffect(() => {
  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return navigate("/loginad");

      const res = await axios.get(
        `${process.env.REACT_APP_API_URL}/auth/me`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log("auth/me response:", res.data);
      const u = res.data.user;
      setUser({
        ...u,
        avatarUrl: u.avatarUrl || "https://i.pravatar.cc/150?img=3",
      });
      setClubName(u.clubName || "CLB ???");
    } catch (err) {
      console.error("Không load được user:", err);
      navigate("/loginad");
    }
  };
  fetchData();
}, [navigate]);

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light border-bottom">
      <div className="container-fluid">
        {/* Nút toggle sidebar */}
        <button className="btn btn-light me-2" onClick={toggleSidebar}>
          <FaBars style={{ color: "black" }} />
        </button>

        {/* Tên CLB */}
        <div className="mx-auto fw-bold text-primary fs-5">
          <h1>{clubName}</h1>
        </div>

        {/* Nút mở nav mobile */}
        <button
          className="btn btn-outline-secondary d-lg-none"
          onClick={() => setIsNavOpen(!isNavOpen)}
        >
          <FaBars />
        </button>

        {/* Menu bên phải */}
        <div
          className={`navbar-collapse ${
            isNavOpen ? "d-block" : "d-none"
          } d-lg-flex`}
        >
          <ul className="navbar-nav ms-auto mt-2 mt-lg-0">
            <li className="nav-item">
              <Link className="nav-link" to="/">Home</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/events">Events</Link>
            </li>

            {/* Dropdown user */}
            <li className={`nav-item dropdown ${isDropdownOpen ? "show" : ""}`}>
              <a
                className="nav-link d-flex align-items-center"
                href="#!"
                onClick={(e) => {
                  e.preventDefault();
                  setIsDropdownOpen(!isDropdownOpen);
                }}
                style={{ gap: "4px" }}
              >
                <img
                  src={user.avatarUrl}
                  alt="avatar"
                  className="w-8 h-8 rounded-full object-cover"
                  style={{ width: "28px", height: "28px" }}
                />
                <span className="custom-caret">▾</span>
              </a>
              <div
                className={`dropdown-menu ${isDropdownOpen ? "show" : ""}`}
                style={{ right: "20px", left: "auto" }}
              >
                <Link className="dropdown-item" to="/profile">Profile</Link>
                <div className="dropdown-divider"></div>
                <Link
                  className="dropdown-item"
                  to="/loginad"
                  onClick={() => {
                    localStorage.removeItem("token");
                    localStorage.removeItem("user");
                  }}
                >
                  Logout
                </Link>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
