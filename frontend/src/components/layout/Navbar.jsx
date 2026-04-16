import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, LayoutGrid, Home, Settings } from 'lucide-react';

const Navbar = () => {
  const [open, setOpen] = useState(false);

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
        <div className="hidden md:flex items-center gap-8 text-sm font-medium">
          <Link className="flex items-center gap-2 text-gray-300 hover:text-purple-400 transition-colors" to="/catalogue">
            <LayoutGrid size={18} /> Catalogue
          </Link>

          <Link className="flex items-center gap-2 text-gray-300 hover:text-purple-400 transition-colors" to="/dashboard">
            <Home size={18} /> Dashboard
          </Link>

          <Link className="flex items-center gap-2 text-gray-300 hover:text-purple-400 transition-colors" to="/settings">
            <Settings size={18} /> Settings
          </Link>
        </div>

        {/* Mobile Toggle Button */}
        <button
          className="md:hidden text-white p-1 rounded-md hover:bg-white/10 transition"
          onClick={() => setOpen(!open)}
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>

      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden px-6 pb-6 pt-2 space-y-4 bg-[#0f1115]/95 backdrop-blur-xl border-t border-white/10">
          <Link onClick={() => setOpen(false)} to="/catalogue" className="flex items-center gap-3 text-gray-300 hover:text-purple-400">
            <LayoutGrid size={20} /> Catalogue
          </Link>

          <Link onClick={() => setOpen(false)} to="/dashboard" className="flex items-center gap-3 text-gray-300 hover:text-purple-400">
            <Home size={20} /> Dashboard
          </Link>

          <Link onClick={() => setOpen(false)} to="/settings" className="flex items-center gap-3 text-gray-300 hover:text-purple-400">
            <Settings size={20} /> Settings
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;