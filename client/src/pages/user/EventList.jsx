// src/pages/EventList.jsx
import React from "react";
import EventCard from "../../components/EventCard";
import { allEvents } from "../../eventsData"; // import dữ liệu chung

export default function EventList() {
    return (
        <div
            className="p-6 max-w-5xl mx-auto min-h-screen"
            style={{ background: "linear-gradient(to bottom, #edf6fd, #f0fbff)" }}
        >
            <h2 className="text-4xl font-extrabold mb-12 text-center
    bg-gradient-to-r from-cyan-400 via-blue-500 to-blue-800
    bg-clip-text text-transparent drop-shadow-md italic tracking-widest">
                Danh sách tất cả sự kiện
            </h2>


            <div className="grid gap-8 grid-cols-1">
                {allEvents.map((event) => (
                    <EventCard key={event.id} event={event} />
                ))}
            </div>
        </div>
    );
}
