import React from "react";
import { useNavigate } from "react-router-dom";

export default function EventCard({ event }) {
    const navigate = useNavigate();

    return (
        <div
            className="p-3 rounded-2xl shadow-md hover:shadow-xl cursor-pointer 
             transition-all duration-300 transform hover:-translate-y-1 flex flex-col justify-between 
             w-full max-w-[976px] h-[400px] 
             bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            onClick={() => navigate(`/events/${event.id}`)}
        >
            {/* Hình ảnh */}
            {event.imageUrl && (
                <div className="w-full h-3/4 overflow-hidden rounded-xl mb-3">
                    <img
                        src={event.imageUrl}
                        alt={event.name}
                        className="w-full h-full object-cover"
                    />
                </div>
            )}

            {/* Nội dung */}
            <div>
                <h3
                    className="text-xl font-extrabold mb-2 leading-snug
                    bg-gradient-to-r from-cyan-600 via-blue-700 to-blue-900
                    bg-clip-text text-transparent drop-shadow-md
                    dark:from-cyan-300 dark:via-blue-400 dark:to-blue-600"
                >
                    {event.name}
                </h3>

                {event.club && (
                    <p className="text-blue-500 dark:text-blue-300 text-sm mb-1 font-medium">
                        {event.club}
                    </p>
                )}

                <p className="text-gray-500 dark:text-gray-400 text-sm mb-1">
                    {event.startAt} - {event.endAt}
                </p>

                <p
                    className={`text-sm font-semibold mb-3 ${event.status === "upcoming"
                            ? "text-green-500 dark:text-green-400"
                            : event.status === "ongoing"
                                ? "text-orange-500 dark:text-orange-400"
                                : "text-gray-400 dark:text-gray-500"
                        }`}
                >
                    {event.status.toUpperCase()}
                </p>

                {event.registered && (
                    <p className="text-white bg-gradient-to-r from-purple-500 to-indigo-600 inline-block px-3 py-1 rounded-full text-sm font-semibold shadow-md">
                        Đã đăng ký
                    </p>
                )}
            </div>
        </div>
    );
}
