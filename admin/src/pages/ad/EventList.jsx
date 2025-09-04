import React, { useState, useEffect } from "react";

const EventList = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const mockEvents = [
      {
        _id: "1",
        name: "Hội thao CLB Bóng đá",
        date: "2025-09-10",
        participants: 25,
        status: "Sắp diễn ra",
      },
      {
        _id: "2",
        name: "Workshop Kỹ năng mềm",
        date: "2025-08-20",
        participants: 40,
        status: "Đã kết thúc",
      },
      {
        _id: "3",
        name: "Hội thảo Công nghệ mới",
        date: "2025-09-15",
        participants: 30,
        status: "Đang diễn ra",
      },
    ];

    // Sắp xếp theo trạng thái
    const statusOrder = ["Sắp diễn ra", "Đang diễn ra", "Đã kết thúc"];
    mockEvents.sort(
      (a, b) => statusOrder.indexOf(a.status) - statusOrder.indexOf(b.status)
    );

    setEvents(mockEvents);
  }, []);

  return (
    <div className="p-4 bg-white dark:bg-gray-900 min-h-full text-gray-800 dark:text-white">
      <h1 className="text-2xl font-bold mb-6">Quản lý sự kiện CLB</h1>

      <table className="min-w-full border rounded-lg overflow-hidden">
        <thead className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-white">
          <tr>
            <th className="border px-4 py-2">ID</th>
            <th className="border px-4 py-2">Tên sự kiện</th>
            <th className="border px-4 py-2">Ngày tổ chức</th>
            <th className="border px-4 py-2">Số người đăng kí</th>
            <th className="border px-4 py-2">Trạng thái</th>
          </tr>
        </thead>
        <tbody>
          {events.map((event) => (
            <tr
              key={event._id}
              className="border-b border-gray-200 dark:border-gray-700"
            >
              <td className="border px-4 py-2">{event._id}</td>
              <td className="border px-4 py-2">{event.name}</td>
              <td className="border px-4 py-2">{event.date}</td>
              <td className="border px-4 py-2">{event.participants}</td>
              <td className="border px-4 py-2">
                <span
                  className={`px-2 py-1 rounded-full text-sm font-medium ${event.status === "Đang diễn ra"
                    ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                    : event.status === "Sắp diễn ra"
                      ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                      : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                    }`}
                >
                  {event.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EventList;
