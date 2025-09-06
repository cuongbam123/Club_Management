import React, { useState, useEffect } from "react";
import { FaTachometerAlt, FaCalendarAlt, FaBell, FaUsers } from "react-icons/fa";
import 'bootstrap/dist/css/bootstrap.min.css';
import testLogo from '../assets/logo.png'; // ảnh test local

export default function Sidebar({ collapsed }) {
    const [logoUrl, setLogoUrl] = useState(null);

    const menuItems = [
        { name: "Dashboard", icon: <FaTachometerAlt />, link: "/" },
        { name: "Member Management", icon: <FaUsers />, link: "/members" },
        { name: "Event", icon: <FaCalendarAlt />, link: "/events" },
        { name: "Notification", icon: <FaBell />, link: "/notifications" },
    ];

    // Gọi API lấy logo từ backend/admin
    useEffect(() => {
        fetch("/api/get-logo") // backend trả về { logoUrl: "..." }
            .then(res => res.json())
            .then(data => setLogoUrl(data.logoUrl))
            .catch(err => console.log("Cannot load logo", err));
    }, []);

    const logoToUse = logoUrl || testLogo; // fallback nếu chưa có logo từ admin

    return (
        <div
            className="sidebar"
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
            {/* Logo */}
            <div
                className="sidebar-heading"
                style={{
                    padding: '20px',
                    fontSize: '1.2rem',
                    fontWeight: 'bold',
                    textAlign: 'center',
                    borderBottom: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '5px 5px 0 0',
                    overflow: 'visible',
                }}
            >
                <img
                    src={logoToUse}
                    alt="Club Logo"
                    style={{
                        width: "auto",
                        height: "auto",
                        borderRadius: "8px",
                        transition: 'opacity 0.3s',
                        opacity: collapsed ? 0 : 1,
                    }}
                />
            </div>

            {/* Menu */}
            <ul style={{ listStyle: 'none', padding: '10px', margin: 0 }}>
                {menuItems.map((item) => (
                    <li key={item.name} style={{ margin: '10px 0' }}>
                        <a
                            href={item.link}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px',
                                color: '#fff',
                                textDecoration: 'none',
                                padding: '10px 15px',
                                borderRadius: '5px',
                                transition: 'background 0.3s',
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                        >
                            {item.icon} {item.name}
                        </a>
                    </li>
                ))}
            </ul>
        </div>
    );
}
