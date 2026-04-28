import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import {
  Menu, X, LayoutGrid, Home,
  ClipboardList, Settings
} from 'lucide-react';

const Navbar = () => {
  const [open, setOpen] = useState(false);

  const navLinkClassName = ({ isActive }) =>
    `flex items-center gap-2 transition-colors ${
      isActive ? "text-white" : "text-gray-300 hover:text-purple-400"
    }`;

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-[#0f1115]/80 backdrop-blur-xl border-b border-white/10">

      <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4">

        {/* Logo */}
        <Link
          to="/"
          className="text-xl font-bold tracking-wide text-white hover:text-purple-400 transition-colors"
        >
          SMART CAMPUS
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-6 text-sm font-medium">

          <NavLink className={navLinkClassName} to="/dashboard">
            <Home size={18} /> Dashboard
          </NavLink>

          <NavLink className={navLinkClassName} to="/catalogue">
            <LayoutGrid size={18} /> Catalogue
          </NavLink>

          {/* 📌 BOOKINGS */}
          <div className="flex items-center gap-4 ml-2 border-l border-white/10 pl-4">

            <NavLink className={navLinkClassName} to="/bookings/mine">
              <ClipboardList size={18} /> My Bookings
            </NavLink>

            <NavLink className={navLinkClassName} to="/bookings/new">
              New Booking
            </NavLink>

          </div>

          <NavLink className={navLinkClassName} to="/settings">
            <Settings size={18} /> Settings
          </NavLink>

        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden text-white p-1 rounded-md hover:bg-white/10 transition"
          onClick={() => setOpen(!open)}
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>

      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden px-6 pb-6 pt-2 space-y-4 bg-[#0f1115]/95 border-t border-white/10">

          <NavLink onClick={() => setOpen(false)} to="/dashboard" className="flex items-center gap-3 text-gray-300 hover:text-purple-400">
            <Home size={20} /> Dashboard
          </NavLink>

          <NavLink onClick={() => setOpen(false)} to="/catalogue" className="flex items-center gap-3 text-gray-300 hover:text-purple-400">
            <LayoutGrid size={20} /> Catalogue
          </NavLink>

          {/* BOOKINGS MOBILE */}
          <NavLink onClick={() => setOpen(false)} to="/bookings/mine" className="flex items-center gap-3 text-gray-300 hover:text-purple-400">
            <ClipboardList size={20} /> My Bookings
          </NavLink>

          <NavLink onClick={() => setOpen(false)} to="/bookings/new" className="flex items-center gap-3 text-gray-300 hover:text-purple-400">
            New Booking
          </NavLink>

          <NavLink onClick={() => setOpen(false)} to="/settings" className="flex items-center gap-3 text-gray-300 hover:text-purple-400">
            <Settings size={20} /> Settings
          </NavLink>

        </div>
      )}
    </nav>
  );
};

export default Navbar;