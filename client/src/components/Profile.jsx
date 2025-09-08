// src/components/Profile.jsx
import React, { useState } from "react";

// Dữ liệu mẫu
const sampleUser = {
    _id: "1",
    name: "Nguyễn Văn A",
    email: "nguyenvana@example.com",
    phone: "0912345678",
    address: "123 Đường ABC, Quận 1, TP.HCM",
    role: "leader",
    clubId: "100",
    avatarUrl: "https://i.pravatar.cc/150?img=3",
};

const sampleClub = {
    _id: "100",
    name: "CLB Bóng Đá",
};

const Profile = ({ onUserUpdate }) => {
    const [user, setUser] = useState(sampleUser);
    const [formData, setFormData] = useState({ ...sampleUser });
    const [editMode, setEditMode] = useState(false);
    const [clubName] = useState(sampleClub.name);

    const handleSave = () => {
        const updatedUser = { ...user, ...formData };
        setUser(updatedUser);
        setEditMode(false);
        localStorage.setItem("user", JSON.stringify(updatedUser));
        if (onUserUpdate) onUserUpdate(updatedUser);
        alert("Lưu thông tin thành công!");
    };

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const url = URL.createObjectURL(file);
            setFormData({ ...formData, avatarUrl: url });
            const updatedUser = { ...user, avatarUrl: url };
            setUser(updatedUser);
            localStorage.setItem("user", JSON.stringify(updatedUser));
            if (onUserUpdate) onUserUpdate(updatedUser);
        }
    };

    return (
        <div
            className="flex items-start justify-center min-h-screen p-4 pt-20
                       bg-gray-100 dark:bg-gray-900
                       dark:bg-[url('https://png.pngtree.com/thumb_back/fw800/background/20190221/ourmid/pngtree-mid-autumn-festival-mid-autumn-festival-mid-autumn-material-full-of-image_11694.jpg')]
                       dark:bg-cover dark:bg-center dark:bg-fixed"
        >
            <div
                className="w-full max-w-md p-6 rounded-xl shadow-lg
                           bg-white dark:bg-gray-800
                           backdrop-blur-md"
            >
                <h2
                    className="text-4xl font-extrabold mb-8 text-center
                               bg-gradient-to-r from-cyan-400 via-blue-500 to-blue-800
                               bg-clip-text text-transparent drop-shadow-md italic tracking-widest"
                >
                    Thông tin cá nhân
                </h2>

                {/* Avatar */}
                <div className="flex justify-center mb-4 flex-col items-center">
                    <img
                        src={formData.avatarUrl || "https://via.placeholder.com/100"}
                        alt="avatar"
                        className="w-28 h-28 rounded-full object-cover mb-2"
                    />
                    {editMode && (
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleAvatarChange}
                            className="text-sm dark:text-white"
                        />
                    )}
                </div>

                {/* Profile info */}
                <div className="space-y-3 dark:text-white">
                    {["name", "email", "phone", "address"].map((field) => (
                        <div key={field}>
                            <span className="font-semibold">
                                {field === "name"
                                    ? "Họ tên: "
                                    : field === "email"
                                        ? "Email: "
                                        : field === "phone"
                                            ? "Số điện thoại: "
                                            : "Địa chỉ: "}
                            </span>
                            {editMode ? (
                                <input
                                    type={field === "email" ? "email" : "text"}
                                    value={formData[field]}
                                    onChange={(e) =>
                                        setFormData({ ...formData, [field]: e.target.value })
                                    }
                                    className="w-full px-2 py-2 border rounded mt-1
                                               bg-gray-100 text-black
                                               dark:bg-gray-700 dark:text-white dark:border-gray-600
                                               focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-600"
                                />
                            ) : (
                                <span>{user[field]}</span>
                            )}
                        </div>
                    ))}

                    <div>
                        <span className="font-semibold">Vai trò: </span>
                        <span>{user.role}</span>
                    </div>

                    <div>
                        <span className="font-semibold">CLB: </span>
                        <span>{clubName}</span>
                    </div>
                </div>

                {/* Buttons */}
                <div className="flex justify-center mt-6 space-x-3">
                    {editMode ? (
                        <>
                            <button
                                onClick={() => setEditMode(false)}
                                className="px-5 py-2 bg-gradient-to-r from-gray-400 to-gray-600
                                           text-white font-semibold rounded-lg shadow-md
                                           hover:from-gray-500 hover:to-gray-700"
                            >
                                Hủy
                            </button>
                            <button
                                onClick={handleSave}
                                className="px-5 py-2 bg-gradient-to-r from-green-500 to-green-700
                                           text-white font-semibold rounded-lg shadow-md
                                           hover:from-green-600 hover:to-green-800"
                            >
                                Lưu
                            </button>
                        </>
                    ) : (
                        <button
                            onClick={() => setEditMode(true)}
                            className="px-5 py-2 bg-gradient-to-r from-blue-300 to-blue-700
                                       text-white font-semibold rounded-lg shadow-md
                                       hover:from-blue-600 hover:to-blue-800"
                        >
                            Chỉnh sửa
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Profile;
