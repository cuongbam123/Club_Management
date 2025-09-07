// src/pages/EventList.jsx
import React from "react";
import EventCard from "../../components/EventCard";
import { allEvents } from "../../eventsData"; // import dữ liệu chung

export default function EventList() {
    return (
        <div
            className="
                min-h-screen 
                bg-white 
                dark:bg-[url('https://noithatbinhminh.com.vn/wp-content/uploads/2023/08/background-trung-thu-08.jpg')] 
                dark:bg-cover dark:bg-center
            "
        >
            {/* khối nội dung chính */}
            <div className="p-6 max-w-5xl mx-auto bg-white dark:bg-gray-900 shadow-2xl rounded-xl">

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
