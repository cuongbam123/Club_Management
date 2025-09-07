import React, { useState } from "react";

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

const Profile = () => {
    const [user, setUser] = useState(sampleUser);
    const [clubName] = useState(sampleClub.name);
    const [editMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState({
        name: sampleUser.name,
        email: sampleUser.email,
        phone: sampleUser.phone,
        address: sampleUser.address,
        avatarUrl: sampleUser.avatarUrl,
    });

    const handleSave = () => {
        setUser({ ...user, ...formData });
        setEditMode(false);
        alert("Lưu thông tin thành công!");
    };

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const url = URL.createObjectURL(file);
            setFormData({ ...formData, avatarUrl: url });
        }
    };

    return (
        <div className="flex items-start justify-center min-h-screen bg-gray-100 dark:bg-gray-900 p-4 pt-20">
            <div className="w-full max-w-md p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
                <h2 className="text-2xl font-bold mb-6 text-center text-gray-800 dark:text-white">
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
                            className="text-sm"
                        />
                    )}
                </div>

                {/* Profile info */}
                <div className="space-y-3">
                    <div>
                        <span className="font-semibold">Họ tên: </span>
                        {editMode ? (
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) =>
                                    setFormData({ ...formData, name: e.target.value })
                                }
                                className="w-full px-2 py-1 border rounded mt-1 text-black"
                            />
                        ) : (
                            <span>{user.name}</span>
                        )}
                    </div>

                    <div>
                        <span className="font-semibold">Email: </span>
                        {editMode ? (
                            <input
                                type="email"
                                value={formData.email}
                                onChange={(e) =>
                                    setFormData({ ...formData, email: e.target.value })
                                }
                                className="w-full px-2 py-1 border rounded mt-1 text-black"
                            />
                        ) : (
                            <span>{user.email}</span>
                        )}
                    </div>

                    <div>
                        <span className="font-semibold">Số điện thoại: </span>
                        {editMode ? (
                            <input
                                type="text"
                                value={formData.phone}
                                onChange={(e) =>
                                    setFormData({ ...formData, phone: e.target.value })
                                }
                                className="w-full px-2 py-1 border rounded mt-1 text-black"
                            />
                        ) : (
                            <span>{user.phone}</span>
                        )}
                    </div>

                    <div>
                        <span className="font-semibold">Địa chỉ: </span>
                        {editMode ? (
                            <input
                                type="text"
                                value={formData.address}
                                onChange={(e) =>
                                    setFormData({ ...formData, address: e.target.value })
                                }
                                className="w-full px-2 py-1 border rounded mt-1 text-black"
                            />
                        ) : (
                            <span>{user.address}</span>
                        )}
                    </div>

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
                                className="px-5 py-2 bg-gradient-to-r from-gray-400 to-gray-600 text-white font-semibold rounded-lg shadow-md hover:from-gray-500 hover:to-gray-700"
                            >
                                Hủy
                            </button>
                            <button
                                onClick={handleSave}
                                className="px-5 py-2 bg-gradient-to-r from-green-500 to-green-700 text-white font-semibold rounded-lg shadow-md hover:from-green-600 hover:to-green-800"
                            >
                                Lưu
                            </button>
                        </>
                    ) : (
                        <button
                            onClick={() => setEditMode(true)}
                            className="px-5 py-2 bg-gradient-to-r from-blue-300 to-blue-700 text-white font-semibold rounded-lg shadow-md hover:from-blue-600 hover:to-blue-800"
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
