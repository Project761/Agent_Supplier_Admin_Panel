import React, { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import Supplier from "./pages/Supplier";
import Agent from "./pages/Agent";
// import Login from "./pages/Login"; // ✅ path apne project ke hisaab se

function ProtectedRoute({ isAuth, children }) {
  // if (!isAuth) return <Navigate to="/login" replace />;
  return children;
}

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isAuth, setIsAuth] = useState(!!localStorage.getItem("token"));

  // ✅ dashboard layout (only when logged in)
  const DashboardLayout = ({ children }) => (
    <div className="flex h-screen bg-gray-50">
      <div className={`${sidebarOpen ? "w-64" : "w-20"} transition-all duration-300`}>
        <Sidebar isOpen={sidebarOpen} />
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar
          onMenuClick={() => setSidebarOpen(!sidebarOpen)}
          isSidebarOpen={sidebarOpen}
        />

        <main className="flex-1 overflow-y-auto bg-gray-50 p-4">
          {children}
        </main>
      </div>
    </div>
  );

  return (
    <Routes>
      <Route path="/login" element={isAuth ? (<Navigate to="/supplier" replace />) : (
        <Login onLogin={() => setIsAuth(true)} />
      )
      }
      />

      {/* ✅ Protected Routes */}
      <Route
        path="/"
        element={
          <ProtectedRoute isAuth={isAuth}>
            <Navigate to="/supplier" replace />
          </ProtectedRoute>
        }
      />

      <Route
        path="/supplier"
        element={
          <ProtectedRoute isAuth={isAuth}>
            <DashboardLayout>
              <Supplier />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/agent"
        element={
          <ProtectedRoute isAuth={isAuth}>
            <DashboardLayout>
              <Agent />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}
