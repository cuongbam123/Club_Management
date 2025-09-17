// src/pages/EventDetail.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const API_URL = process.env.REACT_APP_API_URL;

export default function EventDetail() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [event, setEvent] = useState(null);
    const [isRegistered, setIsRegistered] = useState(false);
    const [loading, setLoading] = useState(true);

    const user = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("token");

    // Lấy chi tiết sự kiện
    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const res = await axios.get(`${API_URL}/events/${id}`);
                setEvent(res.data);

                if (user && token) {
                    const statusRes = await axios.get(
                        `${API_URL}/events/${id}/registration-status`,
                        { headers: { Authorization: `Bearer ${token}` } }
                    );
                    setIsRegistered(statusRes.data.registered);
                }
            } catch (err) {
                console.error(err);
                toast.error("Không tải được sự kiện!");
            } finally {
                setLoading(false);
            }
        };

        fetchEvent();
    }, [id, user, token]);

    const handleRegister = async () => {
        if (!user || !token) {
            toast.warning("Bạn cần đăng nhập để đăng ký!");
            navigate("/login");
            return;
        }
        try {
            await axios.post(
                `${API_URL}/events/${id}/register`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setIsRegistered(true);
            toast.success("Đăng ký thành công!");
        } catch (err) {
            console.error(err);
            toast.error("Đăng ký thất bại!");
        }
    };

    const handleCancel = async () => {
        try {
            await axios.delete(`${API_URL}/events/${id}/register`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setIsRegistered(false);
            toast.info("Đã hủy đăng ký!");
        } catch (err) {
            console.error(err);
            toast.error("Hủy đăng ký thất bại!");
        }
    };

    const formatDate = (date) =>
        date
            ? new Date(date).toLocaleString("vi-VN", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
            })
            : "Chưa có";

    if (loading)
        return <p className="p-6 text-center text-gray-600">Đang tải sự kiện...</p>;
    if (!event)
        return <p className="p-6 text-center text-red-500">Không tìm thấy sự kiện.</p>;

    const hasEnded = event.endAt && new Date(event.endAt) < new Date();

    return (
        <div
            className="
    min-h-screen p-6 
    bg-white 
    dark:bg-[url('https://png.pngtree.com/background/20210709/original/pngtree-painted-flowers-good-moon-mid-autumn-night-background-material-picture-image_933642.jpg')] 
    dark:bg-cover dark:bg-center dark:bg-fixed 
    relative
  "
        >
            {/* Overlay chỉ hiện ở dark mode */}
            <div className="hidden dark:block absolute inset-0 bg-black/10"></div>
            <div className="max-w-4xl mx-auto bg-white dark:bg-gray-900 rounded-3xl shadow-xl overflow-hidden">
                {/* Ảnh sự kiện */}
                <div className="w-full h-72">
                    <img
                        src={
                            event.bannerUrl
                                ? `${API_URL.replace("/api", "")}${event.bannerUrl}`
                                : "https://placehold.co/800x400"
                        }
                        alt={event.title}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                    />
                </div>

                <div className="p-8">
                    {/* Nút quay lại */}
                    <button
                        className="mb-6 px-5 py-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-lg shadow transition-all"
                        onClick={() => navigate(-1)}
                    >
                        ←
                    </button>

                    {/* Tiêu đề */}
                    <h1 className="text-3xl md:text-4xl font-extrabold mb-6 text-center tracking-wide bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                        {event.title}
                    </h1>

                    {event.clubId && (
                        <p className="text-transparent bg-clip-text 
                 bg-gradient-to-r from-blue-400 via-blue-600 to-blue-800 
                 text-base md:text-lg mb-3 font-semibold">
                            {event.clubId.name}
                        </p>
                    )}

                    {/* Thông tin chi tiết */}
                    <div className="mt-6 space-y-4 text-lg">
                        <div className="p-4 rounded-xl bg-gray-100 dark:bg-gray-900 shadow-md">
                            <span className="font-bold text-xl text-transparent bg-clip-text 
                     bg-gradient-to-r from-green-400 via-green-600 to-green-800">
                                Địa chỉ:
                            </span>{" "}
                            <span className="text-gray-700 dark:text-gray-300">
                                {event.location || "Chưa cập nhật"}
                            </span>
                        </div>

                        <div className="p-4 rounded-xl bg-gray-100 dark:bg-gray-900 shadow-md">
                            <span className="font-bold text-xl text-transparent bg-clip-text 
                     bg-gradient-to-r from-purple-400 via-purple-600 to-purple-800">
                                Bắt đầu:
                            </span>{" "}
                            <span className="text-gray-700 dark:text-gray-300">
                                {formatDate(event.startAt)}
                            </span>
                        </div>

                        <div className="p-4 rounded-xl bg-gray-100 dark:bg-gray-900 shadow-md">
                            <span className="font-bold text-xl text-transparent bg-clip-text 
                     bg-gradient-to-r from-pink-400 via-pink-600 to-pink-800">
                                Kết thúc:
                            </span>{" "}
                            <span className="text-gray-700 dark:text-gray-300">
                                {formatDate(event.endAt)}
                            </span>
                        </div>

                        <div className="p-4 rounded-xl bg-gray-100 dark:bg-gray-900 shadow-md">
                            <span className="font-bold text-xl text-transparent bg-clip-text 
                     bg-gradient-to-r from-orange-400 via-orange-600 to-orange-800">
                                Số lượng:
                            </span>{" "}
                            <span className="text-gray-700 dark:text-gray-300">
                                {event.participantsCount}/{event.capacity}
                            </span>
                        </div>

                        <div className="p-4 rounded-xl bg-gray-100 dark:bg-gray-900 shadow-md">
                            <span className="font-bold text-xl text-transparent bg-clip-text 
                     bg-gradient-to-r from-teal-400 via-teal-600 to-teal-800">
                                Mô tả:
                            </span>{" "}
                            <span className="text-gray-700 dark:text-gray-300">
                                {event.description}
                            </span>
                        </div>
                    </div>


                    {/* Nút đăng ký */}
                    {!hasEnded && (
                        <div className="mt-8">
                            {user ? (
                                isRegistered ? (
                                    <button
                                        onClick={handleCancel}
                                        className="px-8 py-3 bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white font-semibold rounded-xl shadow-md transition transform hover:scale-105"
                                    >
                                        Hủy đăng ký
                                    </button>
                                ) : (
                                    <button
                                        onClick={handleRegister}
                                        className="px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold rounded-xl shadow-md transition transform hover:scale-105"
                                    >
                                        Đăng ký tham gia
                                    </button>
                                )
                            ) : (
                                <button
                                    onClick={() => navigate("/login")}
                                    className="px-8 py-3 bg-gray-500 hover:bg-gray-600 text-white font-semibold rounded-xl shadow-md transition"
                                >
                                    Đăng nhập để đăng ký
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
