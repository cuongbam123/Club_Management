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

        // Nếu có user thì mới check status
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

  if (loading) return <p className="p-6">Đang tải sự kiện...</p>;
  if (!event) return <p className="p-6">Không tìm thấy sự kiện.</p>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <img
        src={
          event.bannerUrl
            ? `${API_URL.replace("/api", "")}${event.bannerUrl}`
            : "https://placehold.co/800x400"
        }
        alt={event.title}
        className="w-full h-64 object-cover rounded-2xl shadow"
      />

      <h1 className="mt-6 text-3xl font-bold">{event.title}</h1>
      <p className="mt-2 text-gray-700 whitespace-pre-line">
        {event.description}
      </p>

      <div className="mt-6 space-y-2 text-gray-600">
        <p>
          <strong>Bắt đầu:</strong>{" "}
          {event.startAt ? new Date(event.startAt).toLocaleString("vi-VN") : "Chưa có"}
        </p>
        <p>
          <strong>Kết thúc:</strong>{" "}
          {event.endAt ? new Date(event.endAt).toLocaleString("vi-VN") : "Chưa có"}
        </p>
        <p>
          <strong>Số lượng:</strong> {event.participantsCount}/{event.capacity}
        </p>
      </div>

      <div className="mt-8">
        {user ? (
          isRegistered ? (
            <button
              onClick={handleCancel}
              className="px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700"
            >
              Hủy đăng ký
            </button>
          ) : (
            <button
              onClick={handleRegister}
              className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700"
            >
              Đăng ký tham gia
            </button>
          )
        ) : (
          <button
            onClick={() => navigate("/login")}
            className="px-6 py-3 bg-gray-500 text-white rounded-xl hover:bg-gray-600"
          >
            Đăng nhập để đăng ký
          </button>
        )}
      </div>
    </div>
  );
}
