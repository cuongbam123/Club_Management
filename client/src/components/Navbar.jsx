import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaHeart, FaRegFileAlt, FaUser } from "react-icons/fa";

const NavBar = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(() => {
        const storedUser = localStorage.getItem("user");
        return storedUser ? JSON.parse(storedUser) : null;
    });
    const [showDropdown, setShowDropdown] = useState(false);
    const [isFavorite, setIsFavorite] = useState(false);

    // ✅ Lấy logo CLB nếu đã join
    const [clubLogo, setClubLogo] = useState(() => localStorage.getItem("clubLogo"));

    const handleUserClick = () => {
        if (!user) {
            navigate("/login");
        } else {
            setShowDropdown((prev) => !prev);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("user");
        setUser(null);
        setShowDropdown(false);
        navigate("/");
    };

    // Theo dõi khi có thay đổi logo CLB từ trang khác
    useEffect(() => {
        const handleStorageChange = () => {
            setClubLogo(localStorage.getItem("clubLogo"));
        };
        window.addEventListener("storage", handleStorageChange);
        return () => {
            window.removeEventListener("storage", handleStorageChange);
        };
    }, []);

    return (
        <header className="fixed top-0 left-0 right-0 bg-gray-100 rounded-b-lg z-50 font-poppins shadow-md">
            <div className="relative flex justify-center items-center py-4 px-6">
                {/* Logo CLB hoặc default */}
                <img
                    src={clubLogo || "https://portal.ut.edu.vn/images/sv_logo_dashboard.png"}
                    alt="Logo"
                    className="h-20 cursor-pointer"
                    onClick={() => navigate("/")}
                />

                <div className="absolute right-6 flex gap-6 items-center">
                    <FaHeart
                        className={`text-2xl cursor-pointer transition-colors ${isFavorite ? "text-red-500" : "text-black hover:text-red-400"}`}
                        onClick={() => setIsFavorite(!isFavorite)}
                    />

                    <FaRegFileAlt
                        className="text-2xl text-black cursor-pointer hover:text-blue-500 transition-colors"
                        onClick={() => navigate("/hist")}
                    />

                    <div className="relative">
                        {user ? (
                            <img
                                src={user.avatarUrl}
                                alt={user.name}
                                className="w-10 h-10 rounded-full cursor-pointer border border-gray-300 hover:ring-2 hover:ring-blue-400 transition"
                                onClick={handleUserClick}
                            />
                        ) : (
                            <FaUser
                                className="text-2xl cursor-pointer hover:text-green-500 transition-colors"
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

            <nav className="flex justify-center gap-16 border-t border-gray-300 py-3">
                <Link to="/clubs" className="nav-link">CLB</Link>
                <Link to="/events" className="nav-link">Sự kiện</Link>
                <Link to="/registration-status" className="nav-link">Điểm danh</Link>
                <Link to="/notifications" className="nav-link">Thông báo</Link>
            </nav>

            <style>
                {`
                .nav-link {
                    color: #000;
                    text-decoration: none;
                    font-size: 20px;
                    font-weight: 600;
                    transition: all 0.3s ease;
                }
                .nav-link:hover {
                    background: linear-gradient(45deg, #06b6d4, #3b82f6, #1e40af);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                }
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(-5px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fadeIn {
                    animation: fadeIn 0.2s ease-in-out;
                }
                `}
            </style>
        </header>
    );
};

export default NavBar;
