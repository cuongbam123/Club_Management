import React, { useEffect, useState } from "react";
import { FaFilter } from "react-icons/fa";
import axios from "axios";

const MemberManagement = () => {
  const [members, setMembers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [clubId, setClubId] = useState(null);

  const membersPerPage = 5;
  const token = localStorage.getItem("token");

  // Lấy thông tin user để biết clubId
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_API_URL}/auth/me`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        console.log("auth/me:", res.data);
        setClubId(res.data.user?.clubId || null);
      } catch (err) {
        console.error("Lỗi fetch user:", err.response?.data || err.message);
      }
    };
    fetchUser();
  }, [token]);

  // Lấy danh sách thành viên CLB
  useEffect(() => {
    const fetchMembers = async () => {
      if (!clubId) return;
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_API_URL}/clubs/${clubId}/members`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        console.log("members:", res.data);
        setMembers(res.data || []);
      } catch (err) {
        console.error("Lỗi fetch members:", err.response?.data || err.message);
      }
    };
    fetchMembers();
  }, [clubId, token]);

  // Lọc theo searchTerm
  const filteredMembers = members.filter(
    (m) =>
      m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sắp xếp
  const sortedMembers = [...filteredMembers].sort((a, b) => {
    if (sortOrder === "asc") return a.name.localeCompare(b.name);
    if (sortOrder === "desc") return b.name.localeCompare(a.name);
    return 0;
  });

  // Phân trang
  const indexOfLast = currentPage * membersPerPage;
  const indexOfFirst = indexOfLast - membersPerPage;
  const currentMembers = sortedMembers.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(sortedMembers.length / membersPerPage);

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
        <h2 className="text-2xl font-bold mb-4 md:mb-0">
          Danh sách thành viên CLB
        </h2>
      </div>

      {/* Tìm kiếm + Sắp xếp */}
      <div className="flex justify-between items-center mb-4">
        <input
          type="text"
          placeholder="Tìm kiếm theo tên, email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-64 px-3 py-2 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-800 dark:text-white"
        />
        <div className="relative">
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="appearance-none pl-8 pr-4 py-2 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-800 dark:text-white"
          >
            <option value="asc">Tên A → Z</option>
            <option value="desc">Tên Z → A</option>
          </select>
          <FaFilter className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-300" />
        </div>
      </div>

      {/* Bảng danh sách */}
      <table className="table-auto w-full border-collapse border border-gray-300">
        <thead className="bg-gray-100 dark:bg-gray-700 dark:text-white">
          <tr>
            <th className="border px-4 py-2">Họ tên</th>
            <th className="border px-4 py-2">Email</th>
            <th className="border px-4 py-2">Vai trò</th>
            <th className="border px-4 py-2">Ngày gia nhập</th>
          </tr>
        </thead>
        <tbody>
          {currentMembers.map((m) => (
            <tr key={m._id}>
              <td className="border px-4 py-2">{m.name}</td>
              <td className="border px-4 py-2">{m.email}</td>
              <td className="border px-4 py-2">{m.role}</td>
              <td className="border px-4 py-2">
                {m.joinedAt
                  ? new Date(m.joinedAt).toLocaleDateString("vi-VN")
                  : "Thành viên cũ"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Phân trang */}
      <div className="flex justify-center mt-4 space-x-2">
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            onClick={() => setCurrentPage(i + 1)}
            className={`px-3 py-1 border rounded ${
              currentPage === i + 1 ? "bg-blue-600 text-white" : ""
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default MemberManagement;
