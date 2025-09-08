import React, { useState } from "react";
import { IoMail, IoLockClosed } from "react-icons/io5";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import background from "../../assets/hehe.jpg";

export default function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [toggleOn, setToggleOn] = useState(false);
  const [loading, setLoading] = useState(false);

  const API_URL = process.env.REACT_APP_API_URL; // ✅ lấy từ .env

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post(`${API_URL}/auth/login`, formData);

      const { token, user } = res.data;

      // ✅ Lưu token + user
      localStorage.setItem("token", token);
      if (user) {
        localStorage.setItem("user", JSON.stringify(user));
      }

      toast.success(`Welcome ${user?.name || "User"}!`, {
        position: "top-center",
        autoClose: 1500,
      });

      setTimeout(() => {
        navigate("/");
      }, 1500);
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid email or password!", {
        position: "top-center",
        autoClose: 2000,
      });
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
          Login
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

          {/* Remember + Forgot */}
          <div
            className={`flex justify-between text-sm transition-all ${
              toggleOn ? "text-cyan-400" : "text-gray-300"
            }`}
          >
            <label className="flex items-center gap-2">
              <input type="checkbox" className="accent-cyan-400" />
              Remember me
            </label>
            <Link to="/forgot" className="hover:underline">
              Forgot Password?
            </Link>
          </div>

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

          {/* Register */}
          <p
            className={`text-center text-sm transition-all ${
              toggleOn ? "text-cyan-400" : "text-gray-300"
            }`}
          >
            Don't have an account?{" "}
            <Link to="/register" className="font-semibold hover:underline">
              Register
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
