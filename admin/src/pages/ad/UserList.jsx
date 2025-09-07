import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Edit, Trash2, UserPlus } from "lucide-react";

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [clubs, setClubs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("Tất cả");
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    clubId: "",
    role: "student",
    password: "",
  });

  const token = localStorage.getItem("token");

  // ----------------- FETCH USERS & CLUBS -----------------
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get(
          "http://localhost:3001/api/users/admin/users",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setUsers(res.data);
      } catch {
        toast.error("Lỗi khi tải danh sách người dùng");
      }
    };

    const fetchClubs = async () => {
      try {
        const res = await axios.get("http://localhost:3001/api/clubs", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setClubs(res.data);
      } catch {
        toast.error("Lỗi khi tải danh sách CLB");
      }
    };

    fetchUsers();
    fetchClubs();
  }, [token]);

  // ----------------- DELETE USER -----------------
  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xoá người dùng này?")) return;
    try {
      await axios.delete(`http://localhost:3001/api/users/admin/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Đã xoá người dùng!");
      setUsers(users.filter((u) => u._id !== id));
    } catch {
      toast.error("Lỗi khi xoá");
    }
  };

  // ----------------- FORM -----------------
  const openAddForm = () => {
    setEditingUser(null);
    setForm({
      name: "",
      email: "",
      phone: "",
      address: "",
      clubId: "",
      role: "student",
      password: "",
    });
    setShowForm(true);
  };

  const openEditForm = (user) => {
    setEditingUser(user);
    setForm({
      name: user.name || "",
      email: user.email || "",
      phone: user.phone || "",
      address: user.address || "",
      clubId: user.clubId?._id || "",
      role: user.role || "student",
      password: "",
    });
    setShowForm(true);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ----------------- SUBMIT -----------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, phone, address, clubId, role, password } = form;

    if (!name || !email || (!editingUser && !password)) {
      toast.error("Vui lòng nhập đầy đủ Họ tên, Email và Mật khẩu!");
      return;
    }

    try {
      const payload = { name, email, phone, address, role };

      // nếu có clubId thì thêm joinedAt
      if (clubId && clubId.trim() !== "") {
        payload.clubId = clubId;
        payload.joinedAt = new Date(); // 👈 thêm ngày gia nhập
      }

      if (password) payload.password = password;

      if (editingUser) {
        await axios.put(
          `http://localhost:3001/api/users/admin/users/${editingUser._id}`,
          payload,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success("Đã cập nhật người dùng!");
      } else {
        await axios.post(
          "http://localhost:3001/api/users/admin/users",
          payload,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success("Đã thêm người dùng!");
      }

      setShowForm(false);

      // refetch users
      const res = await axios.get(
        "http://localhost:3001/api/users/admin/users",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUsers(res.data);
    } catch {
      toast.error("Lỗi khi lưu người dùng");
    }
  };

  // ----------------- FILTER -----------------
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole =
      roleFilter === "Tất cả" ||
      (roleFilter === "clubadmin" && user.role === "clubadmin") ||
      (roleFilter === "student" && user.role === "student");
    return matchesSearch && matchesRole;
  });

  // ----------------- RENDER -----------------
  return (
    <div className="p-4 bg-white dark:bg-gray-900 min-h-full">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Quản lý người dùng CLB
        </h1>
        <button
          onClick={openAddForm}
          className="flex items-center px-6 py-3 font-bold text-white rounded shadow-lg bg-gradient-to-r from-cyan-500 via-blue-500 to-blue-600 hover:from-cyan-600 hover:via-blue-600 hover:to-blue-700 transition-all duration-300"
        >
          <UserPlus size={18} className="mr-2" />
          Thêm người dùng
        </button>
      </div>

      {/* Filter */}
      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <input
          type="text"
          placeholder="Tìm theo tên hoặc email..."
          className="p-2 border rounded dark:bg-gray-800 dark:text-white"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="p-2 border rounded dark:bg-gray-800 dark:text-white"
        >
          <option value="Tất cả">Tất cả vai trò</option>
          <option value="clubadmin">Chủ nhiệm CLB</option>
          <option value="student">Thành viên CLB</option>
        </select>
      </div>

      {/* Table */}
      <table className="min-w-full bg-white dark:bg-gray-800 shadow rounded-lg">
        <thead className="bg-gray-100 dark:bg-gray-700">
          <tr>
            <th className="py-2 px-4 text-left">ID</th>
            <th className="py-2 px-4 text-left">Họ tên</th>
            <th className="py-2 px-4 text-left">Email</th>
            <th className="py-2 px-4 text-left">SĐT</th>
            <th className="py-2 px-4 text-left">Địa chỉ</th>
            <th className="py-2 px-4 text-left">CLB</th>
            <th className="py-2 px-4 text-left">Vai trò</th>
            <th className="py-2 px-4 text-left">Ngày gia nhập</th>
            <th className="py-2 px-4 text-left">Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((user, index) => (
            <tr
              key={user._id || index}
              className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <td className="py-2 px-4">{user._id}</td>
              <td className="py-2 px-4">{user.name}</td>
              <td className="py-2 px-4">{user.email}</td>
              <td className="py-2 px-4">{user.phone}</td>
              <td className="py-2 px-4">{user.address || "-"}</td>
              <td className="py-2 px-4">{user.clubName || "Chưa gia nhập"}</td>
              <td className="py-2 px-4">
                {user.role === "clubadmin" ? "Chủ nhiệm CLB" : "Thành viên CLB"}
              </td>
              <td className="py-2 px-4">
                {user.joinedAt
                  ? new Date(user.joinedAt).toLocaleDateString("vi-VN")
                  : "—"}
              </td>
              <td className="py-2 px-4 flex gap-2">
                <button
                  onClick={() => openEditForm(user)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  <Edit size={18} />
                </button>
                <button
                  onClick={() => handleDelete(user._id)}
                  className="text-red-600 hover:text-red-800"
                >
                  <Trash2 size={18} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {filteredUsers.length === 0 && (
        <p className="mt-4 text-center text-gray-500 dark:text-gray-400">
          Không có người dùng nào phù hợp.
        </p>
      )}

      {/* Modal Form */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-900 p-6 rounded-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">
              {editingUser ? "Sửa người dùng" : "Thêm người dùng"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Họ tên */}
              <div>
                <label className="block mb-1">Họ và tên</label>
                <input
                  name="name"
                  type="text"
                  value={form.name}
                  onChange={handleChange}
                  className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
                  required
                />
              </div>
              {/* Email */}
              <div>
                <label className="block mb-1">Email</label>
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
                  required
                />
              </div>
              {/* Password */}
              <div>
                <label className="block mb-1">Mật khẩu</label>
                <input
                  name="password"
                  type="password"
                  value={form.password}
                  onChange={handleChange}
                  className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
                  placeholder={editingUser ? "Để trống nếu không đổi" : ""}
                  required={!editingUser}
                />
              </div>
              {/* Phone */}
              <div>
                <label className="block mb-1">Số điện thoại</label>
                <input
                  name="phone"
                  type="text"
                  value={form.phone}
                  onChange={handleChange}
                  className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
                />
              </div>
              {/* Address */}
              <div>
                <label className="block mb-1">Địa chỉ</label>
                <input
                  name="address"
                  type="text"
                  value={form.address}
                  onChange={handleChange}
                  className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
                />
              </div>
              {/* Club */}
              <div>
                <label className="block mb-1">CLB</label>
                <select
                  name="clubId"
                  value={form.clubId}
                  onChange={handleChange}
                  className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
                >
                  <option value="">-- Không CLB --</option>
                  {clubs.map((club) => (
                    <option key={club._id} value={club._id}>
                      {club.name}
                    </option>
                  ))}
                </select>
              </div>
              {/* Role */}
              <div>
                <label className="block mb-1">Vai trò</label>
                <select
                  name="role"
                  value={form.role}
                  onChange={handleChange}
                  className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
                >
                  <option value="student">Thành viên CLB</option>
                  <option value="clubadmin">Chủ nhiệm CLB</option>
                </select>
              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-4 pt-4">
                <button
                  type="submit"
                  className="px-6 py-3 font-bold text-white rounded bg-blue-600 hover:bg-blue-700 transition"
                >
                  {editingUser ? "Lưu" : "Thêm"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-6 py-3 font-bold text-white rounded bg-red-600 hover:bg-red-700 transition"
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

export default UserList;
