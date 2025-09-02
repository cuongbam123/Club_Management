import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { FiEdit, FiTrash } from "react-icons/fi";

const ClubList = () => {
  const [clubs, setClubs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState({
    name_club: "",
    president: "",
    description: "",
    memberCount: "",
  });

  const clubsPerPage = 5;

  useEffect(() => {
    fetchClubs();
  }, []);

  const fetchClubs = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return toast.error("❌ Bạn chưa đăng nhập");
      const res = await axios.get("http://localhost:3001/api/clubs", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setClubs(res.data.data);
    } catch (error) {
      console.error(error);
      toast.error("❌ Lỗi khi tải danh sách CLB");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xoá CLB này?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:3001/api/clubs/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("✅ Xoá CLB thành công");
      fetchClubs();
    } catch (error) {
      console.error(error);
      toast.error("❌ Không xoá được CLB");
    }
  };

  const handleEdit = (club) => {
    setFormData({
      name_club: club.name_club,
      president: club.president,
      description: club.description,
      memberCount: club.memberCount,
    });
    setEditId(club._id);
    setShowForm(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) return toast.error("❌ Bạn chưa đăng nhập");

    try {
      if (editId) {
        await axios.put(`http://localhost:3001/api/clubs/${editId}`, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("✅ Cập nhật CLB thành công!");
      } else {
        await axios.post("http://localhost:3001/api/clubs", formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("✅ Thêm CLB mới thành công!");
      }

      setShowForm(false);
      setFormData({ name_club: "", president: "", description: "", memberCount: "" });
      setEditId(null);
      fetchClubs();
    } catch (error) {
      console.error(error);
      toast.error("❌ Lỗi khi thêm/sửa CLB");
    }
  };

  const filteredClubs = clubs.filter((c) =>
    c.name_club?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredClubs.length / clubsPerPage);
  const currentClubs = filteredClubs.slice(
    (currentPage - 1) * clubsPerPage,
    currentPage * clubsPerPage
  );

  return (
    <div className="p-4 bg-white dark:bg-gray-900 min-h-full text-gray-800 dark:text-white">
      <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
        <h1 className="text-2xl font-bold mb-6">Danh sách CLB</h1>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Tìm CLB..."
            className="p-2 border rounded w-64 dark:bg-gray-800 dark:text-white"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button
            onClick={() => {
              setShowForm(true);
              setFormData({ name: "", description: "", president: "" }); // Ví dụ form CLB
            }}
            className="relative inline-flex items-center justify-center px-6 py-3 overflow-hidden font-bold text-white rounded shadow-lg group 
             bg-gradient-to-r from-cyan-500 via-blue-500 to-blue-600 
             hover:from-cyan-600 hover:via-blue-600 hover:to-blue-700 
             transition-all duration-300"
          >
            <span className="absolute inset-0 flex items-center justify-center w-full h-full duration-300 transform translate-x-full bg-white bg-opacity-10 group-hover:translate-x-0"></span>
            <span className="relative z-10">Thêm CLB</span>
          </button>

        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white dark:bg-gray-800 shadow rounded-lg">
          <thead className="bg-gray-100 dark:bg-gray-700">
            <tr>
              <th className="py-2 px-4 text-left">Tên CLB</th>
              <th className="py-2 px-4 text-left">Chủ nhiệm</th>
              <th className="py-2 px-4 text-left">Số thành viên</th>
              <th className="py-2 px-4 text-left">Mô tả</th>
              <th className="py-2 px-4 text-left">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {currentClubs.map((club, idx) => (
              <tr key={club._id ?? idx} className="border-b border-gray-200 dark:border-gray-700">
                <td className="py-2 px-4">{club.name_club}</td>
                <td className="py-2 px-4">{club.president}</td>
                <td className="py-2 px-4">{club.memberCount}</td>
                <td className="py-2 px-4">{club.description}</td>
                <td className="py-2 px-4 flex gap-2">
                  <button onClick={() => handleEdit(club)} title="Sửa" className="text-blue-600">
                    <FiEdit size={18} />
                  </button>
                  <button onClick={() => handleDelete(club._id)} title="Xoá" className="text-red-600">
                    <FiTrash size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredClubs.length === 0 && (
          <p className="text-center mt-4 text-gray-500 dark:text-gray-400">
            Không tìm thấy CLB phù hợp.
          </p>
        )}
      </div>

      {totalPages > 1 && (
        <div className="mt-6 flex justify-center gap-2">
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-3 py-1 rounded ${currentPage === i + 1
                ? "bg-blue-600 text-white"
                : "bg-gray-200 dark:bg-gray-700 dark:text-white"
                }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="relative w-full max-w-2xl bg-gray-100 rounded-lg shadow p-6 m-4 overflow-y-auto">
            <h2 className="text-2xl font-bold mb-6">{editId ? "Sửa CLB" : "Thêm CLB"}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block mb-1">Tên CLB</label>
                <input
                  type="text"
                  name="name_club"
                  value={formData.name_club}
                  onChange={handleChange}
                  className="w-full p-2 border rounded dark:bg-gray-800 dark:text-white"
                  required
                />
              </div>
              <div>
                <label className="block mb-1">Chủ nhiệm</label>
                <input
                  type="text"
                  name="president"
                  value={formData.president}
                  onChange={handleChange}
                  className="w-full p-2 border rounded dark:bg-gray-800 dark:text-white"
                  required
                />
              </div>
              <div>
                <label className="block mb-1">Số thành viên</label>
                <input
                  type="number"
                  name="memberCount"
                  value={formData.memberCount}
                  onChange={handleChange}
                  className="w-full p-2 border rounded dark:bg-gray-800 dark:text-white"
                />
              </div>
              <div>
                <label className="block mb-1">Mô tả</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full p-2 border rounded dark:bg-gray-800 dark:text-white"
                  rows={4}
                />
              </div>

              <div className="flex justify-end gap-4 pt-4">
                {/* Nút Thêm / Cập nhật CLB */}
                <button
                  type="submit"
                  className="relative inline-flex items-center justify-center px-6 py-3 overflow-hidden font-bold text-white rounded shadow-lg group
               bg-gradient-to-r from-cyan-500 via-blue-500 to-blue-600 
               hover:from-cyan-600 hover:via-blue-600 hover:to-blue-700 
               transition-all duration-300"
                >
                  <span className="absolute inset-0 flex items-center justify-center w-full h-full duration-300 transform translate-x-full
                     bg-white bg-opacity-10 group-hover:translate-x-0"></span>
                  <span className="relative z-10">{editId ? "Cập nhật" : "Thêm CLB"}</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setFormData({ name: "", description: "", president: "" });
                    setEditId(null);
                  }}
                  className="relative inline-flex items-center justify-center px-6 py-3 overflow-hidden font-bold text-white rounded shadow-lg group
               bg-gradient-to-r from-red-500 via-red-600 to-red-700
               hover:from-red-600 hover:via-red-700 hover:to-red-800
               transition-all duration-300"
                >
                  <span className="absolute inset-0 flex items-center justify-center w-full h-full duration-300 transform translate-x-full
                     bg-white bg-opacity-10 group-hover:translate-x-0"></span>
                  <span className="relative z-10">Huỷ</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClubList;
