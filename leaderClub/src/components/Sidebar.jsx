import React, { useState, useEffect } from "react";
import { FaTachometerAlt, FaCalendarAlt, FaBell, FaUsers } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import testLogo from "../assets/logo.png";

export default function Sidebar({ collapsed }) {
  const [logoUrl, setLogoUrl] = useState(null);

  const menuItems = [
    { name: "Dashboard", icon: <FaTachometerAlt />, link: "/" },
    { name: "Member Management", icon: <FaUsers />, link: "/members" },
    { name: "Event", icon: <FaCalendarAlt />, link: "/events" },
    { name: "Notification", icon: <FaBell />, link: "/notifications" },
  ];

  useEffect(() => {
  const fetchLogo = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `${process.env.REACT_APP_API_URL}/auth/me`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log("auth/me response:", res.data);
      const u = res.data.user;
      if (u.clubLogo) {
        setLogoUrl(`${process.env.REACT_APP_API_URL}${u.clubLogo}`);
      }
    } catch (err) {
      console.log("Không load được logo từ BE:", err);
    }
  };
  fetchLogo();
}, []);

  const logoToUse = logoUrl || testLogo;

  return (
    <div
      className="sidebar"
      style={{
        background: "linear-gradient(180deg, #4b6cb7, #182848)",
        color: "#fff",
        minHeight: "100vh",
        width: collapsed ? "0" : "250px",
        transition: "width 0.3s",
        display: "flex",
        flexDirection: "column",
        borderRadius: "5px",
        overflow: "hidden",
      }}
    >
      <div
        className="sidebar-heading"
        style={{
          padding: "20px",
          textAlign: "center",
          borderBottom: "1px solid rgba(255,255,255,0.1)",
        }}
      >
        <img
          src={logoToUse}
          alt="Club Logo"
          style={{
            width: "auto",
            height: "60px",
            borderRadius: "8px",
            opacity: collapsed ? 0 : 1,
            transition: "opacity 0.3s",
          }}
        />
      </div>

      <ul style={{ listStyle: "none", padding: "10px", margin: 0 }}>
        {menuItems.map((item) => (
          <li key={item.name} style={{ margin: "10px 0" }}>
            <a
              href={item.link}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                color: "#fff",
                textDecoration: "none",
                padding: "10px 15px",
                borderRadius: "5px",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "rgba(255,255,255,0.1)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "transparent")
              }
            >
              {item.icon} {item.name}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
