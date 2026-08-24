import React, { useContext, Suspense, lazy } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from "react-router-dom";
import { AuthContext, AuthProvider } from "./context/AuthContext";
import Navigation from "./components/Navigation";
import LoginPage from "./pages/LoginPage";
import ApplyLeavePage from "./pages/ApplyLeavePage";
import MyLeavesPage from "./pages/MyLeavesPage";
import "./App.css";

// Lazy load HRPanel
const HRPanel = lazy(() => import("./pages/HRPanel"));

// Protected Route Component for authenticated users
function ProtectedRoute({ children }) {
  const { token } = useContext(AuthContext);

  if (!token) {
    return <Navigate to="/" />;
  }

  return children;
}

// HR Protected Route Component
function HRRoute({ children }) {
  const { token, role } = useContext(AuthContext);

  if (!token) {
    return <Navigate to="/" />;
  }

  if (role !== "hr") {
    return (
      <div className="access-denied">
        <h2>Access Denied</h2>
        <p>You do not have permission to access this page.</p>
      </div>
    );
  }

  return children;
}

// Fallback component for lazy loading
function LoadingFallback() {
  return <div className="loading-fallback">Loading...</div>;
}

// Main App content component
function AppContent() {
  return (
    <>
      <Navigation />
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route
          path="/apply"
          element={
            <ProtectedRoute>
              <ApplyLeavePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-leaves"
          element={
            <ProtectedRoute>
              <MyLeavesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/hr"
          element={
            <HRRoute>
              <Suspense fallback={<LoadingFallback />}>
                <HRPanel />
              </Suspense>
            </HRRoute>
          }
        />
      </Routes>
    </>
  );
}

// Main App component
export default function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}
