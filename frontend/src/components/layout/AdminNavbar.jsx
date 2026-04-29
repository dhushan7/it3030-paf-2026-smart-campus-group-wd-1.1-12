import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { 
  LayoutDashboard, 
  Users, 
  Layers, 
  Calendar, 
  Ticket, 
  Wrench, 
  UserCircle, 
  LogOut 
} from "lucide-react";

export default function AdminNavbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) return null;

  const role = user?.role?.replace("ROLE_", "")?.toUpperCase()?.trim();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Upgraded link classes with glowing active states and smooth transitions
  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 border ${
      isActive
        ? "bg-indigo-500/10 text-indigo-400 border-indigo-500/30 shadow-[0_0_15px_rgba(99,102,241,0.15)]"
        : "border-transparent text-gray-400 hover:bg-white/5 hover:text-gray-200"
    }`;

  const dashboardRoute =
    role === "ADMIN"
      ? "/admin/dashboard"
      : role === "TECHNICIAN"
      ? "/tech/dashboard"
      : "/dashboard";

  return (
    <aside className="fixed left-0 top-0 h-full w-[260px] bg-gradient-to-b from-gray-950 to-gray-900 text-white flex flex-col p-6 border-r border-white/5 shadow-2xl z-50">
      
      {/* Upgraded Profile Section */}
      <div className="mb-10 flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/10">
        <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold shadow-lg">
          {user?.name?.charAt(0)?.toUpperCase() || "U"}
        </div>
        <div className="overflow-hidden">
          <p className="text-sm font-semibold truncate text-gray-100">{user?.name}</p>
          <span className="text-[10px] tracking-wider uppercase text-indigo-400 font-bold bg-indigo-500/10 px-2 py-0.5 rounded-full inline-block mt-1">
            {role}
          </span>
        </div>
      </div>

      {/* NAV */}
      <nav className="flex flex-col gap-2 flex-grow overflow-y-auto no-scrollbar">
        
        <NavLink to={dashboardRoute} className={linkClass}>
          <LayoutDashboard size={18} />
          <span>Dashboard</span>
        </NavLink>

        {/* ADMIN ONLY */}
        {role === "ADMIN" && (
          <>
            <div className="mt-4 mb-2 px-4 text-xs font-semibold text-gray-500 tracking-widest uppercase">Admin Tools</div>
            <NavLink to="/admin/all-users" className={linkClass}>
              <Users size={18} />
              <span>User Management</span>
            </NavLink>
            <NavLink to="/admin/catalogue" className={linkClass}>
              <Layers size={18} />
              <span>Manage Catalogue</span>
            </NavLink>
            <NavLink to="/bookings/admin" className={linkClass}>
              <Calendar size={18} />
              <span>Bookings</span>
            </NavLink>
            <NavLink to="/tickets" className={linkClass}>
              <Ticket size={18} />
              <span>Tickets</span>
            </NavLink>
          </>
        )}

        {/* TECHNICIAN ONLY */}
        {role === "TECHNICIAN" && (
          <>
            <div className="mt-4 mb-2 px-4 text-xs font-semibold text-gray-500 tracking-widest uppercase">Tech Workspace</div>
            <NavLink to="/tech/tickets" className={linkClass}>
              <Ticket size={18} />
              <span>Tickets</span>
            </NavLink>
            <NavLink to="/tech/tickets-maintain" className={linkClass}>
              <Wrench size={18} />
              <span>Maintenance</span>
            </NavLink>
          </>
        )}

        {/* Shared */}
        <div className="mt-4 mb-2 px-4 text-xs font-semibold text-gray-500 tracking-widest uppercase">Settings</div>
        <NavLink to="/profile" className={linkClass}>
          <UserCircle size={18} />
          <span>Profile</span>
        </NavLink>

      </nav>

      {/* Upgraded Logout */}
      <div className="mt-auto pt-6">
        <button
          onClick={handleLogout}
          className="flex items-center justify-center gap-2 w-full bg-red-500/10 text-red-400 py-3 rounded-xl border border-red-500/20 hover:bg-red-500 hover:text-white hover:shadow-[0_0_15px_rgba(239,68,68,0.2)] transition-all duration-300 font-medium text-sm"
        >
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}