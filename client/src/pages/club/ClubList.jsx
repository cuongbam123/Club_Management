import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ClubDetail from "./ClubDetail";

// Dữ liệu CLB mẫu
const clubsNotJoined = [
    {
        _id: "c1",
        name: "CLB Văn Hóa",
        description: "CLB Văn Hóa dành cho những bạn yêu thích văn hóa.",
        logoUrl: "https://cdn.hoabinhevents.com/hcmc/wp-content/uploads/2024/05/23091703/mau-thiet-ke-backdrop-le-ky-niem.jpg",
        president: "Nguyễn Văn A"
    },
    {
        _id: "c2",
        name: "CLB Thể Thao",
        description: "CLB Thể Thao giúp bạn rèn luyện thể chất và tinh thần đồng đội.",
        logoUrl: "https://images.tkbcdn.com/2/608/332/ts/ds/a6/0a/4a/60e9e35f58d00a4df2f987fe5f02803c.jpg",
        president: "Trần Thị B"
    },
    {
        _id: "c3",
        name: "CLB Công Nghệ",
        description: "CLB Công Nghệ dành cho các bạn yêu thích lập trình và công nghệ mới.",
        logoUrl: "https://images.tkbcdn.com/2/608/332/ts/ds/ce/24/eb/0f20e8747f8181763f81d26d989e46bd.png",
        president: "Lê Văn C"
    },
];

export default function ClubList() {
    const [selectedClub, setSelectedClub] = useState(null);
    const navigate = useNavigate();

    // Callback khi join CLB
    const handleJoinClub = (club) => {
        navigate("/event-club", { state: { club } });
    };

    return (
        <div
            className="
                min-h-screen p-6
                bg-white
                dark:bg-[url('https://phongvu.vn/cong-nghe/wp-content/uploads/2024/09/hinh-nen-trung-thu-cho-dien-thoai-va-may-tinh-23-1.png')]
                dark:bg-cover dark:bg-center dark:bg-fixed
                transition-colors duration-500
            "
        >
            <div className="max-w-3xl mx-auto bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-6">
                {selectedClub ? (
                    <ClubDetail
                        club={selectedClub}
                        onBack={() => setSelectedClub(null)}
                        onJoin={handleJoinClub}
                    />
                ) : (
                    <>
                        <h2
                            className="text-4xl font-extrabold mt-5 mb-8 text-center
                            bg-gradient-to-r from-cyan-400 via-blue-500 to-blue-800
                            bg-clip-text text-transparent drop-shadow-md italic tracking-widest"
                        >
                            Danh sách CLB
                        </h2>

                        <ul className="space-y-4 w-full">
                            {clubsNotJoined.map((club) => (
                                <li
                                    key={club._id}
                                    className="flex items-center p-6 border border-gray-300 rounded-xl cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-all shadow-lg w-full"
                                    onClick={() => setSelectedClub(club)}
                                >
                                    <img
                                        src={club.logoUrl}
                                        alt={club.name}
                                        className="w-24 h-24 rounded-lg mr-6 object-cover shadow-md"
                                    />
                                    <div>
                                        <p className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">
                                            {club.name}
                                        </p>

                                        <p className="text-gray-600 dark:text-gray-300 text-lg">{club.description}</p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </>
                )}
            </div>
        </div>
    );
}
