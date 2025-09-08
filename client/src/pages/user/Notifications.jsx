import React, { useEffect, useState } from "react";
import axios from "axios";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { toast } from "react-toastify";
import { Bell } from "lucide-react";

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const API_URL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token"); // 👈 JWT
        const res = await axios.get(`${API_URL}/notifications/my`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setNotifications(res.data);
      } catch (err) {
        console.error("Error fetching notifications:", err);
        toast.error("Không lấy được thông báo");
      }
    };
    fetchData();
  }, [API_URL]);

  return (
    <div className="min-h-screen p-6 bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
      {/* Tiêu đề */}
      <h2
        className="text-4xl font-extrabold mt-5 mb-12 text-center
             bg-gradient-to-r from-cyan-400 via-blue-500 to-blue-800
             bg-clip-text text-transparent drop-shadow-md italic tracking-widest flex items-center justify-center gap-3"
      >
        <Bell className="w-8 h-8 text-blue-500 drop-shadow-md" />
        Thông báo của bạn
      </h2>


      {notifications.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400 text-lg">
          Bạn chưa có thông báo nào.
        </p>
      ) : (
        <div className="space-y-4 w-full flex flex-col items-center">
          {notifications.map((note) => (
            <div
              key={note._id}
              className="w-full max-w-[950px] p-6 border border-gray-200 dark:border-gray-700 
             rounded-xl shadow-sm bg-white dark:bg-gray-800 
             hover:shadow-md hover:-translate-y-0.5 
             transition-all duration-300"
            >
              {/* Tiêu đề */}
              <h3 className="text-xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                {note.title}
              </h3>

              {/* Nội dung */}
              <p className="text-base text-gray-700 dark:text-gray-200 mb-3 leading-relaxed">
                {note.content}
              </p>

              {/* File đính kèm */}
              {note.file && (
                <p className="mb-3 text-sm">
                  📎{" "}
                  <a
                    href={note.file}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 dark:text-blue-300 underline hover:text-blue-700"
                  >
                    Xem tệp đính kèm
                  </a>
                </p>
              )}

              {/* Thông tin phụ */}
              <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700 pt-3">
                <span>
                  📅{" "}
                  {format(new Date(note.createdAt), "dd/MM/yyyy HH:mm", {
                    locale: vi,
                  })}
                </span>
                <span className="font-medium">👤 {note.sender}</span>
              </div>
            </div>

          ))}
        </div>
      )}
    </div>
  );
}
