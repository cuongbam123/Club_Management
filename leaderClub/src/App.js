import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import NavbarLeader from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import Events from "./pages/EventManagement";
import Notifications from "./pages/Notification";
import Members from "./pages/Member";
import Profile from "./components/Profile";
import Login from "./pages/Loginad";

function Layout() {
  const [collapsed, setCollapsed] = useState(false);
  const toggleSidebar = () => setCollapsed(!collapsed);
  const location = useLocation();

  // Nếu đang ở trang login thì không render layout
  if (location.pathname === "/loginad") {
    return (
      <Routes>
        <Route path="/loginad" element={<Login />} />
      </Routes>
    );
  }

  // Layout chính sau khi login
  return (
    <div className="d-flex" id="wrapper">
      <Sidebar collapsed={collapsed} />
      <div id="page-content-wrapper" className="w-100">
        <NavbarLeader toggleSidebar={toggleSidebar} />
        <div className="container-fluid">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/members" element={<Members />} />
            <Route path="/events" element={<Events />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Layout />
    </Router>
  );
}

export default App;
