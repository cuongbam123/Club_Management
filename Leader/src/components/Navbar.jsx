import React, { useState, useEffect } from "react";
import { FaBars } from "react-icons/fa";
import { Link } from "react-router-dom";

export default function Navbar({ toggleSidebar }) {
    const [isNavOpen, setIsNavOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    // Fake user data để test
    const [user] = useState({
        name: "Nguyễn Văn A",
        role: "leader",
        avatarUrl: "https://i.pravatar.cc/150?img=3",
    });

    const handleNavToggle = () => setIsNavOpen(!isNavOpen);
    const handleDropdownToggle = (e) => {
        e.preventDefault();
        setIsDropdownOpen(!isDropdownOpen);
    };

    // Đóng dropdown khi click ra ngoài
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (!e.target.closest(".nav-item.dropdown")) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener("click", handleClickOutside);
        return () => {
            document.removeEventListener("click", handleClickOutside);
        };
    }, []);

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light border-bottom">
            <div className="container-fluid">
                {/* Nút toggle sidebar */}
                <button className="btn btn-light me-2" onClick={toggleSidebar}>
                    <FaBars style={{ color: "black" }} />
                </button>

                {/* Text Leader CLB ở giữa */}
                <div className="mx-auto fw-bold text-primary fs-5">
                    <h1>CLB gì ??</h1>
                </div>

                {/* Navbar toggler cho mobile */}
                <button
                    className="btn btn-outline-secondary d-lg-none"
                    onClick={handleNavToggle}
                >
                    <FaBars />
                </button>

                {/* Navbar links */}
                <div
                    className={`navbar-collapse ${isNavOpen ? "d-block" : "d-none"} d-lg-flex`}
                >
                    <ul className="navbar-nav ms-auto mt-2 mt-lg-0">
                        <li className="nav-item">
                            <Link className="nav-link" to="/">
                                Home
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/events">
                                Events
                            </Link>
                        </li>

                        {/* Dropdown */}
                        <li className={`nav-item dropdown ${isDropdownOpen ? "show" : ""}`}>
                            <a
                                className="nav-link d-flex align-items-center"
                                href="#!"
                                onClick={handleDropdownToggle}
                                style={{ gap: "4px" }}
                            >
                                {/* Avatar thật */}
                                <img
                                    src={user.avatarUrl || "https://via.placeholder.com/28"}
                                    alt="avatar"
                                    className="w-8 h-8 rounded-full object-cover"
                                />
                                <span className="custom-caret">▾</span>
                            </a>

                            <div
                                className={`dropdown-menu ${isDropdownOpen ? "show" : ""}`}
                                style={{ right: "20px", left: "auto" }}
                            >
                                <Link className="dropdown-item" to="/profile">
                                    Profile
                                </Link>
                                <a className="dropdown-item" href="#!">
                                    Settings
                                </a>
                                <div className="dropdown-divider"></div>
                                <a className="dropdown-item" href="./src/pages/Loginad.jsx">
                                    Logout
                                </a>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
}
