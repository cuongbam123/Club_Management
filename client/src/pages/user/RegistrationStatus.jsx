import React from "react";

export default function RegistrationStatus() {
    const registrations = [
        { id: 1, name: "Sự kiện Ngày Hội Văn Hóa", status: "Đã tham dự" },
        { id: 2, name: "Giải Thể Thao Mùa Xuân", status: "Chưa tham dự" },
    ];

    return (
        <div style={{ padding: "20px" }}>
            <h2>Trạng thái đăng ký / điểm danh</h2>
            <ul>
                {registrations.map((reg) => (
                    <li key={reg.id}>
                        {reg.name} - <strong>{reg.status}</strong>
                    </li>
                ))}
            </ul>
        </div>
    );
}
