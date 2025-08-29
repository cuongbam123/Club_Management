import React, { useState } from "react";
import { IoMail, IoLockClosed, IoPerson, IoCall } from "react-icons/io5";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Login.css";

export default function Register() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
    });

    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        if (formData.password !== formData.confirmPassword) {
            toast.error("❌ Passwords do not match!", { position: "top-center" });
            setLoading(false);
            return;
        }

        try {
            const res = await axios.post("http://localhost:3001/api/auth/register", formData);
            toast.success("🎉 Registration successful!", { position: "top-center" });
            setTimeout(() => {
                window.location.href = "./login";
            }, 2000);
        } catch (err) {
            console.error(err);
            toast.error(err.response?.data?.message || "❌ Registration failed", { position: "top-center" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page" id="register-page">
            <ToastContainer />
            <div className="login-box" id="register-box">
                <form onSubmit={handleSubmit} id="register-form">
                    <input type="checkbox" className="input-check" id="input-check" />
                    <label htmlFor="input-check" className="toggle">
                        <span className="text off">off</span>
                        <span className="text on">on</span>
                    </label>
                    <div className="light"></div>
                    <h2>Register</h2>

                    {/* Name */}
                    <div className="input-box" id="input-name">
                        <span className="icon"><IoPerson /></span>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                        <label>Name</label>
                        <div className="input-line"></div>
                    </div>

                    {/* Email */}
                    <div className="input-box" id="input-email">
                        <span className="icon"><IoMail /></span>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                        <label>Email</label>
                        <div className="input-line"></div>
                    </div>

                    {/* Phone */}
                    <div className="input-box" id="input-phone">
                        <span className="icon"><IoCall /></span>
                        <input
                            type="text"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            required
                        />
                        <label>Phone</label>
                        <div className="input-line"></div>
                    </div>

                    {/* Password */}
                    <div className="input-box" id="input-password">
                        <span className="icon"><IoLockClosed /></span>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                        <label>Password</label>
                        <div className="input-line"></div>
                    </div>

                    {/* Confirm Password */}
                    <div className="input-box" id="input-confirmPassword">
                        <span className="icon"><IoLockClosed /></span>
                        <input
                            type="password"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                        />
                        <label>Confirm Password</label>
                        <div className="input-line"></div>
                    </div>

                    <button type="submit" id="btn-register" disabled={loading}>
                        {loading ? "Registering..." : "Register"}
                    </button>

                    <div className="register-link">
                        <p>
                            Already have an account? <a href="./login">Login</a>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
}
