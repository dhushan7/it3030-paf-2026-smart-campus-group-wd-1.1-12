import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Navbar from './components/layout/Navbar';

// Pages
import LoginPage          from './pages/LoginPage';
import OAuth2CallbackPage from './pages/OAuth2CallbackPage';
import TicketListPage     from './pages/TicketListPage';
import CreateTicketPage   from './pages/CreateTicketPage';
import TicketDetailPage   from './pages/TicketDetailPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import ProfilePage        from './pages/ProfilePage';

/** Redirect unauthenticated users to /login */
function PrivateRoute({ children }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

/** Redirect non-admins away */
function AdminRoute({ children }) {
  const { isAuthenticated, isAdmin } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (!isAdmin)         return <Navigate to="/tickets" replace />;
  return children;
}

function App() {
  return (
    <div className="min-h-screen w-full flex flex-col bg-gradient-to-br from-indigo-950 via-purple-950 to-slate-950 text-white">
      <Navbar />

      <main className="flex-grow pt-24 px-4 pb-12 w-full max-w-7xl mx-auto">
        <Routes>
          {/* Public */}
          <Route path="/"               element={<Navigate to="/tickets" replace />} />
          <Route path="/login"          element={<LoginPage />} />
          <Route path="/oauth2/callback" element={<OAuth2CallbackPage />} />

          {/* Module A — Catalogue (already implemented) */}
          <Route path="/catalogue"      element={<div className="p-8 text-2xl font-bold">Catalogue (Module A)</div>} />

          {/* Authenticated */}
          <Route path="/tickets"        element={<PrivateRoute><TicketListPage /></PrivateRoute>} />
          <Route path="/tickets/new"    element={<PrivateRoute><CreateTicketPage /></PrivateRoute>} />
          <Route path="/tickets/:id"    element={<PrivateRoute><TicketDetailPage /></PrivateRoute>} />
          <Route path="/profile"        element={<PrivateRoute><ProfilePage /></PrivateRoute>} />

          {/* Admin only */}
          <Route path="/dashboard"      element={<AdminRoute><AdminDashboardPage /></AdminRoute>} />

          {/* Fallback */}
          <Route path="*"               element={<Navigate to="/tickets" replace />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;