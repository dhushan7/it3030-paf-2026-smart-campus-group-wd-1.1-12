import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, LayoutGrid, LayoutDashboard, Ticket, User, LogOut, LogIn } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import NotificationBell from '../notifications/NotificationBell';

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navLinks = [
    { to: '/catalogue', label: 'Catalogue', icon: <LayoutGrid size={18} />, always: true },
    { to: '/tickets',   label: 'My Tickets', icon: <Ticket size={18} />,     auth: true },
    { to: '/dashboard', label: 'Dashboard',  icon: <LayoutDashboard size={18} />, adminOnly: true },
    { to: '/profile',   label: 'Profile',    icon: <User size={18} />,        auth: true },
  ].filter(link => {
    if (link.adminOnly) return isAdmin;
    if (link.auth)      return isAuthenticated;
    return true;
  });

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
          {navLinks.map(link => (
            <Link
              key={link.to}
              className="flex items-center gap-2 text-gray-300 hover:text-purple-400 transition-colors"
              to={link.to}>
              {link.icon} {link.label}
            </Link>
          ))}
        </div>

        {/* Right side: bell + auth */}
        <div className="hidden md:flex items-center gap-3">
          <NotificationBell />
          <Link onClick={() => setOpen(false)} to="/admin/catalogue" className="flex items-center gap-3 text-gray-300 hover:text-purple-400">
            <LayoutGrid size={20} /> Admin Catalogue
          </Link>

        {/* Right side: bell + auth */}
        <div className="hidden md:flex items-center gap-3">
          <NotificationBell />

          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              {user?.picture ? (
                <img src={user.picture} alt={user.name}
                     className="h-8 w-8 rounded-full border border-white/20 object-cover" />
              ) : (
                <div className="h-8 w-8 rounded-full bg-purple-600 flex items-center justify-center
                                text-white text-sm font-bold">
                  {user?.name?.[0]?.toUpperCase()}
                </div>
              )}
              <span className="text-sm text-gray-300">{user?.name}</span>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1 text-sm text-gray-400 hover:text-red-400 transition">
                <LogOut size={16} /> Logout
              </button>
            </div>
          ) : (
            <Link to="/login"
                  className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-purple-600
                             hover:bg-purple-500 text-white text-sm transition">
              <LogIn size={16} /> Login
            </Link>
          )}
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
        <div className="md:hidden px-6 pb-6 pt-2 space-y-4 bg-[#0f1115]/95 backdrop-blur-xl border-t border-white/10">
          {navLinks.map(link => (
            <Link
              key={link.to}
              onClick={() => setOpen(false)}
              to={link.to}
              className="flex items-center gap-3 text-gray-300 hover:text-purple-400">
              {link.icon} {link.label}
            </Link>
          ))}
          <div className="pt-2 border-t border-white/10 flex items-center justify-between">
            <NotificationBell />
            {isAuthenticated ? (
              <button onClick={() => { handleLogout(); setOpen(false); }}
                      className="flex items-center gap-1 text-sm text-gray-400 hover:text-red-400">
                <LogOut size={16} /> Logout
              </button>
            ) : (
              <Link to="/login" onClick={() => setOpen(false)}
                    className="flex items-center gap-1 text-sm text-purple-400">
                <LogIn size={16} /> Login
              </Link>
            )}
          </div>
          <Link onClick={() => setOpen(false)} to="/catalogue" className="flex items-center gap-3 text-gray-300 hover:text-purple-400">
            <LayoutGrid size={20} /> Catalogue
          </Link>
          <Link onClick={() => setOpen(false)} to="/admin/catalogue" className="flex items-center gap-3 text-gray-300 hover:text-purple-400">
            <LayoutGrid size={20} /> Admin Catalogue
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