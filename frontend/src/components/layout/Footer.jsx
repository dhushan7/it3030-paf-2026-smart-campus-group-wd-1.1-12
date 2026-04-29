import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();
  const role = user?.role?.toUpperCase();

  // 1. Hide the entire footer for Admins and Technicians
  if (role === 'ADMIN' || role === 'TECHNICIAN') {
    return null;
  }

  // Helper function to handle smooth scrolling for landing page links
  const handleScroll = (e, eventName) => {
    if (location.pathname === '/') {
      e.preventDefault();
      window.dispatchEvent(new Event(eventName));
    }
  };

  return (
    <footer className="w-full bg-[#0f1115] border-t border-white/10 pt-16 pb-8 mt-auto z-10 relative text-sm">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-12 gap-10">
        
        {/* COLUMN 1: Brand & Description */}
        <div className="md:col-span-4 space-y-4">
          <Link to="/" onClick={() => window.scrollTo(0,0)} className="text-2xl font-bold text-white tracking-wide">
            SMART <span className="text-purple-400">CAMPUS</span>
          </Link>
          <p className="text-gray-400 leading-relaxed max-w-sm">
            Bridging the gap between campus staff, students, and the IT department. Centralized IT support and resource bookings in one unified platform.
          </p>
        </div>

        {/* COLUMN 2: Quick Links (Only handles Guest & User now) */}
        <div className="md:col-span-4 flex flex-col space-y-4">
          <h3 className="text-white font-semibold uppercase tracking-wider text-xs">
            Quick Links
          </h3>
          <ul className="space-y-3">
            
            {/* GUEST LINKS (!isAuthenticated) */}
            {!isAuthenticated && (
              <>
                <li><Link to="/" onClick={() => window.scrollTo(0,0)} className="text-gray-400 hover:text-purple-400 transition">Home</Link></li>
                <li><a href="/" onClick={(e) => handleScroll(e, 'scroll-about')} className="text-gray-400 hover:text-purple-400 transition cursor-pointer">About Us</a></li>
                <li><a href="/" onClick={(e) => handleScroll(e, 'scroll-contact')} className="text-gray-400 hover:text-purple-400 transition cursor-pointer">Contact</a></li>
                <li><Link to="/login" className="text-gray-400 hover:text-purple-400 transition">Login / Register</Link></li>
              </>
            )}

            {/* USER LINKS */}
            {isAuthenticated && role === 'USER' && (
              <>
                <li><Link to="/user-dashboard" className="text-gray-400 hover:text-purple-400 transition">My Dashboard</Link></li>
                <li><Link to="/tickets" className="text-gray-400 hover:text-purple-400 transition">My Tickets</Link></li>
                <li><Link to="/bookings/mine" className="text-gray-400 hover:text-purple-400 transition">My Bookings</Link></li>
                <li><Link to="/catalogue" className="text-gray-400 hover:text-purple-400 transition">Resource Catalogue</Link></li>
              </>
            )}
          </ul>
        </div>

        {/* COLUMN 3: Contact Info */}
        <div className="md:col-span-4 flex flex-col space-y-4">
          <h3 className="text-white font-semibold uppercase tracking-wider text-xs">
            Contact Support
          </h3>
          <ul className="space-y-4 mt-2">
            <li className="flex items-center gap-3 text-gray-400">
              <Mail size={18} className="text-purple-400" />
              support@smartcampus.edu
            </li>
            <li className="flex items-center gap-3 text-gray-400">
              <Phone size={18} className="text-purple-400" />
              +94 77 123 4567
            </li>
            <li className="flex items-center gap-3 text-gray-400">
              <MapPin size={18} className="text-purple-400" />
              Main Admin Block, Sri Lanka
            </li>
          </ul>
        </div>
        
      </div>

      {/* COPYRIGHT BOTTOM BAR */}
      <div className="max-w-7xl mx-auto px-6 mt-12 pt-6 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-gray-500 text-xs">
          &copy; {new Date().getFullYear()} Smart Campus. All rights reserved.
        </p>
        <div className="flex gap-4 text-xs text-gray-500">
          <Link to="/" className="hover:text-purple-400 transition">Privacy Policy</Link>
          <Link to="/" className="hover:text-purple-400 transition">Terms of Service</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;