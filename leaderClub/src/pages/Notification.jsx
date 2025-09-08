import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { Edit, Trash2, Send } from "lucide-react";
import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;

export default function NotificationManagement() {
  const [notifications, setNotifications] = useState([]);
  const [events, setEvents] = useState([]);
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingNoti, setEditingNoti] = useState(null);

  const [form, setForm] = useState({
    title: "",
    content: "",
    file: null,
    receiverType: "all",
    eventId: "",
  });

  // ---------------- FETCH ----------------
  useEffect(() => {
    fetchNotifications();
    fetchEvents();
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await axios.get(`${API_URL}/notifications`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setNotifications(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Không tải được danh sách thông báo!");
    }
  };

  const fetchEvents = async () => {
    try {
      const res1 = await axios.get(`${API_URL}/events?status=upcoming`);
      const res2 = await axios.get(`${API_URL}/events?status=ongoing`);
      const res3 = await axios.get(`${API_URL}/events?status=ended`);
      setEvents([...res1.data, ...res2.data, ...res3.data]);
    } catch (err) {
      console.error(err);
      toast.error("Không tải được danh sách sự kiện!");
    }
  };

  // ---------------- FORM ----------------
  const openAddForm = () => {
    setEditingNoti(null);
    setForm({
      title: "",
      content: "",
      file: null,
      receiverType: "all",
      eventId: "",
    });
    setShowForm(true);
  };

  const openEditForm = (noti) => {
    setEditingNoti(noti);
    setForm({
      title: noti.title,
      content: noti.content,
      file: null,
      receiverType: noti.receiverType || "all",
      eventId: noti.eventId || "",
    });
    setShowForm(true);
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "file") {
      setForm({ ...form, file: files[0] });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.content) {
      toast.error("Vui lòng nhập đầy đủ Tiêu đề và Nội dung!");
      return;
    }

    try {
      const data = new FormData();
      data.append("title", form.title);
      data.append("content", form.content);
      data.append("receiverType", form.receiverType);
      if (form.eventId) data.append("eventId", form.eventId);
      if (form.file) data.append("file", form.file);

      if (editingNoti) {
        toast.info("BE chưa có API update notification, chỉ demo gửi mới!");
      } else {
        await axios.post(`${API_URL}/notifications`, data, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        toast.success("Đã gửi thông báo!");
        fetchNotifications();
      }

      setShowForm(false);
    } catch (err) {
      console.error(err);
      toast.error("Lỗi khi gửi thông báo!");
    }
  };

  // ---------------- DELETE ----------------
  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xoá thông báo này?")) return;
    toast.info("BE chưa có API xoá notification, demo xoá local!");
    setNotifications(notifications.filter((n) => n._id !== id));
  };

  // ---------------- FILTER ----------------
  const filteredNotifications = notifications.filter((n) => {
    const matchSearch = n.title
      ?.toLowerCase()
      .includes(search.toLowerCase());
    const matchDate = filterDate
      ? n.createdAt?.slice(0, 10) === filterDate
      : true;
    return matchSearch && matchDate;
  });

  // ---------------- RENDER ----------------
  return (
    <div className="p-4 bg-white dark:bg-gray-900 min-h-full">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Quản lý thông báo
        </h1>
        <button
          onClick={openAddForm}
          className="flex items-center px-6 py-3 font-bold text-white rounded shadow-lg bg-gradient-to-r from-cyan-500 via-blue-500 to-blue-600 hover:from-cyan-600 hover:via-blue-600 hover:to-blue-700 transition-all duration-300"
        >
          <Send size={18} className="mr-2" />
          Gửi thông báo
        </button>
      </div>

      {/* Filter */}
      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <input
          type="text"
          placeholder="Tìm kiếm theo tiêu đề..."
          className="p-2 border rounded dark:bg-gray-800 dark:text-white"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <input
          type="date"
          className="p-2 border rounded dark:bg-gray-800 dark:text-white"
          value={filterDate}
          onChange={(e) => setFilterDate(e.target.value)}
        />
      </div>

      {/* Danh sách thông báo */}
      <table className="min-w-full bg-white dark:bg-gray-800 shadow rounded-lg">
        <thead className="bg-blue-100 text-blue-800 dark:bg-gray-700 dark:text-white">
          <tr>
            <th className="py-2 px-4 text-left">Tiêu đề</th>
            <th className="py-2 px-4 text-left">Ngày gửi</th>
            <th className="py-2 px-4 text-left">Người gửi</th>
            <th className="py-2 px-4 text-left">Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {filteredNotifications.map((n) => (
            <tr
              key={n._id}
              className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
              onClick={() => setSelected(n)}
            >
              <td className="py-2 px-4">{n.title}</td>
              <td className="py-2 px-4">{n.createdAt?.slice(0, 10)}</td>
              <td className="py-2 px-4">{n.sender || "System"}</td>
              <td className="py-2 px-4 flex gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    openEditForm(n);
                  }}
                  className="text-blue-600 hover:text-blue-800"
                >
                  <Edit size={18} />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(n._id);
                  }}
                  className="text-red-600 hover:text-red-800"
                >
                  <Trash2 size={18} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {filteredNotifications.length === 0 && (
        <p className="mt-4 text-center text-gray-500 dark:text-gray-400">
          Không có thông báo nào phù hợp.
        </p>
      )}

      {/* Modal xem chi tiết */}
      {selected && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-1/2 p-6">
            <h3 className="text-lg font-bold mb-2">{selected.title}</h3>
            <p className="text-sm text-gray-500 mb-4">
              {selected.createdAt?.slice(0, 10)} - {selected.sender}
            </p>
            <p className="mb-4">{selected.content}</p>

            {selected.file && (
              <p className="mb-4">
                📎{" "}
                <a
                  href={selected.file}
                  className="text-blue-600 underline"
                  target="_blank"
                  rel="noreferrer"
                >
                  Tải tệp
                </a>
              </p>
            )}

            <p className="mb-4">
              <strong>Người nhận:</strong>{" "}
              {selected.receiverType === "all"
                ? "Tất cả thành viên"
                : selected.receiverType === "attended"
                ? "Đã tham gia"
                : "Chưa tham gia"}
            </p>

            <div className="flex justify-end">
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded"
                onClick={() => setSelected(null)}
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Form tạo/sửa */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-900 p-6 rounded-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">
              {editingNoti ? "Sửa thông báo" : "Tạo thông báo"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block mb-1">Tiêu đề *</label>
                <input
                  name="title"
                  type="text"
                  value={form.title}
                  onChange={handleChange}
                  className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
                  required
                />
              </div>
              <div>
                <label className="block mb-1">Nội dung *</label>
                <textarea
                  name="content"
                  value={form.content}
                  onChange={handleChange}
                  className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
                  rows="4"
                  required
                ></textarea>
              </div>
              <div>
                <label className="block mb-1">Sự kiện</label>
                <select
                  name="eventId"
                  value={form.eventId}
                  onChange={handleChange}
                  className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
                >
                  <option value="">-- Chọn sự kiện --</option>
                  {events.map((ev) => (
                    <option key={ev._id} value={ev._id}>
                      {ev.title} ({ev.status})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block mb-1">Tệp đính kèm</label>
                <input type="file" name="file" onChange={handleChange} />
              </div>
              <div>
                <label className="block mb-1">Đối tượng nhận</label>
                <select
                  name="receiverType"
                  value={form.receiverType}
                  onChange={handleChange}
                  className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
                >
                  <option value="all">Tất cả thành viên</option>
                  <option value="attended">Đã tham gia (check-in)</option>
                  <option value="not_attended">Chưa tham gia</option>
                </select>
              </div>
              <div className="flex justify-end gap-4 pt-4">
                <button
                  type="submit"
                  className="px-6 py-3 font-bold text-white rounded shadow-lg bg-green-600 hover:bg-green-700 transition"
                >
                  {editingNoti ? "Lưu" : "Gửi"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-6 py-3 font-bold text-white rounded shadow-lg bg-red-600 hover:bg-red-700 transition"
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
}
