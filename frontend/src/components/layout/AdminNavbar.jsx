import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function AdminNavbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const role = user?.role;

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const linkClass = ({ isActive }) =>
    `block px-4 py-2 rounded-lg text-sm transition ${
      isActive
        ? "bg-indigo-600 text-white"
        : "text-gray-300 hover:bg-white/10"
    }`;

  const adminLinks = role === "ADMIN";
  const techLinks = role === "TECHNICIAN";

  return (
    <aside className="fixed left-0 top-0 h-full w-[260px] bg-gray-900 text-white flex flex-col p-5">

      {/* Profile */}
      <div className="mb-8">
        <h2 className="text-lg font-bold text-indigo-400">{role}</h2>
        <p className="text-xs text-gray-400">{user?.name}</p>
      </div>

      {/* NAV */}
      <nav className="flex flex-col gap-2 flex-grow">
        <NavLink to="/dashboard" className={linkClass}>
          Dashboard
        </NavLink>

        {adminLinks && (
          <>
            <NavLink to="/admin/users" className={linkClass}>
              User Management
            </NavLink>
            <NavLink to="/admin/catalogue" className={linkClass}>
              Manage Catalogue
            </NavLink>
            <NavLink onClick={() => setOpen(false)} to="/bookings/admin" className={linkClass}>
                Admin Bookings
            </NavLink>
            <NavLink to="/admin/reports" className={linkClass}>
              Reports
            </NavLink>
          </>
        )}

        {techLinks && (
          <>
            <NavLink to="/tech/tickets" className={linkClass}>
              Tickets
            </NavLink>
            <NavLink to="/tech/maintenance" className={linkClass}>
              Maintenance
            </NavLink>
            <NavLink to="/admin/resources" className={linkClass}>
              Resources
            </NavLink>
          </>
        )}

        <NavLink to="/settings" className={linkClass}>
          Settings
        </NavLink>
      </nav>

      {/* Logout */}
      <button
        onClick={handleLogout}
        className="mt-auto bg-red-500/10 text-red-400 py-2 rounded-lg hover:bg-red-600 hover:text-white"
      >
        Logout
      </button>
    </aside>
  );
}