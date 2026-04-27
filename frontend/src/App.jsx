import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Navbar from "./components/layout/Navbar";

// Booking components
import BookingsPage from "./components/bookings/BookingsPage";

function App() {
  return (
    <div className="min-h-screen w-full flex flex-col bg-gradient-to-br from-indigo-950 via-purple-950 to-slate-950 text-white">
      <Navbar />

      {/* Main content */}
      <main className="flex-grow pt-24 px-4 pb-12 w-full max-w-7xl mx-auto">
        <Routes>
          {/* Test routes */}
          <Route path="/" element={<div className="p-8 text-2xl font-bold text-red-400">Home Works!</div>} />
          <Route path="/catalogue" element={<div className="p-8 text-2xl font-bold text-green-400">Catalogue Works!</div>} />
          <Route path="/dashboard" element={<div className="p-8 text-2xl font-bold text-blue-400">Dashboard Works!</div>} />
          <Route path="/settings" element={<div className="p-8 text-2xl font-bold text-yellow-400">Settings Works!</div>} />

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
