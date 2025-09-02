import React, { useState } from "react";
import { IoMail, IoLockClosed, IoCall } from "react-icons/io5";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Login.css";

export default function ForgotPassword() {
    const [formData, setFormData] = useState({
        email: "",
        phone: "",
        newPassword: "",
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Reset password data:", formData);

        // TODO: gọi API backend để update password
        // Giả lập thành công:
        toast.success("Password updated successfully!", {
            position: "top-center",
            autoClose: 2000, // 2 giây tự đóng
            onClose: () => {
                window.location.href = "/login"; // tự nhảy về Login khi toast đóng
            },
            closeOnClick: false,
            draggable: false,
        });
    };

    return (
        <div className="login-page">
            <div className="login-light"></div>
            <div className="login-box">
                <form onSubmit={handleSubmit}>
                    <input type="checkbox" className="input-check" id="input-check" />
                    <label htmlFor="input-check" className="toggle">
                        <span className="text off">off</span>
                        <span className="text on">on</span>
                    </label>
                    <div className="light"></div>
                    <h2>Forgot Password</h2>

                    {/* Email */}
                    <div className="input-box">
                        <span className="icon">
                            <IoMail />
                        </span>
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
                    <div className="input-box">
                        <span className="icon">
                            <IoCall />
                        </span>
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

                    {/* New Password */}
                    <div className="input-box">
                        <span className="icon">
                            <IoLockClosed />
                        </span>
                        <input
                            type="password"
                            name="newPassword"
                            value={formData.newPassword}
                            onChange={handleChange}
                            required
                        />
                        <label>New Password</label>
                        <div className="input-line"></div>
                    </div>

                    <button type="submit">Update Password</button>

                    <div className="register-link">
                        <p>
                            Remember your password? <a href="/login">Login</a>
                        </p>
                    </div>
                </form>
            </div>
            <ToastContainer />
        </div>
    );
}
