import React from "react";
import { FaTachometerAlt, FaCalendarAlt, FaBell } from "react-icons/fa"; // loại bỏ FaUsers
import 'bootstrap/dist/css/bootstrap.min.css';

export default function Sidebar({ collapsed }) {
    const menuItems = [
        { name: "Dashboard", icon: <FaTachometerAlt />, link: "/" },
        { name: "Event", icon: <FaCalendarAlt />, link: "/events" },
        { name: "Notification", icon: <FaBell />, link: "/notifications" },
    ];

    return (
        <div
            className="sidebar"
            id="sidebar-wrapper"
            style={{
                background: 'linear-gradient(180deg, #4b6cb7, #182848)',
                color: '#fff',
                minHeight: '100vh',
                width: collapsed ? '0' : '250px',
                transition: 'width 0.3s',
                display: 'flex',
                flexDirection: 'column',
                borderRadius: '5px',
                overflow: 'hidden',
            }}
        >
            {/* Header */}
            <div
                className="sidebar-heading"
                style={{
                    padding: '20px',
                    fontSize: '1.5rem',
                    fontWeight: 'bold',
                    textAlign: 'center',
                    borderBottom: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '5px 5px 0 0',
                }}
            >
                LEADER CLB
            </div>

            {/* Menu */}
            <div className="list-group list-group-flush custom-list-group">
                {menuItems.map((item) => (
                    <a
                        key={item.name}
                        href={item.link}
                        className="list-group-item d-flex align-items-center"
                        style={{
                            background: 'transparent',
                            color: '#fff',
                            padding: '15px 20px',
                            border: 'none',
                            transition: 'background-color 0.3s, color 0.3s',
                            textDecoration: 'none',
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'transparent';
                        }}
                    >
                        <span className="me-2">{item.icon}</span>
                        {item.name}
                    </a>
                ))}
            </div>
        </div>
    );
}
