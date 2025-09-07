// src/pages/ClubDetail.jsx
import React, { useState } from "react";

export default function ClubDetail({ club, onJoin, onBack }) {
    const [joinedState, setJoinedState] = useState("none"); // "none" | "waiting"

    const handleJoinClick = () => {
        setJoinedState("waiting");
        setTimeout(() => {
            if (onJoin) onJoin(club);               // gọi callback từ ClubList
            localStorage.setItem("clubLogo", club.logoUrl); // lưu logo CLB
            localStorage.setItem("hasJoinedClub", "true"); // đánh dấu đã join
        }, 1500);
    };

    return (
        <div
            className="p-6 max-w-3xl mx-auto rounded-2xl shadow-lg text-center relative"
            style={{ marginTop: "30px", backgroundColor: "#edf6fd" }}
        >
            {/* Nút quay lại */}
            <button
                onClick={onBack}
                className="absolute top-4 left-4 p-2 bg-gray-100 rounded-full shadow hover:bg-gray-200 transition-colors"
                title="Quay lại"
            >
                ←
            </button>

            {/* Logo CLB */}
            <img
                src={club.logoUrl}
                alt={club.name}
                className="mx-auto mb-6 shadow-lg"
                style={{
                    width: "100%",
                    maxWidth: "550px",
                    minWidth: "550px",
                    height: "auto",
                    marginTop: "40px",
                }}
            />

            {/* Thông tin CLB */}
            <h1 className="text-3xl font-bold mb-2">{club.name}</h1>
            <p className="text-gray-600 mb-2">
                <strong>Chủ nhiệm:</strong> {club.president}
            </p>
            <p className="text-gray-700 mb-6">{club.description}</p>

            {/* Nút tham gia / chờ xác nhận */}
            {joinedState === "none" && (
                <button
                    className="px-6 py-3 bg-gradient-to-r from-green-400 to-blue-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition transform hover:-translate-y-1"
                    onClick={handleJoinClick}
                >
                    Tham gia CLB
                </button>
            )}

            {joinedState === "waiting" && (
                <button
                    disabled
                    className="px-6 py-3 bg-yellow-400 text-white font-semibold rounded-xl shadow-lg cursor-not-allowed"
                >
                    Chờ xác nhận
                </button>
            )}
        </div>
    );
}
