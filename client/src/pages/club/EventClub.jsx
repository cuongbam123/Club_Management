import React, { useEffect, useState } from "react";
import axios from "axios";
import EventCard from "../../components/EventCard";
import { makeFullUrl } from "../../utils/urls";

const API = process.env.REACT_APP_API_URL || "http://localhost:3001/api";

export default function EventClub({ club }) {
  const [clubDetail, setClubDetail] = useState(null);
  const [clubEvents, setClubEvents] = useState([]);

  // 🔹 Lấy chi tiết CLB
  useEffect(() => {
    const fetchClubDetail = async () => {
      try {
        const res = await axios.get(`${API}/clubs/${club._id}`);
        setClubDetail(res.data);
      } catch (err) {
        console.error("Error fetch club detail:", err);
      }
    };

    if (club?._id) fetchClubDetail();
  }, [club]);

  // 🔹 Lấy danh sách sự kiện
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await axios.get(`${API}/events?clubId=${club._id}`);
        const events = res.data || [];

        // 🟢 sort theo trạng thái
        const statusPriority = {
          ongoing: 1,
          upcoming: 2,
          finished: 3,
          cancelled: 4,
        };

        const sortedEvents = [...events].sort((a, b) => {
          const pa = statusPriority[a.status] || 99;
          const pb = statusPriority[b.status] || 99;
          return pa - pb;
        });

        setClubEvents(sortedEvents);
      } catch (err) {
        console.error("Error fetch events:", err);
      }
    };

    if (club?._id) fetchEvents();
  }, [club]);

  if (!club) {
    return <p className="text-center mt-10">CLB không tồn tại.</p>;
  }

  return (
    <div
      className="relative min-h-screen
        bg-white
        dark:bg-[url('https://png.pngtree.com/thumb_back/fw800/background/20190221/ourmid/pngtree-mid-autumn-festival-mid-autumn-festival-mid-autumn-material-full-of-image_11694.jpg')]
        dark:bg-cover dark:bg-center dark:bg-fixed
        transition-colors duration-500"
    >
      <div className="relative z-10">
        <div
          className="p-6 text-center shadow-lg mb-12 
                     bg-gray-100 dark:bg-gray-800 rounded-xl"
          style={{ width: "1200px", margin: "0 auto 40px auto" }}
        >
          <h1 className="text-4xl font-bold mb-2 text-gray-900 dark:text-white">
            {clubDetail?.name || club.name}
          </h1>

          <img
            src={makeFullUrl(clubDetail?.logoUrl || club.logoUrl) || "/fallback.png"}
            alt={clubDetail?.name || club.name}
            className="mb-6 shadow-lg rounded-lg"
            style={{ width: "100%", height: "auto", maxHeight: "500px" }}
          />

          <p className="text-gray-600 dark:text-gray-300 mb-2">
            <strong>Chủ nhiệm:</strong>{" "}
            {clubDetail?.president?.name || "Chưa có"}
          </p>
          <p className="text-gray-700 dark:text-gray-200 mb-6">
            {clubDetail?.description || club.description}
          </p>
        </div>

        <div
          className="p-6 max-w-5xl mx-auto min-h-screen 
                         bg-white dark:bg-gray-700 rounded-xl shadow-2xl"
        >
          <h2
            className="text-4xl font-extrabold mb-12 text-center
                       bg-gradient-to-r from-cyan-400 via-blue-500 to-blue-800
                       bg-clip-text text-transparent drop-shadow-md italic tracking-widest"
          >
            {`Sự kiện của ${clubDetail?.name || club.name}`}
          </h2>

          {clubEvents.length > 0 ? (
            <div className="grid gap-8 grid-cols-1">
              {clubEvents.map((event) => (
                <EventCard key={event._id} event={event} />
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 dark:text-gray-300 text-lg">
              Chưa có sự kiện nào cho CLB này.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
