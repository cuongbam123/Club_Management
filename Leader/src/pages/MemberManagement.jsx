import React, { useEffect, useState } from "react";

const Members = ({ eventId, eventTitle }) => {
  const [members, setMembers] = useState([]);
  const [search, setSearch] = useState("");
  const [attendance, setAttendance] = useState({});
  const [isModified, setIsModified] = useState(false); // để quản lý hiển thị nút Lưu

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        // MOCK DATA để test
        const mockData = [
          { userId: "1", fullname: "Nguyen Van A", email: "a@gmail.com", phone: "0123456789", status: "attended" },
          { userId: "2", fullname: "Tran Thi B", email: "b@gmail.com", phone: "0987654321", status: "registered" },
          { userId: "3", fullname: "Le Van C", email: "c@gmail.com", phone: "0112233445", status: "attended" },
          { userId: "4", fullname: "Pham Thi D", email: "d@gmail.com", phone: "0223344556", status: "registered" },
        ];

        setMembers(mockData);

        // Gán trạng thái ban đầu theo status
        const initial = {};
        mockData.forEach((m) => {
          initial[m.userId] = m.status === "attended";
        });
        setAttendance(initial);
        setIsModified(false); // reset khi load lại data
      } catch (err) {
        console.error("Lỗi khi tải danh sách thành viên:", err);
      }
    };

    if (eventId) fetchMembers();
  }, [eventId]);

  const filteredMembers = members.filter((member) =>
    member.fullname.toLowerCase().includes(search.toLowerCase())
  );

  const handleCheck = (userId, checked) => {
    setAttendance({
      ...attendance,
      [userId]: checked,
    });
    setIsModified(true); // khi có thay đổi thì hiện nút Lưu
  };

  const handleSave = () => {
    const updated = members.map((m) => ({
      ...m,
      status: attendance[m.userId] ? "attended" : "registered",
    }));

    console.log("Dữ liệu lưu điểm danh:", updated);

    // TODO: gọi API ở đây để cập nhật điểm danh thật
    setMembers(updated);
    setIsModified(false); // sau khi lưu thành công thì ẩn nút Lưu
  };

  return (
    <div className="p-4">
      {/* Thanh tìm kiếm + tiêu đề */}
      <div className="mb-4 flex items-center justify-between">
        <input
          type="text"
          placeholder="Tìm kiếm theo tên"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-gray-300 rounded px-3 py-2 w-48 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <h2 className="text-2xl font-bold text-center flex-1">{eventTitle}</h2>
        <div className="w-48"></div>
      </div>

      {filteredMembers.length > 0 ? (
        <div className="overflow-x-auto max-h-[400px] overflow-y-auto shadow rounded-lg">
          <table className="min-w-full border border-gray-300 border-collapse bg-white dark:bg-gray-800">
            <thead className="bg-blue-500 text-white sticky top-0">
              <tr>
                <th className="py-2 px-4 border border-gray-300">STT</th>
                <th className="py-2 px-4 border border-gray-300">Tên</th>
                <th className="py-2 px-4 border border-gray-300">Email</th>
                <th className="py-2 px-4 border border-gray-300">SĐT</th>
                <th className="py-2 px-4 border border-gray-300">Trạng thái</th>
                <th className="py-2 px-4 border border-gray-300">Điểm danh</th>
              </tr>
            </thead>
            <tbody>
              {filteredMembers.map((member, index) => (
                <tr
                  key={member.userId}
                  className="text-center hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <td className="py-2 px-4 border border-gray-300">{index + 1}</td>
                  <td className="py-2 px-4 border border-gray-300">{member.fullname}</td>
                  <td className="py-2 px-4 border border-gray-300">{member.email}</td>
                  <td className="py-2 px-4 border border-gray-300">{member.phone}</td>
                  <td
                    className={`py-2 px-4 border border-gray-300 font-semibold ${attendance[member.userId] ? "text-green-600" : "text-red-600"
                      }`}
                  >
                    {attendance[member.userId] ? "Đã điểm danh" : "Chưa điểm danh"}
                  </td>
                  <td className="py-2 px-4 border border-gray-300">
                    <input
                      type="checkbox"
                      checked={attendance[member.userId] || false}
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

      {/* Nút lưu điểm danh (chỉ hiện khi có thay đổi) */}
      {isModified && (
        <div className="flex justify-end mt-4">
          <button
            onClick={handleSave}
            className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
          >
            Lưu điểm danh
          </button>
        </div>
      )}
    </div>
  );
};

export default Members;
