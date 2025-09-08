import React, { useState } from "react";
import { IoMail, IoLockClosed, IoCall } from "react-icons/io5";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import background from "../../assets/hehe.jpg";
import axios from "axios";

export default function ForgotPassword() {
  const [formData, setFormData] = useState({
    email: "",
    phone: "",
    newPassword: "",
  });
  const [toggleOn, setToggleOn] = useState(false);
  const [loading, setLoading] = useState(false);

  const API_URL = process.env.REACT_APP_API_URL;

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post(`${API_URL}/auth/forgot-password`, formData);

      toast.success("Password updated successfully!", {
        position: "top-center",
        autoClose: 2000,
        onClose: () => {
          window.location.href = "/login";
        },
      });
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to reset password!", {
        position: "top-center",
        autoClose: 2000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="flex justify-center items-center min-h-screen bg-black bg-cover bg-center"
      style={{ backgroundImage: `url(${background})` }}
    >
      <ToastContainer />
      <div
        className={`relative w-[400px] p-8 rounded-2xl shadow-lg transition-all duration-500
        ${toggleOn ? "bg-cyan-950/70 shadow-cyan-400/60" : "bg-neutral-900"}`}
      >
        {/* Toggle switch */}
        <div className="absolute -right-20 top-8 flex flex-col items-center">
          <button
            onClick={() => setToggleOn(!toggleOn)}
            className={`w-16 h-10 flex items-center justify-center rounded-lg font-semibold uppercase text-sm
            transition-all duration-500
            ${toggleOn
              ? "bg-cyan-400 text-black shadow-lg shadow-cyan-500"
              : "bg-gray-700 text-gray-300"}`}
          >
            {toggleOn ? "ON" : "OFF"}
          </button>
        </div>

        <h2
          className={`text-2xl font-bold text-center mb-6 transition-all duration-500
          ${toggleOn ? "text-cyan-400 drop-shadow-[0_0_10px_#22d3ee]" : "text-white"}`}
        >
          Forgot Password
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email */}
          <div className="relative">
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Email"
              className={`w-full bg-transparent border-b-2 px-2 pt-4 pb-2 focus:outline-none transition-all
              ${toggleOn
                ? "border-cyan-400 text-cyan-300 placeholder-cyan-400 focus:border-cyan-300"
                : "border-gray-500 text-white placeholder-gray-400 focus:border-white"}`}
            />
            <IoMail
              className={`absolute right-2 top-4 text-xl transition-all
              ${toggleOn ? "text-cyan-400" : "text-gray-400"}`}
            />
          </div>

          {/* Phone */}
          <div className="relative">
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              placeholder="Phone"
              className={`w-full bg-transparent border-b-2 px-2 pt-4 pb-2 focus:outline-none transition-all
              ${toggleOn
                ? "border-cyan-400 text-cyan-300 placeholder-cyan-400 focus:border-cyan-300"
                : "border-gray-500 text-white placeholder-gray-400 focus:border-white"}`}
            />
            <IoCall
              className={`absolute right-2 top-4 text-xl transition-all
              ${toggleOn ? "text-cyan-400" : "text-gray-400"}`}
            />
          </div>

          {/* New Password */}
          <div className="relative">
            <input
              type="password"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              required
              placeholder="New Password"
              className={`w-full bg-transparent border-b-2 px-2 pt-4 pb-2 focus:outline-none transition-all
              ${toggleOn
                ? "border-cyan-400 text-cyan-300 placeholder-cyan-400 focus:border-cyan-300"
                : "border-gray-500 text-white placeholder-gray-400 focus:border-white"}`}
            />
            <IoLockClosed
              className={`absolute right-2 top-4 text-xl transition-all
              ${toggleOn ? "text-cyan-400" : "text-gray-400"}`}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 rounded-full font-semibold transition-all
            ${toggleOn
              ? "bg-cyan-400 text-black shadow-lg shadow-cyan-500"
              : "bg-white text-black hover:bg-gray-200"}`}
          >
            {loading ? "Updating..." : "Update Password"}
          </button>

          <div
            className={`text-center text-sm transition-all
            ${toggleOn ? "text-cyan-400" : "text-gray-300"}`}
          >
            <p>
              Remember your password?{" "}
              <a href="/login" className="font-semibold hover:underline">
                Login
              </a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
