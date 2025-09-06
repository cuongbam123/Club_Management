import React from "react";
import {
    BarChart,
    Bar,
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    ResponsiveContainer,
} from "recharts";

export default function DashboardLeader() {
    // Dữ liệu mẫu cho thống kê sự kiện
    const eventStats = [
        { name: "Tháng 1", dangKy: 40, thamGia: 35 },
        { name: "Tháng 2", dangKy: 55, thamGia: 42 },
        { name: "Tháng 3", dangKy: 60, thamGia: 48 },
        { name: "Tháng 4", dangKy: 30, thamGia: 28 },
        { name: "Tháng 5", dangKy: 75, thamGia: 66 },
    ];

    // Dữ liệu mẫu cho thống kê thành viên
    const memberStats = [
        { name: "2021", thanhVien: 45 },
        { name: "2022", thanhVien: 60 },
        { name: "2023", thanhVien: 80 },
        { name: "2024", thanhVien: 95 },
    ];

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
                <h2 className="text-xl font-semibold mb-4">Thống kê thành viên</h2>
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={memberStats}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="thanhVien" stroke="#8884d8" strokeWidth={3} name="Thành viên" />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
