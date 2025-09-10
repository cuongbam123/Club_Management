// src/pages/EventList.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import EventCard from "../../components/EventCard";

const API = process.env.REACT_APP_API_URL || "http://localhost:3001/api";

export default function EventList() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await axios.get(`${API}/events`);
        const all = res.data || [];

        // lọc ra sự kiện sắp diễn ra
        const upcomingEvents = all.filter((e) => e.status === "upcoming");

        // sắp xếp theo thời gian bắt đầu (gần nhất lên đầu)
        upcomingEvents.sort(
          (a, b) => new Date(a.startAt).getTime() - new Date(b.startAt).getTime()
        );

        setEvents(upcomingEvents);
      } catch (err) {
        console.error("Error fetch events:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (loading) {
    return <p className="text-center mt-10">Đang tải sự kiện...</p>;
  }

  return (
    <div
      className="relative min-h-screen p-6
        bg-white
        dark:bg-[url('https://noithatbinhminh.com.vn/wp-content/uploads/2023/08/background-trung-thu-08.jpg')]
        dark:bg-cover dark:bg-center dark:bg-fixed
        transition-colors duration-500"
    >
      <div className="relative z-10 max-w-5xl mx-auto bg-white dark:bg-black shadow-2xl rounded-xl p-6 mt-8">
        <h2
          className="text-4xl font-extrabold mt-5 mb-12 text-center
            bg-gradient-to-r from-cyan-400 via-blue-500 to-blue-800
            bg-clip-text text-transparent drop-shadow-md italic tracking-widest"
        >
          Sự kiện sắp diễn ra
        </h2>

        {events.length > 0 ? (
          <div className="grid gap-8 grid-cols-1">
            {events.map((event) => (
              <EventCard key={event._id} event={event} />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 dark:text-gray-300 text-lg">
            Hiện tại chưa có sự kiện sắp diễn ra.
          </p>
        )}
      </div>
    </div>
  );
}
