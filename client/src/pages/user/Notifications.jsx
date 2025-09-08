import React, { useEffect, useState } from "react";
import axios from "axios";
import { format } from "date-fns";
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
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
        <Bell className="text-blue-600" /> Thông báo của bạn
      </h2>

      {notifications.length === 0 ? (
        <p className="text-gray-500">Bạn chưa có thông báo nào.</p>
      ) : (
        <div className="grid gap-4">
          {notifications.map((note) => (
            <div
              key={note._id}
              className="p-4 border rounded-xl shadow-sm bg-white hover:shadow-md transition"
            >
              {/* Tiêu đề */}
              <h3 className="text-lg font-semibold text-blue-600 mb-1">
                {note.title}
              </h3>

              {/* Nội dung */}
              <p className="text-gray-700 mb-3">{note.content}</p>

              {/* File đính kèm nếu có */}
              {note.file && (
                <p className="mb-3 text-sm">
                  📎{" "}
                  <a
                    href={note.file}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 underline"
                  >
                    Xem tệp đính kèm
                  </a>
                </p>
              )}

              {/* Thông tin phụ */}
              <div className="flex justify-between text-sm text-gray-500">
                <span>
                  📅 {format(new Date(note.createdAt), "dd/MM/yyyy HH:mm")}
                </span>
                <span>👤 {note.sender}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
