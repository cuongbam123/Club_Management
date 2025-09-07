import React from "react";
import { useNavigate } from "react-router-dom";

export default function EventCard({ event, onRegister, onUnregister }) {
    const navigate = useNavigate();

    return (
        <div
            className="p-3 bg-white rounded-2xl shadow-md hover:shadow-xl cursor-pointer 
             transition-all duration-300 transform hover:-translate-y-1 flex flex-col justify-between 
             w-full max-w-[976px] h-[400px]"
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
                <h3 className="text-xl font-extrabold mb-2 leading-snug
        bg-gradient-to-r from-cyan-600 via-blue-700 to-blue-900
        bg-clip-text text-transparent drop-shadow-md">
                    {event.name}
                </h3>

                {event.club && (
                    <p className="text-blue-500 text-sm mb-1 font-medium">
                        {event.club}
                    </p>
                )}

                <p className="text-gray-500 text-sm mb-1">
                    {event.startAt} - {event.endAt}
                </p>

                <p
                    className={`text-sm font-semibold mb-3 ${event.status === "upcoming"
                        ? "text-green-500"
                        : event.status === "ongoing"
                            ? "text-orange-500"
                            : "text-gray-400"
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
