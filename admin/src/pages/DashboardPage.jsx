import React, { useEffect, useState } from "react";
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

function DashboardPage() {
  const [tab, setTab] = useState("line");
  const [overview, setOverview] = useState(null);
  const [clubStats, setClubStats] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  const [newMembers, setNewMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("newest");

  const filteredMembers = newMembers.filter((m) =>
    m.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedMembers = [...filteredMembers].sort((a, b) => {
    if (sortOption === "newest") {
      return new Date(b.createdAt) - new Date(a.createdAt);
    }
    if (sortOption === "oldest") {
      return new Date(a.createdAt) - new Date(b.createdAt);
    }
    if (sortOption === "club") {
      return (a.club?.name || "").localeCompare(b.club?.name || "");
    }
    if (sortOption === "role") {
      return (a.role || "").localeCompare(b.role || "");
    }
    return 0;
  });
  useEffect(() => {
    const token = localStorage.getItem("token");

    const fetchData = async () => {
      try {
        // 1. Thống kê tổng quan
        const resOverview = await fetch(
          `${process.env.REACT_APP_API_URL}/statistics/overview`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const overviewData = await resOverview.json();
        setOverview(overviewData);

        // 2. Thống kê số thành viên theo CLB
        const resClubs = await fetch(`${process.env.REACT_APP_API_URL}/clubs`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const clubs = await resClubs.json();
        const stats = clubs.map((c) => ({
          name: c.name,
          thanhVien: c.memberCount || 0,
        }));
        setClubStats(stats);

        // 3. Dữ liệu thành viên theo tháng (giả sử API trả về overview.monthlyMembers)
        setMonthlyData(overviewData.monthlyMembers || []);

        // 4. Thành viên mới (giả sử API trả về overview.newMembers)
        setNewMembers(overviewData.newMembers || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div className="p-6">Đang tải dữ liệu...</div>;

  return (
    <div className="p-6 bg-white dark:bg-gray-900 min-h-full">
      <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
        Dashboard Quản lý CLB
      </h1>

      {/* Box thống kê */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-blue-100 dark:bg-blue-900 p-4 rounded shadow">
          <h2 className="text-gray-800 dark:text-white">Tổng số CLB</h2>
          <p className="text-2xl font-bold text-blue-800 dark:text-white">
            {overview?.totalClubs || 0}
          </p>
        </div>
        <div className="bg-green-100 dark:bg-green-900 p-4 rounded shadow">
          <h2 className="text-gray-800 dark:text-white">Thành viên</h2>
          <p className="text-2xl font-bold text-green-800 dark:text-white">
            {overview?.totalMembers || 0}
          </p>
        </div>
        <div className="bg-yellow-100 dark:bg-yellow-900 p-4 rounded shadow">
          <h2 className="text-gray-800 dark:text-white">Chủ nhiệm CLB</h2>
          <p className="text-2xl font-bold text-yellow-800 dark:text-white">
            {overview?.totalPresidents || 0}
          </p>
        </div>
      </div>

      {/* TAB */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setTab("line")}
          className={`px-4 py-2 rounded ${
            tab === "line"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 dark:bg-gray-700 text-black dark:text-white"
          }`}
        >
          Biểu đồ thành viên
        </button>
        <button
          onClick={() => setTab("bar")}
          className={`px-4 py-2 rounded ${
            tab === "bar"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 dark:bg-gray-700 text-black dark:text-white"
          }`}
        >
          Biểu đồ CLB
        </button>
        <button
          onClick={() => setTab("members")}
          className={`px-4 py-2 rounded ${
            tab === "members"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 dark:bg-gray-700 text-black dark:text-white"
          }`}
        >
          Thành viên mới
        </button>
      </div>

      {/* Nội dung theo tab */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded shadow">
        {tab === "line" && (
          <>
            <h2 className="text-xl font-semibold mb-4">
              Thống kê thành viên theo tháng
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyData}>
                <Line
                  type="monotone"
                  dataKey="members"
                  stroke="#2563eb"
                  strokeWidth={3}
                />
                <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
                <XAxis dataKey="month" stroke="#888" />
                <YAxis stroke="#888" />
                <Tooltip />
              </LineChart>
            </ResponsiveContainer>
          </>
        )}

        {tab === "bar" && (
          <>
            <h2 className="text-xl font-semibold mb-4">Thành viên theo CLB</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={clubStats}>
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
            <h2 className="text-xl font-semibold mb-4">
              Thành viên mới đăng ký
            </h2>

            {/* Bộ lọc */}
            <div className="flex flex-col md:flex-row gap-4 mb-4">
              <input
                type="text"
                placeholder="Tìm theo tên..."
                className="p-2 border rounded dark:bg-gray-700 dark:text-white"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="p-2 border rounded dark:bg-gray-700 dark:text-white"
              >
                <option value="newest">Ngày tham gia (mới nhất)</option>
                <option value="oldest">Ngày tham gia (cũ nhất)</option>
                <option value="club">CLB (A → Z)</option>
                <option value="role">Vai trò (A → Z)</option>
              </select>
            </div>

            {/* Bảng */}
            <table className="min-w-full text-left">
              <thead className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-white">
                <tr>
                  <th className="py-2 px-4">Họ tên</th>
                  <th className="py-2 px-4">CLB</th>
                  <th className="py-2 px-4">Vai trò</th>
                  <th className="py-2 px-4">Ngày tham gia</th>
                </tr>
              </thead>
              <tbody>
                {sortedMembers.map((m) => (
                  <tr
                    key={m._id}
                    className="border-b border-gray-200 dark:border-gray-700"
                  >
                    <td className="py-2 px-4">{m.name}</td>
                    <td className="py-2 px-4">{m.club?.name || "Không có"}</td>
                    <td className="py-2 px-4">{m.role}</td>
                    <td className="py-2 px-4">
                      {new Date(m.createdAt).toLocaleDateString("vi-VN")}
                    </td>
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
