import React, { useState } from "react";
import { FaUser, FaEnvelope, FaPhone, FaLock } from "react-icons/fa";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import background from "../../assets/hehe.jpg";
export default function Register() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
    });
    const [toggleOn, setToggleOn] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);

        // Giả lập API call
        setTimeout(() => {
            toast.success("Registered successfully!", { position: "top-center" });
            setLoading(false);
        }, 1000);
    };

    const inputs = [
        { name: "name", type: "text", label: "Name", icon: <FaUser /> },
        { name: "email", type: "email", label: "Email", icon: <FaEnvelope /> },
        { name: "phone", type: "text", label: "Phone", icon: <FaPhone /> },
        { name: "password", type: "password", label: "Password", icon: <FaLock /> },
        {
            name: "confirmPassword",
            type: "password",
            label: "Confirm Password",
            icon: <FaLock />,
        },
    ];

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
                    Register
                </h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {inputs.map((input, idx) => (
                        <div key={idx} className="relative">
                            <span
                                className={`absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 transition-all
                ${toggleOn ? "text-cyan-400" : "text-gray-400"}`}
                            >
                                {input.icon}
                            </span>
                            <input
                                type={input.type}
                                name={input.name}
                                value={formData[input.name]}
                                onChange={handleChange}
                                required
                                placeholder={input.label}
                                className={`w-full bg-transparent border-b-2 px-10 pt-4 pb-2 focus:outline-none transition-all
                ${toggleOn
                                        ? "border-cyan-400 text-cyan-300 placeholder-cyan-400 focus:border-cyan-300"
                                        : "border-gray-500 text-white placeholder-gray-400 focus:border-white"}`}
                            />
                        </div>
                    ))}

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full py-2 rounded-full font-semibold transition-all
            ${toggleOn
                                ? "bg-cyan-400 text-black shadow-lg shadow-cyan-500"
                                : "bg-white text-black hover:bg-gray-200"}`}
                    >
                        {loading ? "Registering..." : "Register"}
                    </button>

                    <p
                        className={`text-center text-sm transition-all
            ${toggleOn ? "text-cyan-400" : "text-gray-300"}`}
                    >
                        Already have an account?{" "}
                        <Link to="/login" className="font-semibold hover:underline">
                            Login
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
}
