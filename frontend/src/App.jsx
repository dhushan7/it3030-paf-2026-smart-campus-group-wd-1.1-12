import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { Toaster } from "react-hot-toast";

import Navbar from './components/layout/Navbar';
import AdminNavbar from './components/layout/AdminNavbar';

// Pages
import Home from './pages/Home'; 
import Footer from './components/layout/Footer';
import CataloguePage from './pages/CataloguePage';
import UserCataloguePage from './pages/UserCataloguePage';
import LoginPage from './pages/LoginPage';
import OAuth2CallbackPage from './pages/OAuth2CallbackPage';
import TicketListPage from './pages/TicketListPage';
import CreateTicketPage from './pages/CreateTicketPage';
import TicketMaintenance from './pages/TicketMaintenance';
import TicketDetailPage from './pages/TicketDetailPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import UserDashboardPage from './pages/UserDashboard';
import TechDashboardPage from './pages/TechDashboard';
import AllUsers from './pages/AdminAllUsers'
import ProfilePage from './pages/ProfilePage';

// Bookings
import BookingFormStyled from "./components/bookings/BookingFormStyled";
import BookingList from "./components/bookings/BookingList";
import BookingRequests from "./components/bookings/BookingRequests";

/** 1. Protect routes (login required) */
function PrivateRoute({ children }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

/** 2. Flexible Role-Based Route Protector */
function RoleRoute({ children, allowedRoles }) {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) return <Navigate to="/login" replace />;
  
  if (!allowedRoles.includes(user?.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
}

/** 3. Smart redirect for "/" */
function RootRedirect() {
  const { isAuthenticated, user } = useAuth();

  // Show the Home landing page if they are not logged in!
  if (!isAuthenticated) return <Home />; 
  
  // Sort users into their respective dashboards if they ARE logged in
  if (user?.role === "ADMIN") return <Navigate to="/admin/dashboard" replace />;
  if (user?.role === "TECHNICIAN") return <Navigate to="/tech/dashboard" replace />;
  
  return <Navigate to="/user-dashboard" replace />;
}

/** 4. Public Only Route (Forces redirect immediately after login) */
function PublicOnlyRoute({ children }) {
  const { isAuthenticated } = useAuth();
  
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  
  return children;
}

function App() {
  const { user, isAuthenticated } = useAuth();

  const role = user?.role;
  const isAdminOrTech = ["ADMIN", "TECHNICIAN"].includes(role);

  return (
    <div className="min-h-screen w-full flex flex-col bg-gradient-to-br from-indigo-950 via-purple-950 to-slate-950 text-white">

      {/* Role-based Navbar */}
      {isAuthenticated && isAdminOrTech ? (
        <AdminNavbar />
      ) : (
        <Navbar />
      )}

      <Toaster position="top-center" reverseOrder={false} />

      {/* LAYOUT: Add left margin if the sidebar is active */}
      <main className={`flex-grow px-4 pb-12 w-full max-w-7xl transition-all duration-300 ${
        isAuthenticated && isAdminOrTech 
          ? "ml-[260px] pt-12" // Sidebar active: shift right
          : "mx-auto pt-24"    // Topbar active: center it, push down
      }`}>
        <Routes>

          {/* Public Routes */}
          <Route path="/login" element={
            <PublicOnlyRoute>
              <LoginPage />
            </PublicOnlyRoute>
          } />
          
          <Route path="/oauth2/callback" element={
            <PublicOnlyRoute>
              <OAuth2CallbackPage />
            </PublicOnlyRoute>
          } />

          {/* Catalogue */}
          <Route path="/catalogue" element={<UserCataloguePage />} />

          {/* User Routes (Protected) */}
          <Route path="/user-dashboard" element={<PrivateRoute><UserDashboardPage /></PrivateRoute>} />
          <Route path="/tickets" element={<PrivateRoute><TicketListPage /></PrivateRoute>} />
          <Route path="/tickets/new" element={<PrivateRoute><CreateTicketPage /></PrivateRoute>} />
          <Route path="/tickets/:id" element={<PrivateRoute><TicketDetailPage /></PrivateRoute>} />
          <Route path="/profile" element={<PrivateRoute><ProfilePage /></PrivateRoute>} />
          <Route path="/bookings/new" element={<PrivateRoute><BookingFormStyled /></PrivateRoute>} />
          <Route path="/bookings/mine" element={<PrivateRoute><BookingList /></PrivateRoute>} />

          {/* ======================================= */}
          {/* ADMIN & TECH ROUTES                     */}
          {/* ======================================= */}

          {/* Admin Only */}
          <Route path="/admin/dashboard" element={
            <RoleRoute allowedRoles={["ADMIN"]}>
              <AdminDashboardPage />
            </RoleRoute>
          } />

          <Route path="/admin/all-users" element={
            <RoleRoute allowedRoles={["ADMIN"]}>
              <AllUsers />
            </RoleRoute>
          } />
          
          <Route path="/admin/catalogue" element={
            <RoleRoute allowedRoles={["ADMIN"]}>
              <CataloguePage />
            </RoleRoute>
          } />

          <Route path="/bookings/admin" element={
            <RoleRoute allowedRoles={["ADMIN"]}>
              <BookingRequests />
            </RoleRoute>
          } />

          {/* Technician Only */}
          <Route path="/tech/dashboard" element={
            <RoleRoute allowedRoles={["TECHNICIAN"]}>
              <TechDashboardPage />
            </RoleRoute>
          } />

          <Route path="/tech/tickets" element={
            <RoleRoute allowedRoles={["TECHNICIAN"]}>
               <TicketListPage />
            </RoleRoute>
          } />

          <Route path="/tech/tickets-maintain" element={
            <RoleRoute allowedRoles={["TECHNICIAN"]}>
               <TicketMaintenance />
            </RoleRoute>
          } />

          <Route path="/tech/tickets/:id" element={
            <RoleRoute allowedRoles={["TECHNICIAN"]}>
               <TicketDetailPage />
            </RoleRoute>
          } />

          {/* Shared (Admin AND Tech) */}
          <Route path="/settings" element={
            <RoleRoute allowedRoles={["ADMIN", "TECHNICIAN"]}>
              <div className="p-8 text-2xl font-bold">Settings Coming Soon...</div>
            </RoleRoute>
          } />

          {/* Root redirect (Handles showing Home vs Dashboards) */}
          <Route path="/" element={<RootRedirect />} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />

        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;