// src/components/Histo.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;

const Histo = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setDarkMode(localStorage.getItem("theme") === "dark");
  }, []);

  // 🟢 Hàm tính trạng thái
  const getEventStatus = (event) => {
    if (event.isCanceled) return "Đã hủy";

    const now = new Date();
    const start = new Date(event.startAt);
    const end = new Date(event.endAt);

    if (now < start) return "Sắp bắt đầu";
    if (now >= start && now <= end) return "Đang diễn ra";
    if (now > end) return "Đã kết thúc";
    return "Không xác định";
  };

  // 🟢 Gọi API lấy lịch sử sự kiện
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${API_URL}/registrations/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setEvents(res.data);
      } catch (err) {
        console.error("Error fetch history:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen text-xl dark:text-white">
        Đang tải lịch sử sự kiện...
      </div>
    );
  }

  return (
    <div className="relative flex flex-col items-center min-h-screen overflow-hidden bg-gray-100 dark:bg-gray-900 transition-colors duration-500">
      {/* Mặt trăng góc trái chỉ khi darkMode */}
      {darkMode && (
        <div className="absolute top-8 left-8 w-20 h-20">
          <div className="w-full h-full rounded-full bg-gray-100 shadow-2xl animate-pulse"></div>
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
      <div className="relative w-full max-w-6xl p-8 bg-white dark:bg-gray-800 rounded-xl shadow-2xl transition-colors duration-500 z-10 mt-32">
        <h2
          className="text-5xl font-extrabold mb-10 text-center
          bg-gradient-to-r from-cyan-400 via-blue-500 to-blue-800
          bg-clip-text text-transparent drop-shadow-md italic tracking-widest
          dark:from-cyan-300 dark:via-blue-400 dark:to-blue-600 dark:text-transparent"
        >
          Lịch sử tham gia sự kiện
        </h2>

        {events.length === 0 ? (
          <p className="text-center text-gray-600 dark:text-gray-300 text-lg">
            Bạn chưa tham gia sự kiện nào.
          </p>
        ) : (
          <table className="min-w-full border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg overflow-hidden">
            <thead>
              <tr className="bg-gradient-to-r from-cyan-400 via-blue-500 to-blue-700 dark:from-cyan-600 dark:via-blue-700 dark:to-blue-900 text-white">
                <th className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-lg">
                  Tên sự kiện
                </th>
                <th className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-lg">
                  CLB
                </th>
                <th className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-lg">
                  Thời gian
                </th>
                <th className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-lg">
                  Nội dung
                </th>
                <th className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-lg">
                  Trạng thái
                </th>
              </tr>
            </thead>
            <tbody>
              {events.map((reg) => (
                <tr
                  key={reg.id}
                  className="hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-300"
                >
                  <td className="px-6 py-4 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-200 text-lg">
                    {reg.event?.title}
                  </td>
                  <td className="px-6 py-4 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-200 text-lg">
                    {reg.event?.clubName || "—"}
                  </td>
                  <td className="px-6 py-4 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-200 text-lg">
                    {reg.event?.startAt
                      ? new Date(reg.event.startAt).toLocaleString("vi-VN")
                      : "—"}{" "}
                    -{" "}
                    {reg.event?.endAt
                      ? new Date(reg.event.endAt).toLocaleString("vi-VN")
                      : "—"}
                  </td>
                  <td className="px-6 py-4 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-200 text-lg">
                    {reg.event?.description || "—"}
                  </td>
                  <td className="px-6 py-4 border border-gray-300 dark:border-gray-600 text-center">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        reg.event?.status === "cancelled"
                          ? "bg-red-200 text-red-800"
                          : reg.event?.status === "finished"
                          ? "bg-gray-300 text-gray-700"
                          : reg.event?.status === "upcoming"
                          ? "bg-yellow-200 text-yellow-800"
                          : "bg-green-200 text-green-800"
                      }`}
                    >
                      {reg.event?.status === "cancelled"
                        ? "Đã hủy"
                        : reg.event?.status === "finished"
                        ? "Đã kết thúc"
                        : reg.event?.status === "upcoming"
                        ? "Sắp bắt đầu"
                        : "Đang diễn ra"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
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
