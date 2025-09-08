// src/components/Histo.jsx
import React from "react";

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
    return (
        <div className="flex flex-col items-center min-h-screen bg-gray-100 dark:bg-gray-900 p-4 pt-20">
            <div className="w-full max-w-4xl p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
                <h2 className="text-4xl font-extrabold mb-8 text-center
                    bg-gradient-to-r from-cyan-400 via-blue-500 to-blue-800
                    bg-clip-text text-transparent drop-shadow-md italic tracking-widest
                    dark:text-white"
                >
                    Lịch sử tham gia sự kiện
                </h2>

                <table className="min-w-full border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm">
                    <thead>
                        <tr className="bg-gradient-to-r from-cyan-400 via-blue-500 to-blue-700 text-white">
                            <th className="px-4 py-2 border">Tên sự kiện</th>
                            <th className="px-4 py-2 border">CLB</th>
                            <th className="px-4 py-2 border">Thời gian</th>
                            <th className="px-4 py-2 border">Nội dung</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sampleEvents.map((event) => (
                            <tr key={event.id} className="hover:bg-gray-100 dark:hover:bg-gray-700">
                                <td className="px-4 py-2 border text-gray-900 dark:text-white">{event.name}</td>
                                <td className="px-4 py-2 border text-gray-900 dark:text-white">{event.clubName}</td>
                                <td className="px-4 py-2 border text-gray-900 dark:text-white">
                                    {new Date(event.startAt).toLocaleString("vi-VN")} -{" "}
                                    {new Date(event.endAt).toLocaleString("vi-VN")}
                                </td>
                                <td className="px-4 py-2 border text-gray-900 dark:text-white">{event.content}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Histo;
