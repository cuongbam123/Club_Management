// src/App.jsx
import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// ================= Pages =================
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ForgotPassword from "./pages/auth/ForgotPassword";

import ClubList from "./pages/club/ClubList";
import ClubDetail from "./pages/club/ClubDetail";
import EventList from "./pages/user/EventList";
import EventClub from "./pages/club/EventClub";
import Notifications from "./pages/user/Notifications";
import RegistrationStatus from "./pages/user/RegistrationStatus";



// ================= Components =================
import Layout from "./components/Layout";
import EventDetail from "./components/EventDetail";
import Profile from "./components/Profile";
import Histo from "./components/Histo";

// Component route mặc định cho "/"
function DefaultRoute() {
  const userClub = JSON.parse(localStorage.getItem("userClub"));

  if (userClub && userClub.id) {
    return <Navigate to={`/clubs/${userClub.id}`} replace />;
  }

  return <ClubList />;
}

function App() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tokenFromFE = params.get("token");
    if (tokenFromFE) {
      localStorage.setItem("token", tokenFromFE);
      window.history.replaceState(null, "", window.location.pathname);
    }
  }, []);

  return (
    <Router>
      <Routes>
        {/* Authentication routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot" element={<ForgotPassword />} />

        {/* User routes bọc trong Layout */}
        <Route path="/" element={<Layout />}>
          <Route index element={<DefaultRoute />} /> {/* route mặc định "/" */}
          <Route path="profile" element={<Profile />} />
          <Route path="hist" element={<Histo />} />
          <Route path="clubs" element={<ClubList />} />
          <Route path="clubs/:id" element={<ClubDetail />} /> {/* ✅ hiển thị chi tiết CLB */}
          <Route path="clubs/:id/events" element={<EventClub />} />
          <Route path="clubs/:id/events/:eventId" element={<EventDetail />} />
          <Route path="events" element={<EventList />} />
          <Route path="events/:id" element={<EventDetail />} />
          <Route path="registration-status" element={<RegistrationStatus />} />
          <Route path="notifications" element={<Notifications />} />
        </Route>
      </Routes>

      <ToastContainer position="top-right" autoClose={3000} />
    </Router>
  );
}

export default App;
