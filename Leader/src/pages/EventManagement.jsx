import React, { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { FiEdit, FiTrash } from "react-icons/fi";
import Members from "./MemberManagement"; // Component danh sách thành viên

const EventManagement = () => {
    const [events, setEvents] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [showForm, setShowForm] = useState(false);
    const [editId, setEditId] = useState(null);
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        startAt: "",
        endAt: "",
        capacity: "",
        status: "upcoming", // Thêm status
    });

    const [selectedEventId, setSelectedEventId] = useState(null);
    const [showMembers, setShowMembers] = useState(false);

    const eventsPerPage = 5;

    useEffect(() => {
        // Fake data
        const fakeEvents = [
            { _id: "1", title: "Đại hội CLB", description: "Hội nghị thường niên", startAt: "2025-09-10T09:00", endAt: "2025-09-10T12:00", capacity: 50, participantsCount: 20, attendedCount: 15, status: "upcoming" },
            { _id: "2", title: "Workshop React", description: "Học React cơ bản", startAt: "2025-09-12T14:00", endAt: "2025-09-12T17:00", capacity: 30, participantsCount: 25, attendedCount: 20, status: "ongoing" },
            { _id: "3", title: "Team Building", description: "Hoạt động ngoài trời", startAt: "2025-09-15T08:00", endAt: "2025-09-15T18:00", capacity: 40, participantsCount: 35, attendedCount: 30, status: "finished" },
            { _id: "4", title: "Hội thảo AI", description: "Giới thiệu AI và ML", startAt: "2025-09-20T10:00", endAt: "2025-09-20T12:00", capacity: 25, participantsCount: 10, attendedCount: 10, status: "upcoming" },
            { _id: "5", title: "Workshop NodeJS", description: "Thực hành NodeJS", startAt: "2025-09-22T13:00", endAt: "2025-09-22T16:00", capacity: 30, participantsCount: 15, attendedCount: 12, status: "upcoming" },
            { _id: "6", title: "Cuộc thi lập trình", description: "Thử thách coding", startAt: "2025-09-25T09:00", endAt: "2025-09-25T12:00", capacity: 50, participantsCount: 40, attendedCount: 35, status: "upcoming" },
            { _id: "7", title: "Học Python nâng cao", description: "Workshop Python nâng cao", startAt: "2025-09-28T14:00", endAt: "2025-09-28T17:00", capacity: 35, participantsCount: 20, attendedCount: 18, status: "upcoming" },
            { _id: "8", title: "Ngày hội thể thao", description: "Thi đấu thể thao nội bộ", startAt: "2025-10-01T08:00", endAt: "2025-10-01T18:00", capacity: 60, participantsCount: 50, attendedCount: 48, status: "upcoming" },
            { _id: "9", title: "Talkshow CEO", description: "Chia sẻ kinh nghiệm startup", startAt: "2025-10-05T10:00", endAt: "2025-10-05T12:00", capacity: 40, participantsCount: 30, attendedCount: 25, status: "upcoming" },
            { _id: "10", title: "Workshop CSS & Tailwind", description: "Thiết kế UI/UX", startAt: "2025-10-08T13:00", endAt: "2025-10-08T16:00", capacity: 30, participantsCount: 20, attendedCount: 18, status: "upcoming" },
            { _id: "11", title: "Đêm Gala CLB", description: "Tiệc tổng kết năm", startAt: "2025-10-12T18:00", endAt: "2025-10-12T22:00", capacity: 80, participantsCount: 70, attendedCount: 65, status: "upcoming" },

        ];

        setEvents(fakeEvents);

    }, []);

    const filteredEvents = events.filter((e) =>
        e.title?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalPages = Math.ceil(filteredEvents.length / eventsPerPage);
    const currentEvents = filteredEvents.slice(
        (currentPage - 1) * eventsPerPage,
        currentPage * eventsPerPage
    );

    const handleEdit = (event) => {
        setFormData({
            title: event.title,
            description: event.description,
            startAt: event.startAt,
            endAt: event.endAt,
            capacity: event.capacity,
            status: event.status, // Lấy trạng thái
        });
        setEditId(event._id);
        setShowForm(true);
    };

    const handleDelete = (id) => {
        if (!window.confirm("Bạn có chắc muốn huỷ sự kiện này?")) return;
        setEvents(events.filter(e => e._id !== id));
        toast.success("Huỷ sự kiện thành công!");
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editId) {
            setEvents(events.map(e => e._id === editId ? {
                ...formData,
                _id: editId,
                participantsCount: events.find(ev => ev._id === editId)?.participantsCount || 0,
                attendedCount: events.find(ev => ev._id === editId)?.attendedCount || 0
            } : e));
            toast.success("Cập nhật sự kiện thành công!");
        } else {
            const newEvent = {
                ...formData,
                _id: (events.length + 1).toString(),
                participantsCount: 0,
                attendedCount: 0
            };
            setEvents([newEvent, ...events]);
            toast.success("Tạo sự kiện mới thành công!");
        }
        setShowForm(false);
        setFormData({ title: "", description: "", startAt: "", endAt: "", capacity: "", status: "upcoming" });
        setEditId(null);
    };

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
                            setFormData({ title: "", description: "", startAt: "", endAt: "", capacity: "", status: "upcoming" });
                        }}
                        className="relative inline-flex items-center justify-center px-6 py-3 overflow-hidden font-bold text-white rounded shadow-lg group
             bg-gradient-to-r from-cyan-500 via-blue-500 to-blue-600
             hover:from-cyan-600 hover:via-blue-600 hover:to-blue-700
             transition-all duration-300"
                    >
                        <span className="absolute inset-0 flex items-center justify-center w-full h-full duration-300 transform translate-x-full
                   bg-white bg-opacity-10 group-hover:translate-x-0"></span>
                        <span className="relative z-10">Tạo sự kiện mới</span>
                    </button>

                </div>
            </div>

            {/* Bảng sự kiện */}
            <div className="overflow-x-auto shadow rounded-lg">
                <table className="min-w-full bg-white dark:bg-gray-800">
                    <thead className="bg-blue-100 text-blue-800 dark:bg-gray-700 dark:text-white">
                        <tr>
                            <th className="py-2 px-4 text-left">Tiêu đề</th>
                            <th className="py-2 px-4 text-left w-30">Bắt đầu lúc</th>
                            <th className="py-2 px-2 text-center w-24">Người tối đa</th>
                            <th className="py-2 px-2 text-center w-24">Đã đăng kí</th>
                            <th className="py-2 px-2 text-center w-24">Tham gia</th>
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
                                    if (window.confirm(`Bạn có muốn xem danh sách thành viên sự kiện "${event.title}" không?`)) {
                                        setSelectedEventId(event._id);
                                        setShowMembers(true);
                                    }
                                }}
                            >
                                <td className="py-4 px-4 font-semibold">{event.title}</td>
                                <td className="py-4 px-4">
                                    {new Date(event.startAt).toLocaleString("vi-VN", { hour12: false })}
                                </td>
                                <td className="py-4 px-2 text-center">{event.capacity}</td>
                                <td className="py-4 px-2 text-center">{event.participantsCount}</td>
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

                {filteredEvents.length === 0 && (
                    <p className="text-center mt-4 text-gray-500 dark:text-gray-400">
                        Không tìm thấy sự kiện phù hợp.
                    </p>
                )}
            </div>




            {/* Phân trang */}
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

            {/* Form tạo/sửa sự kiện */}
            {showForm && (
                <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-gray-800 w-full max-w-2xl rounded-lg shadow-lg p-6 overflow-y-auto">
                        <h2 className="text-2xl font-bold mb-6">{editId ? "Sửa sự kiện" : "Tạo sự kiện mới"}</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Tiêu đề */}
                            <div>
                                <label className="block mb-1">Tiêu đề</label>
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
                                    required
                                />
                            </div>

                            {/* Thời gian bắt đầu */}
                            <div>
                                <label className="block mb-1">Thời gian bắt đầu</label>
                                <input
                                    type="datetime-local"
                                    name="startAt"
                                    value={formData.startAt}
                                    onChange={handleChange}
                                    className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
                                    required
                                    min={(() => {
                                        const now = new Date();
                                        // Chuyển sang giờ VN
                                        const vnOffset = 7 * 60; // phút
                                        const localOffset = now.getTimezoneOffset();
                                        now.setMinutes(now.getMinutes() + (vnOffset + localOffset));
                                        now.setDate(now.getDate() + 1); // từ ngày mai
                                        now.setHours(0, 0, 0, 0);
                                        const yyyy = now.getFullYear();
                                        const mm = String(now.getMonth() + 1).padStart(2, "0");
                                        const dd = String(now.getDate()).padStart(2, "0");
                                        return `${yyyy}-${mm}-${dd}T00:00`;
                                    })()}
                                />
                            </div>

                            {/* Số lượng tối đa */}
                            <div>
                                <label className="block mb-1">Số lượng tối đa</label>
                                <input
                                    type="number"
                                    name="capacity"
                                    value={formData.capacity}
                                    onChange={handleChange}
                                    className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
                                    min={1}
                                />
                            </div>

                            {/* Số lượng đã đăng ký - chỉ hiển thị khi edit */}
                            {editId && (
                                <div>
                                    <label className="block mb-1">Số lượng đã đăng ký</label>
                                    <input
                                        type="number"
                                        value={events.find(e => e._id === editId)?.participantsCount || 0}
                                        disabled
                                        className="w-full p-2 border rounded bg-gray-200 dark:bg-gray-700 dark:text-white"
                                    />
                                </div>
                            )}

                            {/* Mô tả */}
                            <div>
                                <label className="block mb-1">Mô tả</label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
                                    rows={4}
                                />
                            </div>

                            {/* Trạng thái */}

                            <div>
                                <label className="block mb-1">Trạng thái</label>
                                {editId ? (
                                    <select
                                        name="status"
                                        value={formData.status}
                                        onChange={handleChange}
                                        className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
                                    >
                                        <option value="upcoming">Sắp diễn ra</option>
                                        <option value="ongoing">Đang diễn ra</option>
                                        <option value="finished">Đã kết thúc</option>
                                        <option value="cancelled">Đã hủy</option>
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

                            {/* Nút Tạo / Cập nhật */}
                            <div className="flex justify-end gap-4 pt-4">
                                {/* Nút Tạo / Cập nhật */}
                                <button
                                    type="submit"
                                    className="relative inline-flex items-center justify-center px-6 py-3 overflow-hidden font-bold text-white rounded shadow-lg group
               bg-gradient-to-r from-cyan-500 via-blue-500 to-blue-600
               hover:from-cyan-600 hover:via-blue-600 hover:to-blue-700
               transition-all duration-300"
                                >
                                    <span className="absolute inset-0 flex items-center justify-center w-full h-full duration-300 transform translate-x-full
                     bg-white bg-opacity-10 group-hover:translate-x-0"></span>
                                    <span className="relative z-10">{editId ? "Cập nhật" : "Tạo"}</span>
                                </button>

                                {/* Nút Huỷ */}
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowForm(false);
                                        setFormData({
                                            title: "",
                                            description: "",
                                            startAt: "",
                                            endAt: "",
                                            capacity: "",
                                            status: "upcoming",
                                        });
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



            {/* Modal danh sách thành viên */}
            {showMembers && selectedEventId && (
                <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-gray-800 w-full max-w-3xl rounded-lg shadow-lg p-6 overflow-y-auto">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-2xl font-bold">Danh sách thành viên</h2>
                            <button
                                onClick={() => setShowMembers(false)}
                                className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                            >
                                Đóng
                            </button>
                        </div>
                        <Members
                            eventId={selectedEventId}
                            eventTitle={events.find(e => e._id === selectedEventId)?.title}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default EventManagement;
