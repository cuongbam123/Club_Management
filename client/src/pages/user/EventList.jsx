// src/pages/EventList.jsx
import React from "react";
import EventCard from "../../components/EventCard";
import { allEvents } from "../../eventsData"; // import dữ liệu chung

export default function EventList() {
    return (
        <div
            className="
                relative min-h-screen p-6
                bg-white
                dark:bg-[url('https://noithatbinhminh.com.vn/wp-content/uploads/2023/08/background-trung-thu-08.jpg')]
                dark:bg-cover dark:bg-center dark:bg-fixed
                transition-colors duration-500
            "
        >
            {/* Nội dung chính */}
            <div className="relative z-10 max-w-5xl mx-auto bg-white dark:bg-black shadow-2xl rounded-xl p-6 mt-8">
                <h2
                    className="text-4xl font-extrabold mt-5 mb-12 text-center
                        bg-gradient-to-r from-cyan-400 via-blue-500 to-blue-800
                        bg-clip-text text-transparent drop-shadow-md italic tracking-widest"
                >
                    Danh sách tất cả sự kiện
                </h2>

                <div className="grid gap-8 grid-cols-1">
                    {allEvents.map((event) => (
                        <EventCard key={event.id} event={event} />
                    ))}
                </div>
            </div>
        </div>
    );
}
