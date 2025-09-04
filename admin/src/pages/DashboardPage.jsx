import React, { useState } from "react";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

const data = [
  { name: "Tháng 1", thanhVien: 40 },
  { name: "Tháng 2", thanhVien: 30 },
  { name: "Tháng 3", thanhVien: 50 },
  { name: "Tháng 4", thanhVien: 70 },
  { name: "Tháng 5", thanhVien: 60 },
  { name: "Tháng 6", thanhVien: 80 },
];

const newMembers = [
  { id: 1, name: "Nguyễn Văn A", club: "CLB Bóng đá", role: "Thành viên", date: "2025-06-25" },
  { id: 2, name: "Trần Thị B", club: "CLB Văn hóa", role: "Thành viên", date: "2025-06-26" },
  { id: 3, name: "Lê Văn C", club: "CLB Bóng đá", role: "Chủ nhiệm", date: "2025-06-24" },
  { id: 4, name: "Phạm Thị D", club: "CLB Âm nhạc", role: "Thành viên", date: "2025-06-27" },
];

function DashboardPage() {
  const [tab, setTab] = useState("line"); // "line" | "bar" | "members"

  return (
    <div className="p-6 bg-white dark:bg-gray-900 min-h-full">
      <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
        Dashboard Quản lý CLB
      </h1>

      {/* Box thống kê */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-blue-100 dark:bg-blue-900 p-4 rounded shadow">
          <h2 className="text-gray-800 dark:text-white">Tổng số CLB</h2>
          <p className="text-2xl font-bold text-blue-800 dark:text-white">12</p>
        </div>
        <div className="bg-green-100 dark:bg-green-900 p-4 rounded shadow">
          <h2 className="text-gray-800 dark:text-white">Thành viên</h2>
          <p className="text-2xl font-bold text-green-800 dark:text-white">350</p>
        </div>
        <div className="bg-yellow-100 dark:bg-yellow-900 p-4 rounded shadow">
          <h2 className="text-gray-800 dark:text-white">Chủ nhiệm CLB</h2>
          <p className="text-2xl font-bold text-yellow-800 dark:text-white">15</p>
        </div>
      </div>

      {/* TAB switch */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setTab("line")}
          className={`px-4 py-2 rounded ${tab === "line"
            ? "bg-blue-600 text-white"
            : "bg-gray-200 dark:bg-gray-700 text-black dark:text-white"
            }`}
        >
          Biểu đồ thành viên
        </button>
        <button
          onClick={() => setTab("bar")}
          className={`px-4 py-2 rounded ${tab === "bar"
            ? "bg-blue-600 text-white"
            : "bg-gray-200 dark:bg-gray-700 text-black dark:text-white"
            }`}
        >
          Biểu đồ CLB
        </button>
        <button
          onClick={() => setTab("members")}
          className={`px-4 py-2 rounded ${tab === "members"
            ? "bg-blue-600 text-white"
            : "bg-gray-200 dark:bg-gray-700 text-black dark:text-white"
            }`}
        >
          Chủ nhiệm CLB
        </button>
      </div>

      {/* Hiển thị nội dung theo tab */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded shadow">
        {tab === "line" && (
          <>
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
              Thống kê thành viên theo tháng
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={data}>
                <Line type="monotone" dataKey="thanhVien" stroke="#2563eb" strokeWidth={3} />
                <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
                <XAxis dataKey="name" stroke="#888" />
                <YAxis stroke="#888" />
                <Tooltip />
              </LineChart>
            </ResponsiveContainer>
          </>
        )}

        {tab === "bar" && (
          <>
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
              Thống kê số lượng thành viên theo CLB
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" stroke="#888" />
                <YAxis stroke="#888" />
                <Tooltip />
                <Bar dataKey="thanhVien" fill="#38bdf8" />
              </BarChart>
            </ResponsiveContainer>
          </>
        )}

        {tab === "members" && (
          <>
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
              Thành viên mới đăng ký
            </h2>
            <table className="min-w-full text-left">
              <thead className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-white">
                <tr>
                  <th className="py-2 px-4">Họ tên</th>
                  <th className="py-2 px-4">CLB</th>
                  <th className="py-2 px-4">Vai trò</th>
                  <th className="py-2 px-4">Ngày đăng ký</th>
                </tr>
              </thead>
              <tbody>
                {newMembers.map((m) => (
                  <tr key={m.id} className="border-b border-gray-200 dark:border-gray-700">
                    <td className="py-2 px-4 text-gray-900 dark:text-white">{m.name}</td>
                    <td className="py-2 px-4 text-gray-700 dark:text-gray-300">{m.club}</td>
                    <td className="py-2 px-4">
                      <span className={`px-2 py-1 text-sm rounded-full font-medium ${m.role === "Chủ nhiệm"
                        ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                        : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                        }`}
                      >
                        {m.role}
                      </span>
                    </td>
                    <td className="py-2 px-4 text-gray-700 dark:text-gray-300">{m.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
      </div>
    </div>
  );
}

export default DashboardPage;
