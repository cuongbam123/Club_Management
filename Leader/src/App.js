import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import NavbarLeader from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import Events from "./pages/EventManagement";
import Notifications from "./pages/Notification";
import Members from "./pages/Member"; // Import component quản lý thành viên sự kiện
import Profile from "./components/Profile";
// import Login from "../client/src/pages/Loginad"; // Import trang login admin/leader
function App() {
  const [collapsed, setCollapsed] = useState(false);

  const toggleSidebar = () => setCollapsed(!collapsed);

  return (
    <Router>
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

              {/* Route profile */}
              <Route path="/profile" element={<Profile />} />



            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;
