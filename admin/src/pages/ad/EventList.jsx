import React, { useState, useEffect } from "react";

const EventList = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Hàm đổi status từ backend -> tiếng Việt + màu
  const getStatusInfo = (status) => {
    switch (status) {
      case "upcoming":
        return {
          label: "Sắp diễn ra",
          className:
            "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
        };
      case "ongoing":
        return {
          label: "Đang diễn ra",
          className:
            "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
        };
      case "finished":
        return {
          label: "Đã kết thúc",
          className:
            "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300",
        };
      default:
        return {
          label: status,
          className: "bg-gray-200 text-gray-800",
        };
    }
  };

  // Hàm format ngày
  const formatDate = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch(
          `${process.env.REACT_APP_API_URL}/events`,
          {
            headers: {
              "Content-Type": "application/json",
              // Nếu API yêu cầu token:
              // "Authorization": `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (!res.ok) throw new Error("Failed to fetch events");
        const data = await res.json();

        // Sắp xếp theo status
        const statusOrder = ["upcoming", "ongoing", "finished"];
        const sorted = data.sort(
          (a, b) => statusOrder.indexOf(a.status) - statusOrder.indexOf(b.status)
        );

        setEvents(sorted);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (loading) return <div className="p-4">Đang tải sự kiện...</div>;

  return (
    <div className="p-4 bg-white dark:bg-gray-900 min-h-full text-gray-800 dark:text-white">
      <h1 className="text-2xl font-bold mb-6">Quản lý sự kiện CLB</h1>

      <table className="min-w-full border rounded-lg overflow-hidden">
        <thead className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-white">
          <tr>
            <th className="border px-4 py-2">ID</th>
            <th className="border px-4 py-2">Tên sự kiện</th>
            <th className="border px-4 py-2">Ngày tổ chức</th>
            <th className="border px-4 py-2">Số người đăng ký</th>
            <th className="border px-4 py-2">Trạng thái</th>
            <th className="border px-4 py-2">CLB tổ chức</th>
          </tr>
        </thead>
        <tbody>
          {events.map((event) => {
            const { label, className } = getStatusInfo(event.status);
            return (
              <tr
                key={event._id}
                className="border-b border-gray-200 dark:border-gray-700"
              >
                <td className="border px-4 py-2">{event._id}</td>
                <td className="border px-4 py-2">{event.title}</td>
                <td className="border px-4 py-2">{formatDate(event.startAt)}</td>
                <td className="border px-4 py-2">{event.participantsCount}</td>
                <td className="border px-4 py-2">
                  <span
                    className={`px-2 py-1 rounded-full text-sm font-medium ${className}`}
                  >
                    {label}
                  </span>
                </td>
                <td className="border px-4 py-2">
                  {event.clubId?.name || "Không rõ"}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default EventList;
