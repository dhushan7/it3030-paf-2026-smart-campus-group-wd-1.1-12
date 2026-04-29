import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Menu, X, LayoutGrid,
  Ticket, User, LogOut, LogIn, ClipboardList,
  Home as HomeIcon, Info, Phone
} from 'lucide-react';

import { useAuth } from '../../context/AuthContext';
import NotificationBell from '../notifications/NotificationBell';

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Added custom actions for scrolling
  const navLinks = [
    // --- Unregistered (Guest) Links ---
    {
      to: '/',
      label: 'Home',
      icon: <HomeIcon size={18} />,
      show: !isAuthenticated,
      action: () => window.scrollTo({ top: 0, behavior: 'smooth' })
    },
    {
      to: '/',
      label: 'About',
      icon: <Info size={18} />,
      show: !isAuthenticated,
      action: (e) => { 
        e.preventDefault(); 
        window.dispatchEvent(new Event('scroll-about')); 
      }
    },
    {
      to: '/',
      label: 'Contact',
      icon: <Phone size={18} />,
      show: !isAuthenticated,
      action: (e) => { 
        e.preventDefault(); 
        window.dispatchEvent(new Event('scroll-contact')); 
      }
    },

    // --- Registered User Links ---
    {
      to: '/user-dashboard',
      label: 'Dashboard',
      icon: <LayoutGrid size={18} />,
      show: isAuthenticated && user?.role?.toUpperCase() === 'USER'
    },
    {
      to: '/catalogue',
      label: 'Catalogue',
      icon: <LayoutGrid size={18} />,
      show: isAuthenticated && user?.role?.toUpperCase() === 'USER'
    },
    {
      to: '/tickets',
      label: 'My Tickets',
      icon: <Ticket size={18} />,
      show: isAuthenticated && user?.role?.toUpperCase() === 'USER'
    },
    {
      to: '/bookings/mine',
      label: 'My Bookings',
      icon: <ClipboardList size={18} />,
      show: isAuthenticated && user?.role?.toUpperCase() === 'USER'
    },
    {
      to: '/bookings/new',
      label: 'New Booking',
      icon: <ClipboardList size={18} />,
      show: isAuthenticated && user?.role?.toUpperCase() === 'USER'
    },
    {
      to: '/profile',
      label: 'Profile',
      icon: <User size={18} />,
      show: isAuthenticated && user?.role?.toUpperCase() === 'USER'
    },
  ];

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-[#0f1115]/80 backdrop-blur-xl border-b border-white/10 shadow-lg">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4">

        <Link to="/" onClick={() => window.scrollTo(0,0)} className="text-xl font-bold text-white tracking-wide">
          SMART CAMPUS
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-6 text-sm font-medium">
          {navLinks.filter(l => l.show).map(link => (
            <Link 
              key={link.label} 
              to={link.to}
              onClick={link.action ? link.action : undefined}
              className="flex items-center gap-2 text-gray-300 hover:text-purple-400 transition-colors"
            >
              {link.icon} {link.label}
            </Link>
          ))}
        </div>

        {/* Right */}
        <div className="hidden md:flex items-center gap-3">
          {isAuthenticated && <NotificationBell />}

          {isAuthenticated ? (
            <div className="flex items-center gap-4 border-l border-white/10 pl-4">
              <span className="text-sm text-gray-300">{user?.name}</span>

              <button onClick={handleLogout}
                className="text-sm text-gray-400 hover:text-red-400 flex items-center gap-1 transition-colors">
                <LogOut size={16} /> Logout
              </button>
            </div>
          ) : (
            <Link to="/login"
              className="bg-purple-600 px-4 py-2 rounded-lg text-white text-sm flex items-center gap-1 hover:bg-purple-700 transition-colors">
              <LogIn size={16} /> Login
            </Link>
          )}
        </div>

        {/* Mobile Toggle */}
        <button className="md:hidden text-white hover:text-purple-400 transition-colors" onClick={() => setOpen(!open)}>
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden px-6 pb-6 pt-2 space-y-4 bg-[#0f1115]/95 border-b border-white/10">
          {navLinks.filter(l => l.show).map(link => (
            <Link 
              key={link.label} 
              to={link.to}
              onClick={(e) => {
                if (link.action) link.action(e);
                setOpen(false);
              }}
              className="flex items-center gap-3 text-gray-300 hover:text-purple-400 p-2 rounded-lg hover:bg-white/5 transition-colors"
            >
              {link.icon} {link.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
};

export default Navbar;