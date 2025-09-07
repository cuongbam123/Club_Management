import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { allEvents } from "../eventsData";
import { toast } from "react-toastify";

export default function EventDetail() {
    const { id } = useParams();
    const navigate = useNavigate();

    const eventData = allEvents.find((e) => e.id === id);
    const [registered, setRegistered] = useState(eventData?.registered || false);

    if (!eventData) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
                <h2 className="text-3xl font-bold text-red-500">Không tìm thấy sự kiện</h2>
                <button
                    className="mt-6 px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-md transition"
                    onClick={() => navigate(-1)}
                >
                    ← Quay lại
                </button>
            </div>
        );
    }

    const handleRegisterToggle = () => {
        setRegistered(!registered);

        const eventIndex = allEvents.findIndex((e) => e.id === id);
        if (eventIndex !== -1) {
            allEvents[eventIndex].registered = !registered;
        }

        if (!registered) {
            toast.success("Đăng ký sự kiện thành công! 🎉");
        } else {
            toast.info("Bạn đã hủy đăng ký sự kiện. ⚠️");
        }
    };

    return (
        <div
            className="p-6 max-w-5xl mx-auto min-h-screen"
            style={{
                background: "linear-gradient(to bottom right, #e0f2fe, #f0f9ff)",
            }}
        >
            <button
                className="mb-6 px-5 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl shadow hover:opacity-90 transition"
                onClick={() => navigate(-1)}
            >
                ←
            </button>

            <div className="bg-white rounded-3xl shadow-2xl p-8">
                {eventData.imageUrl && (
                    <div className="w-full h-72 rounded-2xl overflow-hidden mb-6">
                        <img
                            src={eventData.imageUrl}
                            alt={eventData.name}
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                        />
                    </div>
                )}

                <h2 className="text-4xl font-extrabold mb-2 leading-snug text-center
    bg-gradient-to-r from-cyan-600 via-blue-700 to-blue-900
    bg-clip-text text-transparent drop-shadow-md italic tracking-widest
    transition-all duration-500 hover:bg-gradient-to-r hover:from-cyan-500 hover:via-blue-600 hover:to-blue-800">
                    {eventData.name}
                </h2>



                <div className="space-y-2 mb-6 text-lg">
                    <p className="text-gray-700 text-lg mb-2">
                        <span className="font-bold text-gray-700 drop-shadow-md">
                            CLB tổ chức:
                        </span>{" "}
                        <span className="font-bold text-gray-700 drop-shadow-md">{eventData.club}</span>
                    </p>

                    <p className="text-gray-700 text-lg mb-2">
                        <span className="font-bold text-gray-700 drop-shadow-md">
                            Thời gian:
                        </span>{" "}
                        <span className="font-bold text-gray-700 drop-shadow-md">
                            {eventData.startAt
                                ? new Date(eventData.startAt).toLocaleString("vi-VN", {
                                    day: "2-digit",
                                    month: "2-digit",
                                    year: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit"
                                })
                                : "Chưa có"}{" "}
                            -{" "}
                            {eventData.endAt
                                ? new Date(eventData.endAt).toLocaleString("vi-VN", {
                                    day: "2-digit",
                                    month: "2-digit",
                                    year: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit"
                                })
                                : "Chưa có"}
                        </span>
                    </p>


                    <p
                        className={`font-semibold text-transparent bg-clip-text drop-shadow-md ${eventData.status === "upcoming"
                            ? "bg-gradient-to-r from-green-400 via-green-600 to-green-800"
                            : eventData.status === "ongoing"
                                ? "bg-gradient-to-r from-orange-400 via-orange-600 to-orange-800"
                                : "bg-gradient-to-r from-gray-400 via-gray-500 to-gray-700"
                            }`}
                    >
                        Trạng thái: {eventData.status.toUpperCase()}
                    </p>

                </div>

                {/* Chỉ hiện nút nếu sự kiện sắp diễn ra */}
                {eventData.status === "upcoming" && (
                    <button
                        className={`mb-6 px-8 py-3 rounded-xl text-white text-lg font-semibold shadow-md transition transform ${registered
                            ? "bg-gradient-to-r from-red-400 to-red-600 hover:from-red-400 hover:to-red-800 hover:scale-105"
                            : "bg-gradient-to-r from-green-300 to-emerald-600 hover:from-green-400 hover:to-emerald-700 hover:scale-105"
                            }`}
                        onClick={handleRegisterToggle}
                    >
                        {registered ? "Hủy đăng ký" : "Đăng ký ngay"}
                    </button>
                )}

                <div className="mt-8 text-gray-700 leading-relaxed">
                    <h3 className="text-2xl font-bold text-gray-800 mb-3">Chi tiết sự kiện</h3>
                    <p>
                        Đây là chi tiết của sự kiện{" "}
                        <strong className="text-indigo-600">{eventData.name}</strong>.
                        Bạn có thể thêm thông tin chi tiết hơn về lịch trình, địa điểm,
                        và nội dung hoạt động tại đây để người tham gia nắm rõ hơn.
                    </p>
                </div>
            </div>
        </div>
    );
}
