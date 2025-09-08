import React, { useState } from "react";

export default function ClubDetail({ club, onJoin, onBack }) {
    const [joinedState, setJoinedState] = useState("none"); // none | waiting | joined

    const handleJoinClick = () => {
        setJoinedState("waiting");

        setTimeout(() => {
            setJoinedState("joined");
            localStorage.setItem("clubLogo", club.logoUrl);
            localStorage.setItem("hasJoinedClub", "true");

            if (onJoin) onJoin(club); // chuyển sang EventClub
        }, 1500);
    };

    return (
        <div
            className="p-6 max-w-3xl mx-auto rounded-2xl shadow-lg text-center relative 
                 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md"
            style={{ marginTop: "30px" }}
        >
            {/* Nút quay lại */}
            <button
                onClick={onBack}
                className="absolute top-4 left-4 p-2 
             bg-gradient-to-r from-cyan-400 to-blue-500 
             text-white font-bold rounded-full shadow-lg
             hover:from-cyan-500 hover:to-blue-600 
             transition-all"
                title="Quay lại"
            >
                ←
            </button>


            {/* Logo CLB */}
            <img
                src={club.logoUrl}
                alt={club.name}
                className="mx-auto mb-6 shadow-lg rounded-xl"
                style={{ width: "100%", maxWidth: "550px", height: "auto", marginTop: "40px" }}
            />

            {/* Thông tin CLB */}
            <h1 className="text-3xl font-bold mb-2 dark:text-white">{club.name}</h1>
            <p className="text-gray-600 dark:text-gray-300 mb-2">
                <strong>Chủ nhiệm:</strong> {club.president}
            </p>
            <p className="text-gray-700 dark:text-gray-400 mb-6">{club.description}</p>

            {/* Trạng thái tham gia */}
            {joinedState === "none" && (
                <button
                    className="px-6 py-3 bg-gradient-to-r from-green-400 to-blue-500 
                     text-white font-semibold rounded-xl shadow-lg hover:shadow-xl 
                     transition transform hover:-translate-y-1"
                    onClick={handleJoinClick}
                >
                    Tham gia CLB
                </button>
            )}

            {joinedState === "waiting" && (
                <button
                    disabled
                    className="px-6 py-3 bg-yellow-400 text-white font-semibold rounded-xl 
                     shadow-lg cursor-not-allowed"
                >
                    Chờ xác nhận...
                </button>
            )}

            {joinedState === "joined" && (
                <button
                    disabled
                    className="px-6 py-3 bg-green-500 text-white font-semibold rounded-xl 
                     shadow-lg cursor-not-allowed"
                >
                    Đã tham gia
                </button>
            )}
        </div>
    );
}
