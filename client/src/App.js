// src/App.jsx
import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
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

// ================= Private Route =================
function PrivateRoute({ children }) {
  const token = localStorage.getItem("token");
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

// ================= Default Route cho "/" =================
function DefaultRoute() {
  const userClub = JSON.parse(localStorage.getItem("userClub"));
  if (userClub && userClub.id) {
    return <Navigate to={`/clubs/${userClub.id}`} replace />;
  }
  return <ClubList />;
}

function App() {
  const [, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

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

        {/* Protected routes */}
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Layout />
            </PrivateRoute>
          }
        >
          <Route index element={<DefaultRoute />} />
          <Route path="profile" element={<Profile onUserUpdate={setUser} />} />
          <Route path="hist" element={<Histo />} />
          <Route path="clubs" element={<ClubList />} />
          <Route path="clubs/:id" element={<ClubDetail />} />
          <Route path="event-club" element={<EventClub />} />
          <Route path="event-club/:eventId" element={<EventDetail />} />
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
