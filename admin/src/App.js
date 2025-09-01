import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import React, { useEffect } from "react";

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
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tokenFromFE = params.get("token");
    if (tokenFromFE) {
      localStorage.setItem("token", tokenFromFE);

      // Xoá token khỏi URL sau khi lưu để bảo mật
      window.history.replaceState(null, "", window.location.pathname);
    }
  }, []);
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        <Route path="/ad" element={<Layout />}>
          <Route index element={<DashboardPage />} />
          <Route path="clubs" element={<ClubList />} />
          <Route path="events" element={<EventList />} />
          <Route path="notifications" element={<Notification />} />
          <Route path="users" element={<UserList />} />
        </Route>
      </Routes>

      {/* Toast container */}
      <ToastContainer position="top-right" autoClose={3001} />
    </Router>
  );
}

export default App;
