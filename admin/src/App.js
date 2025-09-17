import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import React, { useEffect, useState } from "react";

// Pages
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import ClubList from "./pages/ad/ClubList";
import EventList from "./pages/ad/EventList";
import Notification from "./pages/ad/Notification";
import UserList from "./pages/ad/UserList";

// Layout
import Layout from "./components/Layout";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token") || null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tokenFromFE = params.get("token");
    if (tokenFromFE) {
      localStorage.setItem("token", tokenFromFE);
      setToken(tokenFromFE);

      // Xoá token khỏi URL
      window.history.replaceState(null, "", window.location.pathname);
    }
  }, []);

  return (
    <Router>
      <Routes>
        {/* Trang login */}
        <Route path="/login" element={<LoginPage />} />

        {/* Các route /ad được bảo vệ */}
        <Route
          path="/ad/*"
          element={
            token ? <Layout /> : <Navigate to="/login" replace />
          }
        >
          <Route index element={<DashboardPage />} />
          <Route path="clubs" element={<ClubList />} />
          <Route path="events" element={<EventList />} />
          <Route path="notifications" element={<Notification />} />
          <Route path="users" element={<UserList />} />
        </Route>

        {/* Redirect từ / sang /login */}
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>

      {/* Toast container */}
      <ToastContainer position="top-right" autoClose={3001} />
    </Router>
  );
}

export default App;
