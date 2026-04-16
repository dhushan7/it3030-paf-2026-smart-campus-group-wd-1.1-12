import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/layout/Navbar';

function App() {
  return (
    <div className="min-h-screen w-full flex flex-col bg-gradient-to-br from-indigo-950 via-purple-950 to-slate-950 text-white">
      <Navbar />

      {/* Main content */}
      <main className="flex-grow pt-24 px-4 pb-12 w-full max-w-7xl mx-auto">
        <Routes>
          <Route path="/" element={<div className="p-8 text-2xl font-bold">SMART CAMPUS</div>} />
          <Route path="/catalogue" element={<div className="p-8 text-2xl font-bold">Catelogue Coming Soon...</div>} />
          <Route path="/dashboard" element={<div className="p-8 text-2xl font-bold">Dashboard Coming Soon...</div>} />
          <Route path="/settings" element={<div className="p-8 text-2xl font-bold">Settings Coming Soon...</div>} />
        </Routes>
      </main>
    </div>
  );
}

export default App;