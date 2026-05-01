import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { MovieProvider } from "./context/MovieContext";
import HomePage from "./pages/HomePage";
import AuthPage from "./pages/AuthPage";

// Protected route wrapper
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <div className="loading-container"><div className="spinner" /></div>;
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

// Public route (redirect to home if already logged in)
const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <div className="loading-container"><div className="spinner" /></div>;
  return isAuthenticated ? <Navigate to="/" replace /> : children;
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<PublicRoute><AuthPage /></PublicRoute>} />
          <Route path="/" element={
            <ProtectedRoute>
              <MovieProvider>
                <HomePage />
              </MovieProvider>
            </ProtectedRoute>
          } />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;