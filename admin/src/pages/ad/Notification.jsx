import React, { useEffect, useState } from "react";

const Notification = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null); // thông báo đang xem chi tiết

  // Mock data để test
  const mockNotifications = [
    {
      _id: "1",
      title: "Thông báo họp CLB",
      creator: { name: "Nguyễn Văn A" },
      create_time: "2025-09-01T09:00:00",
      target: "Toàn CLB",
      content: "Chúng ta sẽ họp vào lúc 18h tại phòng A101.",
    },
    {
      _id: "2",
      title: "Thông báo đăng ký sự kiện",
      creator: { name: "Trần Thị B" },
      create_time: "2025-09-02T14:30:00",
      target: "Thành viên tham gia",
      content: "Hãy đăng ký tham gia sự kiện Teambuilding trước ngày 5/9.",
    },
    {
      _id: "3",
      title: "Thông báo kết thúc CLB",
      creator: { name: "Lê Văn C" },
      create_time: "2025-08-31T10:00:00",
      target: "Toàn CLB",
      content: "CLB sẽ tạm dừng hoạt động từ ngày 1/9 đến 15/9.",
    },
  ];

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setNotifications(mockNotifications);
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
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
            <h2 className="text-xl font-semibold">{n.title}</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Người tạo: {n.creator?.name} | Ngày:{" "}
              {new Date(n.create_time).toLocaleString("vi-VN")}
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
            <h2 className="text-2xl font-bold mb-2">{selected.title}</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Người tạo: {selected.creator?.name} | Ngày:{" "}
              {new Date(selected.create_time).toLocaleString("vi-VN")} | Đối tượng:{" "}
              {selected.target}
            </p>
            <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded">{selected.content}</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Notification;
