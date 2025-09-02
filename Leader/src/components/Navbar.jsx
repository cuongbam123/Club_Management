import React, { useState, useEffect } from "react";
import { FaBars, FaUserCircle } from "react-icons/fa";

export default function Navbar({ toggleSidebar }) {
    const [isNavOpen, setIsNavOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

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
                    <h1> CLB gì ??</h1>
                </div>

                {/* Navbar toggler cho mobile */}
                <button
                    className="btn btn-outline-secondary d-lg-none"
                    onClick={handleNavToggle}
                >
                    <FaBars />
                </button>

                {/* Navbar links */}
                <div className={`navbar-collapse ${isNavOpen ? "d-block" : "d-none"} d-lg-flex`}>
                    <ul className="navbar-nav ms-auto mt-2 mt-lg-0">
                        <li className="nav-item">
                            <a className="nav-link" href="#!">Home</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="#!">Link</a>
                        </li>
                        {/* Dropdown */}
                        <li className={`nav-item dropdown ${isDropdownOpen ? "show" : ""}`}>
                            <a
                                className="nav-link d-flex align-items-center"
                                href="#!"
                                onClick={handleDropdownToggle}
                                style={{ gap: "4px" }}
                            >
                                <FaUserCircle size={28} />
                                <span className="custom-caret">▾</span>
                            </a>
                            <div
                                className={`dropdown-menu ${isDropdownOpen ? "show" : ""}`}
                                style={{ right: "20px", left: "auto" }}
                            >
                                <a className="dropdown-item" href="#!">Profile</a>
                                <a className="dropdown-item" href="#!">Settings</a>
                                <div className="dropdown-divider"></div>
                                <a className="dropdown-item" href="#!">Logout</a>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
}
