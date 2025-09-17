import React, { useEffect, useState, useCallback } from "react";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";
import { FiEdit, FiTrash } from "react-icons/fi";
import EventMember from "./EventMember";

const API_URL = `${process.env.REACT_APP_API_URL}/events`;

const EventManagement = () => {
  const [events, setEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    startAt: "",
    endAt: "",
    capacity: "",
    status: "upcoming",
    bannerUrl: "",
  });

  const [selectedEventId, setSelectedEventId] = useState(null);
  const [showMembers, setShowMembers] = useState(false);

  const eventsPerPage = 5;
  const token = localStorage.getItem("token");

  // ================== FETCH EVENTS ==================
  const fetchEvents = useCallback(async () => {
    try {
      const res = await axios.get(API_URL);
      if (Array.isArray(res.data)) {
        setEvents(res.data);
      } else {
        setEvents([]);
      }
    } catch (err) {
      toast.error("Không thể tải sự kiện");
    }
  }, []);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  // ================== HANDLE ==================
  const handleEdit = (event) => {
    setFormData({
      title: event.title,
      description: event.description,
      startAt: event.startAt?.slice(0, 16),
      endAt: event.endAt?.slice(0, 16),
      capacity: event.capacity,
      status: event.status,
      bannerUrl: event.bannerUrl || "",
    });
    setEditId(event._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn huỷ sự kiện này?")) return;
    try {
      await axios.delete(`${API_URL}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Huỷ sự kiện thành công!");
      fetchEvents();
    } catch (err) {
      toast.error("Lỗi khi huỷ sự kiện");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUploadBanner = async (file) => {
    const formDataFile = new FormData();
    formDataFile.append("banner", file);

    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/events/banner`,
        formDataFile,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (res.data.bannerUrl) {
        setFormData((prev) => ({ ...prev, bannerUrl: res.data.bannerUrl }));
      }
    } catch (err) {
      toast.error("Upload banner thất bại");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const meRes = await axios.get(
        `${process.env.REACT_APP_API_URL}/auth/me`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const clubId = meRes.data.user.clubId;

      const payload = {
        title: formData.title,
        description: formData.description,
        location: formData.location,
        startAt: formData.startAt,
        endAt: formData.endAt,
        capacity: formData.capacity,
        bannerUrl: formData.bannerUrl,
        status: formData.status,
        clubId,
      };

      if (editId) {
        await axios.put(`${API_URL}/${editId}`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Cập nhật sự kiện thành công!");
      } else {
        await axios.post(API_URL, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Tạo sự kiện mới thành công!");
      }

      setShowForm(false);
      setFormData({
        title: "",
        description: "",
        startAt: "",
        endAt: "",
        capacity: "",
        status: "upcoming",
        bannerUrl: "",
      });
      setEditId(null);

      fetchEvents();
    } catch (err) {
      toast.error("Lỗi lưu sự kiện");
    }
  };

  // ================== FILTER + PAGINATION ==================
  const filteredEvents = events.filter((e) =>
    e.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredEvents.length / eventsPerPage);
  const currentEvents = filteredEvents.slice(
    (currentPage - 1) * eventsPerPage,
    currentPage * eventsPerPage
  );

  // ================== RENDER ==================
  return (
    <div className="p-4 bg-gray-50 dark:bg-gray-900 min-h-screen text-gray-800 dark:text-white">
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Header & Search */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
        <h1 className="text-2xl font-bold mb-4 md:mb-0">Quản lý sự kiện CLB</h1>
        <div className="flex gap-2 flex-wrap">
          <input
            type="text"
            placeholder="Tìm sự kiện..."
            className="p-2 border rounded w-64 dark:bg-gray-800 dark:text-white"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button
            onClick={() => {
              setShowForm(true);
              setFormData({
                title: "",
                description: "",
                location: "",
                startAt: "",
                endAt: "",
                capacity: "",
                status: "upcoming",
                bannerUrl: "",
              });
            }}
            className="px-6 py-3 font-bold text-white rounded shadow-lg bg-gradient-to-r from-cyan-500 via-blue-500 to-blue-600 hover:from-cyan-600 hover:via-blue-600 hover:to-blue-700"
          >
            Tạo sự kiện mới
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto shadow rounded-lg">
        <table className="min-w-full bg-white dark:bg-gray-800">
          <thead className="bg-blue-100 text-blue-800 dark:bg-gray-700 dark:text-white">
            <tr>
              <th className="py-2 px-4 text-left">Tiêu đề</th>
              <th className="py-2 px-4 text-left w-30">Bắt đầu</th>
              <th className="py-2 px-2 text-center w-24">Tối đa</th>
              <th className="py-2 px-2 text-center w-24">Đăng ký</th>
              <th className="py-2 px-2 text-center w-24">Đã tham gia</th>
              <th className="py-2 px-4 text-center">Mô tả</th>
              <th className="py-2 px-6 text-center">Trạng thái</th>
              <th className="py-2 px-2 text-center">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {currentEvents.map((event, idx) => (
              <tr
                key={event._id ?? idx}
                className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                onClick={() => {
                  if (
                    window.confirm(
                      `Xem danh sách thành viên sự kiện "${event.title}"?`
                    )
                  ) {
                    setSelectedEventId(event._id);
                    setShowMembers(true);
                  }
                }}
              >
                <td className="py-4 px-4 font-semibold">{event.title}</td>
                <td className="py-4 px-4">
                  {new Date(event.startAt).toLocaleString("vi-VN", {
                    hour12: false,
                  })}
                </td>
                <td className="py-4 px-2 text-center">{event.capacity}</td>
                <td className="py-4 px-2 text-center">
                  {event.participantsCount}
                </td>
                <td className="py-4 px-2 text-center text-green-600 font-semibold">
                  {event.attendedCount ?? 0}
                </td>
                <td className="py-4 px-4">{event.description}</td>
                <td className="py-4 px-6 text-center">
                  <span
                    className={`px-4 py-1.5 rounded-full text-white text-sm font-semibold 
                      ${event.status === "upcoming"
                        ? "bg-gradient-to-r from-cyan-500 via-blue-500 to-blue-600"
                        : event.status === "ongoing"
                          ? "bg-gradient-to-r from-green-400 via-green-500 to-green-600"
                          : event.status === "finished"
                            ? "bg-gradient-to-r from-gray-500 via-gray-600 to-gray-700"
                            : "bg-gradient-to-r from-red-500 via-red-600 to-red-700"
                      }`}
                  >
                    {event.status === "upcoming"
                      ? "Sắp diễn ra"
                      : event.status === "ongoing"
                        ? "Đang diễn ra"
                        : event.status === "finished"
                          ? "Đã kết thúc"
                          : "Đã hủy"}
                  </span>
                </td>
                <td className="py-4 px-2 flex justify-center gap-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEdit(event);
                    }}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <FiEdit size={16} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(event._id);
                    }}
                    className="text-red-600 hover:text-red-800"
                  >
                    <FiTrash size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-4 flex justify-center gap-2">
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

      {/* Form */}
      {showForm && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 w-full max-w-3xl rounded-lg shadow-lg p-6 overflow-y-auto">
            <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-600 bg-clip-text text-transparent">
              {editId ? "Sửa sự kiện" : "Tạo sự kiện mới"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">

              {/* Tiêu đề + Banner */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1 font-semibold">Tiêu đề</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block mb-1 font-semibold">Banner sự kiện</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) handleUploadBanner(file);
                    }}
                    className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
                  />
                  {formData.bannerUrl && (
                    <img
                      src={`http://localhost:3001${formData.bannerUrl}`}
                      alt="Banner"
                      className="mt-2 rounded-lg shadow max-h-32 object-cover"
                    />
                  )}
                </div>
              </div>

              {/* Bắt đầu + Kết thúc */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1 font-semibold">Bắt đầu</label>
                  <input
                    type="datetime-local"
                    name="startAt"
                    value={formData.startAt}
                    onChange={handleChange}
                    className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block mb-1 font-semibold">Kết thúc</label>
                  <input
                    type="datetime-local"
                    name="endAt"
                    value={formData.endAt}
                    onChange={handleChange}
                    className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
                    required
                  />
                </div>
              </div>

              {/* Địa chỉ */}
              <div>
                <label className="block mb-1 font-semibold">Địa chỉ</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
                  required
                />
              </div>

              {/* Số lượng + Trạng thái */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1 font-semibold">Số lượng tối đa</label>
                  <input
                    type="number"
                    name="capacity"
                    value={formData.capacity}
                    onChange={handleChange}
                    className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
                    min={1}
                  />
                </div>
                <div>
                  <label className="block mb-1 font-semibold">Trạng thái</label>
                  {editId ? (
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleChange}
                      className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
                    >
                      {formData.status === "upcoming" && (
                        <>
                          <option value="upcoming">Sắp diễn ra</option>
                          <option value="cancelled">Đã hủy</option>
                        </>
                      )}
                      {formData.status === "ongoing" && (
                        <>
                          <option value="ongoing">Đang diễn ra</option>
                          <option value="finished">Đã kết thúc</option>
                        </>
                      )}
                      {formData.status === "finished" && (
                        <option value="finished">Đã kết thúc</option>
                      )}
                      {formData.status === "cancelled" && (
                        <option value="cancelled">Đã hủy</option>
                      )}
                    </select>
                  ) : (
                    <input
                      type="text"
                      value="Sắp diễn ra"
                      disabled
                      className="w-full p-2 border rounded bg-gray-200 dark:bg-gray-700 dark:text-white"
                    />
                  )}
                </div>
              </div>

              {/* Mô tả */}
              <div>
                <label className="block mb-1 font-semibold">Mô tả</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
                  rows={4}
                />
              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-4 pt-4">
                <button
                  type="submit"
                  className="px-6 py-3 font-bold text-white rounded shadow-lg bg-gradient-to-r from-cyan-500 via-blue-500 to-blue-600 hover:from-cyan-600 hover:via-blue-600 hover:to-blue-700"
                >
                  {editId ? "Cập nhật" : "Tạo"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setFormData({
                      title: "",
                      description: "",
                      location: "",
                      startAt: "",
                      endAt: "",
                      capacity: "",
                      status: "upcoming",
                      bannerUrl: "",
                    });
                    setEditId(null);
                  }}
                  className="px-6 py-3 font-bold text-white rounded shadow-lg bg-gradient-to-r from-red-500 via-red-600 to-red-700 hover:from-red-600 hover:via-red-700 hover:to-red-800"
                >
                  Huỷ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal thành viên */}
      {showMembers && selectedEventId && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 w-full max-w-3xl rounded-lg shadow-lg p-6 overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Danh sách thành viên</h2>
              <button
                onClick={() => setShowMembers(false)}
                className="px-4 py-2 font-bold text-white rounded shadow-lg bg-gradient-to-r from-pink-500 via-red-500 to-red-600 hover:from-pink-600 hover:via-red-600 hover:to-red-700"
              >
                Đóng
              </button>
            </div>
            <EventMember
              eventId={selectedEventId}
              eventTitle={events.find((e) => e._id === selectedEventId)?.title}
              eventStatus={
                events.find((e) => e._id === selectedEventId)?.status
              }
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default EventManagement;
