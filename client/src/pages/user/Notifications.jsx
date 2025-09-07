import React from "react";

const notifications = [
    "Ngày mai họp CLB Văn Hóa lúc 18h tại phòng A2",
    "Sự kiện Giải Thể Thao bắt đầu lúc 7h sáng thứ 7",
];

export default function Notifications() {
    return (
        <div style={{ padding: "20px" }}>
            <h2>Thông báo</h2>
            <ul>
                {notifications.map((note, index) => (
                    <li key={index}>{note}</li>
                ))}
            </ul>
        </div>
    );
}
