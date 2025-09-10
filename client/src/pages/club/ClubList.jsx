import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ClubDetail from "./ClubDetail";
import EventClub from "./EventClub";
import { makeFullUrl } from "../../utils/urls";

const API = process.env.REACT_APP_API_URL || "http://localhost:3001/api";

export default function ClubList() {
  const [user, setUser] = useState(null);
  const [clubs, setClubs] = useState([]);
  const [selectedClub, setSelectedClub] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return navigate("/login");

        // lấy user hiện tại
        const meRes = await axios.get(`${API}/users/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        let me = meRes.data;

        // build user.club nếu BE chỉ trả clubName / clubLogo
        if (!me.club && (me.clubName || me.clubLogo)) {
          me.club = {
            _id: me.clubId || null,
            name: me.clubName,
            logoUrl: me.clubLogo,
          };
        }
        setUser(me);

        // lấy danh sách CLB
        const clubsRes = await axios.get(`${API}/clubs`);
        setClubs(clubsRes.data);
      } catch (err) {
        console.error("Error fetch data:", err);
      }
    };
    fetchData();
  }, [navigate]);

  // callback khi join CLB thành công
  const handleJoinClub = (club) => {
    setUser((prev) => ({ ...prev, club }));
  };

  if (!user) return <p className="text-center mt-10">Đang tải...</p>;

  // nếu user đã join CLB
  if (user.club?._id) {
    return <EventClub club={user.club} />;
  }

  // nếu chưa join thì hiển thị list
  return (
    <div
      className="min-h-screen p-6
        bg-white
        dark:bg-[url('https://phongvu.vn/cong-nghe/wp-content/uploads/2024/09/hinh-nen-trung-thu-cho-dien-thoai-va-may-tinh-23-1.png')]
        dark:bg-cover dark:bg-center dark:bg-fixed
        transition-colors duration-500"
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
              {clubs.map((club) => (
                <li
                  key={club._id}
                  className="flex items-center p-6 border border-gray-300 rounded-xl cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-all shadow-lg w-full"
                  onClick={() => setSelectedClub(club)}
                >
                  <img
                    src={makeFullUrl(club.logoUrl) || "/fallback.png"}
                    alt={club.name}
                    className="w-24 h-24 rounded-lg mr-6 object-cover shadow-md"
                  />
                  <div>
                    <p className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">
                      {club.name}
                    </p>
                    <p className="text-gray-600 dark:text-gray-300 text-lg">
                      {club.description}
                    </p>
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
