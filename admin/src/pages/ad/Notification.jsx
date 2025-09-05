import React, { useEffect, useState } from "react";

const Notification = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("Chưa đăng nhập");

        // ⚠️ Chỉ thêm /notifications/me thôi, không lặp /api
        const res = await fetch(
          `${process.env.REACT_APP_API_URL}/notifications/me`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!res.ok) throw new Error("Không thể tải thông báo");
        const data = await res.json();
        setNotifications(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  if (loading) return <p className="p-4 text-center">Đang tải thông báo...</p>;

  if (notifications.length === 0)
    return <p className="p-4 text-center">Chưa có thông báo nào.</p>;

  return (
    <div className="p-6 bg-white dark:bg-gray-900 min-h-screen text-gray-800 dark:text-white">
      <h1 className="text-2xl font-bold mb-6">Thông báo CLB</h1>

      <ul className="space-y-4">
        {notifications.map((n) => (
          <li
            key={n._id}
            onClick={() => setSelected(n)}
            className="p-4 border rounded bg-gray-100 dark:bg-gray-800 shadow cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700"
          >
            <h2 className="text-lg font-semibold line-clamp-1">
              {n.message?.slice(0, 50)}...
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Ngày gửi:{" "}
              {new Date(n.createdAt || n.sentAt).toLocaleString("vi-VN")}
            </p>
          </li>
        ))}
      </ul>

      {selected && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-900 p-6 rounded shadow-lg w-full max-w-2xl relative">
            <button
              onClick={() => setSelected(null)}
              className="absolute top-3 right-3 text-gray-600 dark:text-gray-300 font-bold"
            >
              X
            </button>
            <h2 className="text-2xl font-bold mb-2">Chi tiết thông báo</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Ngày gửi:{" "}
              {new Date(selected.createdAt || selected.sentAt).toLocaleString(
                "vi-VN"
              )}
            </p>
            <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded whitespace-pre-line">
              {selected.message}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Notification;
