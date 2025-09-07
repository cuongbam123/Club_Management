import React, { useState } from "react";
import { IoMail, IoLockClosed } from "react-icons/io5";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import background from "../assets/hehe.jpg";
import axios from "axios";

export default function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [toggleOn, setToggleOn] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Gửi request login
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/auth/login`,
        formData
      );

      const { token } = res.data;
      localStorage.setItem("token", token);

      // 2. Lấy thông tin user từ token
      const resMe = await axios.get(
        `${process.env.REACT_APP_API_URL}/auth/me`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const user = resMe.data.user; // ✅ lấy đúng field user

      // 3. Check quyền
      if (user.role !== "clubadmin") {
        toast.error("Bạn không có quyền truy cập!");
        localStorage.removeItem("token");
        return;
      }

      // 4. Lưu user vào localStorage
      localStorage.setItem("user", JSON.stringify(user));

      // 5. Chuyển hướng về trang chủ
      window.location.href = "/";
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const inputs = [
    { name: "email", type: "email", label: "Email", icon: <IoMail /> },
    { name: "password", type: "password", label: "Password", icon: <IoLockClosed /> },
  ];

  return (
    <div
      className="flex justify-center items-center min-h-screen bg-black bg-cover bg-center"
      style={{ backgroundImage: `url(${background})` }}
    >
      <ToastContainer />
      <div
        className={`relative w-[400px] p-8 rounded-2xl shadow-lg transition-all duration-500 ${
          toggleOn ? "bg-cyan-950/70 shadow-cyan-400/60" : "bg-neutral-900"
        }`}
      >
        {/* Toggle switch */}
        <div className="absolute -right-20 top-8 flex flex-col items-center">
          <button
            onClick={() => setToggleOn(!toggleOn)}
            className={`w-16 h-10 flex items-center justify-center rounded-lg font-semibold uppercase text-sm transition-all duration-500 ${
              toggleOn
                ? "bg-cyan-400 text-black shadow-lg shadow-cyan-500"
                : "bg-gray-700 text-gray-300"
            }`}
          >
            {toggleOn ? "ON" : "OFF"}
          </button>
        </div>

        <h2
          className={`text-2xl font-bold text-center mb-6 transition-all duration-500 ${
            toggleOn
              ? "text-cyan-400 drop-shadow-[0_0_10px_#22d3ee]"
              : "text-white"
          }`}
        >
          Login Admin/Leader
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {inputs.map((input, idx) => (
            <div key={idx} className="relative">
              <input
                type={input.type}
                name={input.name}
                value={formData[input.name]}
                onChange={handleChange}
                required
                placeholder={input.label}
                className={`w-full bg-transparent border-b-2 pr-10 pl-2 pt-4 pb-2 focus:outline-none transition-all ${
                  toggleOn
                    ? "border-cyan-400 text-cyan-300 placeholder-cyan-400 focus:border-cyan-300"
                    : "border-gray-500 text-white placeholder-gray-400 focus:border-white"
                }`}
              />
              <span
                className={`absolute right-3 top-1/2 -translate-y-1/2 transition-all ${
                  toggleOn ? "text-cyan-400" : "text-gray-400"
                }`}
              >
                {input.icon}
              </span>
            </div>
          ))}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 rounded-full font-semibold transition-all ${
              toggleOn
                ? "bg-cyan-400 text-black shadow-lg shadow-cyan-500"
                : "bg-white text-black hover:bg-gray-200"
            }`}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}
