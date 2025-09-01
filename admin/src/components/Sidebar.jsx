import { NavLink } from "react-router-dom";
import { Home, Users, Layers, Calendar, Bell, LogOut } from "lucide-react";

const Sidebar = () => {
  return (
    <aside className="w-64 bg-gray-900 text-white p-4 hidden md:block min-h-screen">
      <div className="text-2xl font-bold mb-8">Admin Dashboard</div>
      <nav className="flex flex-col gap-4">
        {/* Dashboard */}
        <NavLink to="/ad" className="flex items-center gap-2 hover:text-yellow-400">
          <Home size={20} />
          Dashboard
        </NavLink>

        {/* Quản lý User */}
        <NavLink to="/ad/users" className="flex items-center gap-2 hover:text-yellow-400">
          <Users size={20} />
          Người dùng
        </NavLink>

        {/* Quản lý CLB */}
        <NavLink to="/ad/clubs" className="flex items-center gap-2 hover:text-yellow-400">
          <Layers size={20} />
          CLB
        </NavLink>

        {/* Quản lý Sự kiện */}
        <NavLink to="/ad/events" className="flex items-center gap-2 hover:text-yellow-400">
          <Calendar size={20} />
          Sự kiện
        </NavLink>

        {/* Quản lý Notification */}
        <NavLink to="/ad/notifications" className="flex items-center gap-2 hover:text-yellow-400">
          <Bell size={20} />
          Thông báo
        </NavLink>

        {/* Logout */}
        <NavLink to="/logout" className="flex items-center gap-2 mt-auto hover:text-red-400">
          <LogOut size={20} />
          Đăng xuất
        </NavLink>
      </nav>
    </aside>
  );
};

export default Sidebar;
