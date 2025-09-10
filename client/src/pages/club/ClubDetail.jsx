import React, { useState } from "react";
import axios from "axios";
import { makeFullUrl } from "../../utils/urls";

const API = process.env.REACT_APP_API_URL || "http://localhost:3001/api";

export default function ClubDetail({ club, onJoin, onBack }) {
  const [joinedState, setJoinedState] = useState("none"); // none | waiting | joined

  const handleJoinClick = async () => {
    try {
      setJoinedState("waiting");
      const token = localStorage.getItem("token");
      await axios.post(
        `${API}/clubs/${club._id}/join`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setJoinedState("joined");
      if (onJoin) onJoin(club);
    } catch (err) {
      console.error("Join club failed:", err);
      setJoinedState("none");
    }
  };

  return (
    <div
      className="p-6 max-w-3xl mx-auto rounded-2xl shadow-lg text-center relative 
           bg-white/80 dark:bg-gray-900/80 backdrop-blur-md"
      style={{ marginTop: "30px" }}
    >
      <button
        onClick={onBack}
        className="absolute top-4 left-4 p-2 
         bg-gradient-to-r from-cyan-400 to-blue-500 
         text-white font-bold rounded-full shadow-lg
         hover:from-cyan-500 hover:to-blue-600 
         transition-all"
        title="Quay lại"
      >
        ←
      </button>

      <img
        src={makeFullUrl(club.logoUrl) || "/fallback.png"}
        alt={club.name}
        className="mx-auto mb-6 shadow-lg rounded-xl"
        style={{ width: "100%", maxWidth: "550px", height: "auto", marginTop: "40px" }}
      />

      <h1 className="text-3xl font-bold mb-2 dark:text-white">{club.name}</h1>
      <p className="text-gray-600 dark:text-gray-300 mb-2">
        <strong>Chủ nhiệm:</strong> {club.president?.name || "Chưa có"}
      </p>
      <p className="text-gray-700 dark:text-gray-400 mb-6">{club.description}</p>

      {joinedState === "none" && (
        <button
          className="px-6 py-3 bg-gradient-to-r from-green-400 to-blue-500 
           text-white font-semibold rounded-xl shadow-lg hover:shadow-xl 
           transition transform hover:-translate-y-1"
          onClick={handleJoinClick}
        >
          Tham gia CLB
        </button>
      )}

      {joinedState === "waiting" && (
        <button
          disabled
          className="px-6 py-3 bg-yellow-400 text-white font-semibold rounded-xl 
           shadow-lg cursor-not-allowed"
        >
          Chờ xác nhận...
        </button>
      )}

      {joinedState === "joined" && (
        <button
          disabled
          className="px-6 py-3 bg-green-500 text-white font-semibold rounded-xl 
           shadow-lg cursor-not-allowed"
        >
          Đã tham gia
        </button>
      )}
    </div>
  );
}
