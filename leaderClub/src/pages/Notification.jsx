import React, { useState } from "react";
import { toast } from "react-toastify";
import { Edit, Trash2, Send } from "lucide-react";

export default function NotificationManagement() {
    const [notifications, setNotifications] = useState([
        {
            id: 1,
            title: "Thông báo họp CLB",
            content: "Ngày mai họp CLB lúc 18h tại phòng A2.",
            sender: "Leader CLB",
            date: "2025-09-01",
            readers: 12,
            file: "hopclb.pdf",
            receiverType: "all",
        },
        {
            id: 2,
            title: "Sự kiện dã ngoại",
            content: "Thứ 7 tuần này có dã ngoại, đăng ký trước ngày 5/9.",
            sender: "Leader CLB",
            date: "2025-08-30",
            readers: 25,
            file: null,
            receiverType: "role",
        },
    ]);

    const [selected, setSelected] = useState(null); // để xem chi tiết
    const [search, setSearch] = useState("");
    const [filterDate, setFilterDate] = useState("");
    const [showForm, setShowForm] = useState(false); // form tạo/sửa
    const [editingNoti, setEditingNoti] = useState(null);

    const [form, setForm] = useState({
        title: "",
        content: "",
        file: null,
        receiverType: "all",
    });

    // ----------------- FORM -----------------
    const openAddForm = () => {
        setEditingNoti(null);
        setForm({ title: "", content: "", file: null, receiverType: "all" });
        setShowForm(true);
    };

    const openEditForm = (noti) => {
        setEditingNoti(noti);
        setForm({
            title: noti.title,
            content: noti.content,
            file: null,
            receiverType: noti.receiverType || "all",
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

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!form.title || !form.content) {
            toast.error("Vui lòng nhập đầy đủ Tiêu đề và Nội dung!");
            return;
        }

        if (editingNoti) {
            // update
            const updated = notifications.map((n) =>
                n.id === editingNoti.id ? { ...n, ...form } : n
            );
            setNotifications(updated);
            toast.success("Đã cập nhật thông báo!");
        } else {
            // add
            const newNoti = {
                id: notifications.length + 1,
                title: form.title,
                content: form.content,
                sender: "Leader CLB",
                date: new Date().toISOString().slice(0, 10),
                readers: 0,
                receiverType: form.receiverType,
                file: form.file ? form.file.name : null,
            };
            setNotifications([newNoti, ...notifications]);
            toast.success("Đã gửi thông báo!");
        }

        setShowForm(false);
    };

    // ----------------- DELETE -----------------
    const handleDelete = (id) => {
        if (!window.confirm("Bạn có chắc muốn xoá thông báo này?")) return;
        setNotifications(notifications.filter((n) => n.id !== id));
        toast.success("Đã xoá thông báo!");
    };

    // ----------------- FILTER -----------------
    const filteredNotifications = notifications.filter((n) => {
        const matchSearch = n.title.toLowerCase().includes(search.toLowerCase());
        const matchDate = filterDate ? n.date === filterDate : true;
        return matchSearch && matchDate;
    });

    // ----------------- RENDER -----------------
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

            {/* Filter và tìm kiếm */}
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
                        <th className="py-2 px-4 text-left">Số người đã đọc</th>
                        <th className="py-2 px-4 text-left">Thao tác</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredNotifications.map((n) => (
                        <tr
                            key={n.id}
                            className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                            onClick={() => setSelected(n)} // 👉 click row để xem chi tiết
                        >
                            <td className="py-2 px-4">{n.title}</td>
                            <td className="py-2 px-4">{n.date}</td>
                            <td className="py-2 px-4">{n.sender}</td>
                            <td className="py-2 px-4">{n.readers}</td>
                            <td className="py-2 px-4 flex gap-2">
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation(); // tránh mở modal xem
                                        openEditForm(n);
                                    }}
                                    className="text-blue-600 hover:text-blue-800"
                                >
                                    <Edit size={18} />
                                </button>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation(); // tránh mở modal xem
                                        handleDelete(n.id);
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
                            {selected.date} - {selected.sender}
                        </p>
                        <p className="mb-4">{selected.content}</p>

                        {selected.file && (
                            <p className="mb-4">
                                📎{" "}
                                <a
                                    href={`/${selected.file}`}
                                    className="text-blue-600 underline"
                                    download
                                >
                                    {selected.file}
                                </a>
                            </p>
                        )}

                        <p className="mb-4">
                            <strong>Người nhận:</strong>{" "}
                            {selected.receiverType === "all"
                                ? "Tất cả thành viên"
                                : selected.receiverType === "role"
                                    ? "Theo nhóm vai trò"
                                    : "Theo danh sách chọn"}
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
                                    <option value="role">Theo nhóm vai trò</option>
                                    <option value="list">Theo danh sách chọn</option>
                                </select>
                            </div>
                            <div className="flex justify-end gap-4 pt-4">
                                {/* Nút Gửi / Lưu */}
                                <button
                                    type="submit"
                                    className="relative inline-flex items-center justify-center px-6 py-3 overflow-hidden font-bold text-white rounded shadow-lg group
      bg-gradient-to-r from-green-500 via-green-600 to-green-700
      hover:from-green-600 hover:via-green-700 hover:to-green-800
      transition-all duration-300"
                                >
                                    <span className="absolute inset-0 flex items-center justify-center w-full h-full duration-300 transform translate-x-full
      bg-white bg-opacity-10 group-hover:translate-x-0"></span>
                                    <span className="relative z-10">{editingNoti ? "Lưu" : "Gửi"}</span>
                                </button>

                                {/* Nút Huỷ */}
                                <button
                                    type="button"
                                    onClick={() => setShowForm(false)}
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
}
