import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from "react-hot-toast";
import Navbar from './components/layout/Navbar';
import CataloguePage from './pages/CataloguePage';
import UserCataloguePage from './pages/UserCataloguePage';
import BookingsPage from "./components/bookings/BookingsPage";


function App() {
  return (
    <div className="min-h-screen w-full flex flex-col bg-gradient-to-br from-indigo-950 via-purple-950 to-slate-950 text-white">
      <Navbar />
      <Toaster position="top-center" reverseOrder={false} />
      {/* pages */}
      <main className="flex-grow pt-24 px-4 pb-12 w-full max-w-7xl mx-auto">
        <Routes>
         
          <Route path="/" element={<div className="p-8 text-2xl font-bold">SMART CAMPUS</div>} />
          <Route path="/admin/catalogue" element={<CataloguePage />} />
          <Route path="/catalogue" element={<UserCataloguePage />} />
          <Route path="/dashboard" element={<div className="p-8 text-2xl font-bold">Dashboard Coming Soon...</div>} />
          <Route path="/settings" element={<div className="p-8 text-2xl font-bold">Settings Coming Soon...</div>} />

          {/* Booking routes */}
          <Route path="/bookings" element={<BookingsPage />} />
          <Route path="/bookings/new" element={<Navigate to="/bookings#new-booking" replace />} />
          <Route path="/bookings/mine" element={<Navigate to="/bookings#my-bookings" replace />} />
          <Route path="/admin/bookings" element={<Navigate to="/bookings#admin-bookings" replace />} />
          
        </Routes>
      </main>
    </div>
  );
}

export default App;
