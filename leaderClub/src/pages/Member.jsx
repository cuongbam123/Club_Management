import React, { useEffect, useState } from "react";
import { FaFilter } from "react-icons/fa";

const MemberManagement = ({ clubId }) => {
    const [members, setMembers] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [sortOrder, setSortOrder] = useState("asc");
    const [currentPage, setCurrentPage] = useState(1);

    const membersPerPage = 5;

    // Fake data mẫu (thay bằng API thật khi backend sẵn sàng)
    useEffect(() => {
        const fakeMembers = [
            { _id: "1", name: "Nguyễn Văn A", email: "a@example.com", phone: "0912345678", address: "Hà Nội", role: "Leader" },
            { _id: "2", name: "Trần Thị B", email: "b@example.com", phone: "0987654321", address: "Hồ Chí Minh", role: "Member" },
            { _id: "3", name: "Lê Văn C", email: "c@example.com", phone: "0977123456", address: "Đà Nẵng", role: "Member" },
        ];
        setMembers(fakeMembers);
    }, []);

    // Lọc theo searchTerm
    const filteredMembers = members.filter(
        (m) =>
            m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            m.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            m.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
            m.address.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Sắp xếp
    const sortedMembers = [...filteredMembers].sort((a, b) => {
        if (sortOrder === "asc") return a.name.localeCompare(b.name);
        if (sortOrder === "desc") return b.name.localeCompare(a.name);
        if (sortOrder === "id-asc") return Number(a._id) - Number(b._id);
        if (sortOrder === "id-desc") return Number(b._id) - Number(a._id);
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
                    placeholder="Tìm kiếm theo tên, email, SĐT, địa chỉ..."
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
                        <option value="id-asc">ID tăng dần</option>
                        <option value="id-desc">ID giảm dần</option>
                    </select>
                    <FaFilter className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-300" />
                </div>
            </div>

            {/* Bảng danh sách */}
            <table className="table-auto w-full border-collapse border border-gray-300">
                <thead className="bg-gray-100 dark:bg-gray-700 dark:text-white">
                    <tr>
                        <th className="border px-4 py-2">ID</th>
                        <th className="border px-4 py-2">Họ tên</th>
                        <th className="border px-4 py-2">Email</th>
                        <th className="border px-4 py-2">SĐT</th>
                        <th className="border px-4 py-2">Địa chỉ</th>
                        <th className="border px-4 py-2">Vai trò</th>
                    </tr>
                </thead>
                <tbody>
                    {currentMembers.map((m) => (
                        <tr key={m._id}>
                            <td className="border px-4 py-2">{m._id}</td>
                            <td className="border px-4 py-2">{m.name}</td>
                            <td className="border px-4 py-2">{m.email}</td>
                            <td className="border px-4 py-2">{m.phone}</td>
                            <td className="border px-4 py-2">{m.address}</td>
                            <td className="border px-4 py-2">{m.role}</td>
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
                        className={`px-3 py-1 border rounded ${currentPage === i + 1 ? "bg-blue-600 text-white" : ""}`}
                    >
                        {i + 1}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default MemberManagement;
