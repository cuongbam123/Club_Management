import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { FiEdit, FiTrash } from "react-icons/fi";

const ClubList = () => {
  const [clubs, setClubs] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [clubAdmins, setClubAdmins] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    president: "",
    description: "",
    logo: null, // file
  });

  const testLogo = "https://via.placeholder.com/60x60?text=CLB";
  const clubsPerPage = 5;

  useEffect(() => {
    fetchClubs();
    fetchAdmins();
  }, []);

  // Lấy danh sách CLB
  const fetchClubs = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return toast.error("❌ Bạn chưa đăng nhập");

      const res = await axios.get(`${process.env.REACT_APP_API_URL}/clubs`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (Array.isArray(res.data)) {
        setClubs(res.data);
      } else if (Array.isArray(res.data.data)) {
        setClubs(res.data.data);
      } else {
        setClubs([]);
      }
    } catch (error) {
      console.error(error);
      toast.error("❌ Lỗi khi tải danh sách CLB");
    }
  };

  // Lấy danh sách clubadmin
  const fetchAdmins = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/users/clubadmins`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setClubAdmins(res.data);
    } catch (err) {
      console.error("❌ Lỗi khi tải clubadmins:", err);
      toast.error("Không tải được danh sách chủ nhiệm CLB");
    }
  };

  // Xoá CLB
  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xoá CLB này?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${process.env.REACT_APP_API_URL}/clubs/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("✅ Xoá CLB thành công");
      fetchClubs();
    } catch (error) {
      console.error(error);
      toast.error("❌ Không xoá được CLB");
    }
  };

  // Sửa CLB
  const handleEdit = (club) => {
    setFormData({
      name: club.name,
      president: club.president?._id || "",
      description: club.description || "",
      logo: null, // reset file, chỉ upload khi chọn file mới
    });
    setEditId(club._id);
    setShowForm(true);
  };

  // Thay đổi input text / select
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Thay đổi file
  const handleFileChange = (e) => {
    setFormData((prev) => ({ ...prev, logo: e.target.files[0] }));
  };

  // Thêm / Sửa CLB
  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) return toast.error("❌ Bạn chưa đăng nhập");

    try {
      const form = new FormData();
      form.append("name", formData.name);
      form.append("description", formData.description);
      form.append("president", formData.president);
      if (formData.logo) form.append("logo", formData.logo);

      if (editId) {
        await axios.put(
          `${process.env.REACT_APP_API_URL}/clubs/${editId}`,
          form,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success("✅ Cập nhật CLB thành công!");
      } else {
        await axios.post(`${process.env.REACT_APP_API_URL}/clubs`, form, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("✅ Thêm CLB mới thành công!");
      }

      setShowForm(false);
      setFormData({ name: "", president: "", description: "", logo: null });
      setEditId(null);
      fetchClubs();
    } catch (error) {
      console.error(error);
      toast.error("❌ Lỗi khi thêm/sửa CLB");
    }
  };

  // Tìm kiếm
  const filteredClubs = clubs.filter((c) =>
    c.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Phân trang
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
              setFormData({
                name: "",
                description: "",
                president: "",
                logo: null,
              });
            }}
            className="px-6 py-3 font-bold text-white rounded bg-gradient-to-r from-cyan-500 via-blue-500 to-blue-600 hover:from-cyan-600 hover:via-blue-600 hover:to-blue-700 transition-all duration-300"
          >
            Thêm CLB
          </button>
        </div>
      </div>

      {/* Bảng danh sách */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white dark:bg-gray-800 shadow rounded-lg">
          <thead className="bg-gray-100 dark:bg-gray-700">
            <tr>
              <th className="py-2 px-4 text-left">Logo</th>
              <th className="py-2 px-4 text-left">Tên CLB</th>
              <th className="py-2 px-4 text-left">Chủ nhiệm</th>
              <th className="py-2 px-4 text-left">Số thành viên</th>
              <th className="py-2 px-4 text-left">Mô tả</th>
              <th className="py-2 px-4 text-left">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {currentClubs.map((club, idx) => (
              <tr
                key={club._id ?? idx}
                className="border-b border-gray-200 dark:border-gray-700"
              >
                <td className="py-2 px-4">
                  <img
                    src={
                      club.logoUrl
                        ? `${process.env.REACT_APP_API_URL}${club.logoUrl}`
                        : testLogo
                    }
                    alt="Logo CLB"
                    className="w-16 h-16 object-cover rounded"
                  />
                </td>
                <td className="py-2 px-4">{club.name}</td>
                <td className="py-2 px-4">{club.president?.name || "Chưa có"}</td>
                <td className="py-2 px-4">{club.members?.length || 0}</td>
                <td className="py-2 px-4">{club.description}</td>
                <td className="py-2 px-4 flex gap-2">
                  <button
                    onClick={() => handleEdit(club)}
                    title="Sửa"
                    className="text-blue-600"
                  >
                    <FiEdit size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(club._id)}
                    title="Xoá"
                    className="text-red-600"
                  >
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

      {/* Phân trang */}
      {totalPages > 1 && (
        <div className="mt-6 flex justify-center gap-2">
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-3 py-1 rounded ${
                currentPage === i + 1
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 dark:bg-gray-700 dark:text-white"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}

      {/* Form thêm / sửa */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="relative w-full max-w-2xl bg-gray-100 rounded-lg shadow p-6 m-4 overflow-y-auto">
            <h2 className="text-2xl font-bold mb-6">
              {editId ? "Sửa CLB" : "Thêm CLB"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block mb-1">Tên CLB</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full p-2 border rounded dark:bg-gray-800 dark:text-white"
                  required
                />
              </div>
              <div>
                <label className="block mb-1">Logo CLB</label>
                <input
                  type="file"
                  name="logo"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="w-full p-2 border rounded dark:bg-gray-800 dark:text-white"
                />
              </div>
              <div>
                <label className="block mb-1">Chủ nhiệm</label>
                <select
  name="president"
  value={formData.president}
  onChange={handleChange}
  className="w-full p-2 border rounded dark:bg-gray-800 dark:text-white"
>
  <option value="">-- Chọn chủ nhiệm --</option>
  {clubAdmins.map((u) => (
    <option key={u._id} value={u._id}>
      {u.name} ({u.email})
    </option>
  ))}
</select>
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
                <button
                  type="submit"
                  className="px-6 py-3 font-bold text-white rounded bg-gradient-to-r from-cyan-500 via-blue-500 to-blue-600 hover:from-cyan-600 hover:via-blue-600 hover:to-blue-700 transition-all duration-300"
                >
                  {editId ? "Cập nhật" : "Thêm CLB"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setFormData({
                      name: "",
                      description: "",
                      president: "",
                      logo: null,
                    });
                    setEditId(null);
                  }}
                  className="px-6 py-3 font-bold text-white rounded bg-gradient-to-r from-red-500 via-red-600 to-red-700 hover:from-red-600 hover:via-red-700 hover:to-red-800 transition-all duration-300"
                >
                  Huỷ
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
