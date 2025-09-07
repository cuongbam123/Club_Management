import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const API_URL = process.env.REACT_APP_API_URL;

const EventMember = ({ eventId, eventTitle, eventStatus }) => {
  const [members, setMembers] = useState([]);
  const [search, setSearch] = useState("");
  const [attendance, setAttendance] = useState({});
  const [isModified, setIsModified] = useState(false);

  const token = localStorage.getItem("token");

  // ================== FETCH MEMBERS ==================
  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const res = await axios.get(`${API_URL}/events/${eventId}/participants`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const attendedRes = await axios.get(
          `${API_URL}/events/${eventId}/attendance`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const attendedIds = attendedRes.data.map((m) => m._id);

        const data = res.data.map((m) => ({
          userId: m._id,
          fullname: m.name,
          email: m.email,
          phone: m.phone || "Chưa có",
        }));

        setMembers(data);

        const initial = {};
        data.forEach((m) => {
          initial[m.userId] = attendedIds.includes(m.userId);
        });
        setAttendance(initial);
        setIsModified(false);
      } catch (err) {
        console.error("❌ Lỗi khi tải thành viên:", err);
        toast.error("Không tải được danh sách thành viên");
      }
    };

    if (eventId) fetchMembers();
  }, [eventId, token]);

  // ================== HANDLE ==================
  const filteredMembers = members.filter((member) =>
    member.fullname?.toLowerCase().includes(search.toLowerCase())
  );

  const handleCheck = (userId, checked) => {
    setAttendance({
      ...attendance,
      [userId]: checked,
    });
    setIsModified(true);
  };

  const handleSave = async () => {
  try {
    // Lấy danh sách user đã tick
    const userIds = Object.entries(attendance)
      .filter(([id, checked]) => checked)
      .map(([id]) => id);

    if (userIds.length === 0) {
      toast.warning("Chưa chọn ai để điểm danh!");
      return;
    }

    await axios.post(
      `${API_URL}/events/${eventId}/checkin/bulk`,
      { userIds }, // 👈 gửi 1 lần mảng userIds
      { headers: { Authorization: `Bearer ${token}` } }
    );

    toast.success("Điểm danh thành công!");
    setIsModified(false);
  } catch (err) {
    console.error("❌ Lỗi điểm danh:", err);
    toast.error("Lỗi khi lưu điểm danh");
  }
};


  // ================== UI ==================
  return (
    <div className="p-4">
      {/* Search + Title */}
      <div className="mb-4 flex items-center justify-between">
        <input
          type="text"
          placeholder="Tìm kiếm theo tên"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-gray-300 rounded px-3 py-2 w-48 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <h2 className="text-2xl font-bold text-center flex-1">{eventTitle}</h2>
        <div className="w-48 text-right font-semibold">
          {eventStatus === "ongoing"
            ? "🔵 Đang diễn ra"
            : eventStatus === "upcoming"
            ? "🟡 Chưa bắt đầu"
            : eventStatus === "finished"
            ? "⚫ Đã kết thúc"
            : "🔴 Đã hủy"}
        </div>
      </div>

      <p className="mt-2 text-sm text-gray-600">
        Tổng: {members.length} | Đã điểm danh: {Object.values(attendance).filter(v => v).length} | Chưa: {Object.values(attendance).filter(v => !v).length}
      </p>

      {filteredMembers.length > 0 ? (
        <div className="overflow-x-auto max-h-[400px] overflow-y-auto shadow rounded-lg">
          <table className="min-w-full border border-gray-300 border-collapse bg-white dark:bg-gray-800">
            <thead className="bg-blue-500 text-white sticky top-0">
              <tr>
                <th className="py-2 px-4 border">STT</th>
                <th className="py-2 px-4 border">Tên</th>
                <th className="py-2 px-4 border">Email</th>
                <th className="py-2 px-4 border">SĐT</th>
                <th className="py-2 px-4 border">Trạng thái</th>
                <th className="py-2 px-4 border">Điểm danh</th>
              </tr>
            </thead>
            <tbody>
              {filteredMembers.map((member, index) => (
                <tr
                  key={member.userId}
                  className="text-center hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <td className="py-2 px-4 border">{index + 1}</td>
                  <td className="py-2 px-4 border">{member.fullname}</td>
                  <td className="py-2 px-4 border">{member.email}</td>
                  <td className="py-2 px-4 border">{member.phone}</td>
                  <td
                    className={`py-2 px-4 border font-semibold ${
                      attendance[member.userId]
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {attendance[member.userId] ? "Đã điểm danh" : "Chưa điểm danh"}
                  </td>
                  <td className="py-2 px-4 border">
                    <input
                      type="checkbox"
                      checked={attendance[member.userId] || false}
                      disabled={eventStatus !== "ongoing"} // ⛔ chỉ cho tick khi ongoing
                      onChange={(e) => handleCheck(member.userId, e.target.checked)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="mt-4 text-center text-gray-500">
          Không tìm thấy thành viên nào.
        </p>
      )}

      {/* Save button */}
      {isModified && eventStatus === "ongoing" && (
        <div className="flex justify-end mt-4">
          <button
            onClick={handleSave}
            className="px-6 py-2 font-bold text-white rounded shadow-lg bg-gradient-to-r from-green-400 via-green-500 to-green-600 hover:from-green-500 hover:via-green-600 hover:to-green-700 transition-all duration-300"
          >
            Lưu điểm danh
          </button>
        </div>
      )}
    </div>
  );
};

export default EventMember;
