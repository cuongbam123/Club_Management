import React, { useState } from "react";
import { IoMail, IoLockClosed } from "react-icons/io5";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Login.css";

export default function Login() {
    const [formData, setFormData] = useState({ email: "", password: "" });
    const [loading, setLoading] = useState(false);
    const [toggleOn, setToggleOn] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);

        // Giả lập API login
        setTimeout(() => {
            toast.success("Login successful!", { position: "top-center" });
            setLoading(false);
            // window.location.href = "/dashboard"; // chuyển trang sau login
        }, 1000);
    };

    return (
        <div className="login-page">
            <ToastContainer />
            <div className="login-box">
                <form onSubmit={handleSubmit}>
                    {/* Toggle on/off */}
                    <input
                        type="checkbox"
                        className="input-check"
                        id="input-check"
                        checked={toggleOn}
                        onChange={() => setToggleOn(!toggleOn)}
                    />
                    <label htmlFor="input-check" className="toggle">
                        <span className="text off">off</span>
                        <span className="text on">on</span>
                    </label>
                    <div className="light"></div>

                    <h2>Login</h2>

                    {/* Email */}
                    <div className="input-box">
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                        <label>Email</label>
                        <span className="icon"><IoMail /></span>
                        <div className="input-line"></div>
                    </div>

                    {/* Password */}
                    <div className="input-box">
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                        <label>Password</label>
                        <span className="icon"><IoLockClosed /></span>
                        <div className="input-line"></div>
                    </div>

                    {/* Remember + Forgot */}
                    <div className="remember-forgot">
                        <label>
                            <input type="checkbox" /> Remember me
                        </label>
                        <a href="./forgot">Forgot Password?</a>
                    </div>

                    <button type="submit" disabled={loading}>
                        {loading ? "Logging in..." : "Login"}
                    </button>

                    {/* Register link */}
                    <div className="register-link">
                        <p>
                            Don't have an account? <a href="./register">Register</a>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
}
