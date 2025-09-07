import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart, Bar, LineChart, Line,
  XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer
} from "recharts";
import { toast } from "react-toastify";

const API_URL = "http://localhost:3001/api";

export default function DashboardLeader() {
  const [eventStats, setEventStats] = useState([]);
  const [memberStats, setMemberStats] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res1 = await axios.get(`${API_URL}/statistics/events`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setEventStats(res1.data);

        const res2 = await axios.get(`${API_URL}/statistics/members-weekly`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setMemberStats(res2.data);
      } catch (err) {
        console.error("❌ Lỗi tải thống kê:", err);
        toast.error("Không tải được thống kê");
      }
    };

    fetchStats();
  }, [token]);

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-2xl font-bold mb-6">Dashboard Leader</h1>

      {/* Thống kê sự kiện */}
      <div className="bg-white p-6 rounded-2xl shadow-md">
        <h2 className="text-xl font-semibold mb-4">Thống kê sự kiện</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={eventStats}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="dangKy" fill="#8884d8" name="Số đăng ký" />
            <Bar dataKey="thamGia" fill="#82ca9d" name="Số tham gia" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Thống kê thành viên */}
      <div className="bg-white p-6 rounded-2xl shadow-md">
        <h2 className="text-xl font-semibold mb-4">Thống kê thành viên (7 ngày gần nhất)</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={memberStats}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="thanhVien" stroke="#8884d8" strokeWidth={3} name="Thành viên mới" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
