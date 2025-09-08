// src/components/Histo.jsx
import React, { useEffect, useState } from "react";

const sampleEvents = [
    {
        id: "e1",
        name: "Sự kiện Ngày Hội Văn Hóa",
        clubName: "CLB Văn Hóa",
        startAt: "2025-08-10T09:00:00",
        endAt: "2025-08-10T17:00:00",
        content: "Hoạt động văn hóa, trò chơi, giao lưu giữa các CLB.",
    },
    {
        id: "e2",
        name: "Hội Thao Văn Hóa",
        clubName: "CLB Thể Thao",
        startAt: "2025-07-05T08:30:00",
        endAt: "2025-07-05T12:30:00",
        content: "Các môn thể thao, thi đấu giữa các đội CLB.",
    },
];

const Histo = () => {
    const [darkMode, setDarkMode] = useState(false);

    useEffect(() => {
        setDarkMode(localStorage.getItem("theme") === "dark");
    }, []);

    return (
        <div className="relative flex flex-col items-center min-h-screen overflow-hidden bg-gray-100 dark:bg-gray-900 transition-colors duration-500">

            {/* Mặt trăng góc trái chỉ khi darkMode */}
            {darkMode && (
                <div className="absolute top-8 left-8 w-20 h-20">
                    {/* Vòng tròn vàng chính */}
                    <div className="w-full h-full rounded-full bg-gray-100 shadow-2xl animate-pulse"></div>
                    {/* Vòng tròn che tạo khuyết */}
                    <div className="absolute top-0 left-4 w-full h-full rounded-full bg-gray-900 dark:bg-gray-900"></div>
                </div>
            )}

            {/* Lồng đèn bay lên chỉ khi darkMode */}
            {darkMode && (
                <div className="absolute inset-0 pointer-events-none">
                    {[...Array(50)].map((_, i) => (
                        <div
                            key={i}
                            className="absolute bottom-0 w-4 h-10 rounded-xl bg-yellow-400 opacity-90 shadow-[0_0_15px_rgba(250,204,21,0.8)] animate-floatingGlow"
                            style={{
                                left: `${Math.random() * 100}%`,
                                animationDelay: `${Math.random() * 5}s`,
                                animationDuration: `${5 + Math.random() * 5}s`,
                            }}
                        />


                    ))}
                </div>
            )}

            {/* Form/Bảng */}
            <div className="relative w-full max-w-5xl p-8 bg-white dark:bg-gray-800 rounded-xl shadow-2xl transition-colors duration-500 z-10 mt-32">
                <h2 className="text-5xl font-extrabold mb-10 text-center
          bg-gradient-to-r from-cyan-400 via-blue-500 to-blue-800
          bg-clip-text text-transparent drop-shadow-md italic tracking-widest
          dark:from-cyan-300 dark:via-blue-400 dark:to-blue-600 dark:text-transparent"
                >
                    Lịch sử tham gia sự kiện
                </h2>

                <table className="min-w-full border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg overflow-hidden">
                    <thead>
                        <tr className="bg-gradient-to-r from-cyan-400 via-blue-500 to-blue-700 dark:from-cyan-600 dark:via-blue-700 dark:to-blue-900 text-white">
                            <th className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-lg">Tên sự kiện</th>
                            <th className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-lg">CLB</th>
                            <th className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-lg">Thời gian</th>
                            <th className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-lg">Nội dung</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sampleEvents.map((event) => (
                            <tr key={event.id} className="hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-300">
                                <td className="px-6 py-4 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-200 text-lg">{event.name}</td>
                                <td className="px-6 py-4 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-200 text-lg">{event.clubName}</td>
                                <td className="px-6 py-4 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-200 text-lg">
                                    {new Date(event.startAt).toLocaleString("vi-VN")} -{" "}
                                    {new Date(event.endAt).toLocaleString("vi-VN")}
                                </td>
                                <td className="px-6 py-4 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-200 text-lg">{event.content}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* CSS animation */}
            <style>
                {`
          @keyframes floatingGlow {
            0% { transform: translateY(0) scale(1); opacity: 0.8; box-shadow: 0 0 8px #facc15; }
            50% { opacity: 1; box-shadow: 0 0 15px #facc15; }
            100% { transform: translateY(-120vh) scale(1.2); opacity: 0; box-shadow: 0 0 25px #facc15; }
          }
          .animate-floatingGlow {
            animation: floatingGlow linear infinite;
          }
        `}
            </style>
        </div>
    );
};

export default Histo;
