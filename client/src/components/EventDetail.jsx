// src/pages/EventDetail.jsx
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
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900">
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
            className="
                min-h-screen p-6 
                bg-gray-100 
                dark:bg-[url('https://noithatbinhminh.com.vn/wp-content/uploads/2023/08/background-trung-thu-08.jpg')] 
                dark:bg-cover dark:bg-center dark:bg-fixed
            "
        >
            <div className="max-w-5xl mx-auto bg-white dark:bg-gray-900 rounded-3xl shadow-2xl p-8">

                {/* Nút quay lại */}
                <button
                    className="mb-6 px-5 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl shadow hover:opacity-90 transition"
                    onClick={() => navigate(-1)}
                >
                    ←
                </button>

                {/* Ảnh sự kiện */}
                {eventData.imageUrl && (
                    <div className="w-full h-72 rounded-2xl overflow-hidden mb-6">
                        <img
                            src={eventData.imageUrl}
                            alt={eventData.name}
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                        />
                    </div>
                )}

                {/* Tiêu đề */}
                <h2 className="text-4xl font-extrabold mb-6 text-center
                    bg-gradient-to-r from-cyan-600 via-blue-700 to-blue-900
                    bg-clip-text text-transparent drop-shadow-md italic tracking-widest
                    transition-all duration-500 hover:from-cyan-500 hover:via-blue-600 hover:to-blue-800">
                    {eventData.name}
                </h2>

                {/* Thông tin cơ bản */}
                <div className="space-y-2 mb-6 text-lg">
                    <p className="text-gray-700 dark:text-gray-300">
                        <span className="font-bold">CLB tổ chức:</span> {eventData.club}
                    </p>

                    <p className="text-gray-700 dark:text-gray-300">
                        <span className="font-bold">Thời gian:</span>{" "}
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

                {/* Nút đăng ký */}
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

                {/* Chi tiết sự kiện */}
                <div className="mt-8 text-gray-700 dark:text-gray-300 leading-relaxed">
                    <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-3">
                        Chi tiết sự kiện
                    </h3>
                    <p>
                        Đây là chi tiết của sự kiện{" "}
                        <strong className="text-indigo-600 dark:text-indigo-400">
                            {eventData.name}
                        </strong>. Bạn có thể thêm thông tin chi tiết hơn về lịch trình,
                        địa điểm, và nội dung hoạt động tại đây.
                    </p>
                </div>
            </div>
        </div>
    );
}
