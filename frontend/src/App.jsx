import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { ProtectedRoute } from "./components/common/ProtectedRoute";
import { DashboardLayout } from "./layouts/DashboardLayout";
import { Login } from "./pages/Login";

// Admin Pages
import { AdminDashboard } from "./pages/admin/AdminDashboard";
import { AdminEmployees } from "./pages/admin/AdminEmployees";
import { AdminTasks } from "./pages/admin/AdminTasks";
import { CreateTask } from "./pages/admin/CreateTask";

// Employee Pages
import { EmployeeDashboard } from "./pages/employee/EmployeeDashboard";
import { EmployeeTasks } from "./pages/employee/EmployeeTasks";

const RootRedirect = () => {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;
  return user.role === "admin" ? <Navigate to="/admin/dashboard" replace /> : <Navigate to="/employee/dashboard" replace />;
};

export function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<RootRedirect />} />

          {/* Admin Protected Routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute requiredRole="admin">
                <DashboardLayout title="Admin Workspace" />
              </ProtectedRoute>
            }
          >
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="employees" element={<AdminEmployees />} />
            <Route path="tasks" element={<AdminTasks />} />
            <Route path="tasks/create" element={<CreateTask />} />
          </Route>

          {/* Employee Protected Routes */}
          <Route
            path="/employee"
            element={
              <ProtectedRoute requiredRole="employee">
                <DashboardLayout title="Employee Workspace" />
              </ProtectedRoute>
            }
          >
            <Route path="dashboard" element={<EmployeeDashboard />} />
            <Route path="tasks" element={<EmployeeTasks />} />
          </Route>

          {/* Fallback 404 Route */}
          <Route path="*" element={<RootRedirect />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
