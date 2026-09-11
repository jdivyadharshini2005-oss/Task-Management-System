import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { CheckCircle2, Shield, User, Lock, Mail, AlertCircle } from "lucide-react";

export const Login = () => {
  const [role, setRole] = useState("admin"); // 'admin' | 'employee'
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please fill in all required fields.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await login(email, password, role);
      if (res.success) {
        const redirectPath = role === "admin" ? "/admin/dashboard" : "/employee/dashboard";
        navigate(redirectPath);
      }
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.response?.data?.errors?.general ||
        "Login failed. Please check your credentials and try again.";
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-2">
        {/* Left: Branding & Abstract Graphic */}
        <div className="bg-gradient-to-br from-indigo-600 via-indigo-700 to-slate-900 p-8 md:p-12 text-white flex flex-col justify-between relative overflow-hidden">
          <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -left-12 -top-12 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2.5 bg-white/10 backdrop-blur-md rounded-xl border border-white/20">
                <CheckCircle2 className="w-7 h-7 text-indigo-300" />
              </div>
              <span className="text-2xl font-extrabold tracking-tight">TaskMaster</span>
            </div>

            <h2 className="text-3xl font-bold leading-tight mb-4">
              Enterprise Task & Team Management
            </h2>
            <p className="text-indigo-200 text-sm leading-relaxed">
              Streamline team collaboration, track task lifecycles with real-time status updates, and automate status notifications.
            </p>
          </div>

          <div className="relative z-10 mt-12 pt-8 border-t border-indigo-500/30">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/5 backdrop-blur-sm p-3 rounded-lg border border-white/10">
                <p className="text-xs text-indigo-200 font-medium">Role-Based Access</p>
                <p className="text-xs text-white font-bold mt-1">Admin & Employee</p>
              </div>
              <div className="bg-white/5 backdrop-blur-sm p-3 rounded-lg border border-white/10">
                <p className="text-xs text-indigo-200 font-medium">Notifications</p>
                <p className="text-xs text-white font-bold mt-1">Nodemailer SMTP</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Login Card */}
        <div className="p-8 md:p-12 flex flex-col justify-center bg-white">
          <div className="mb-6 text-center md:text-left">
            <h3 className="text-2xl font-bold text-slate-900">Task Management System</h3>
            <p className="text-sm text-slate-500 mt-1">Select your portal role and sign in to continue.</p>
          </div>

          {/* Role Selector Toggle */}
          <div className="mb-6">
            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">
              Select Role
            </label>
            <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-xl border border-slate-200">
              <button
                type="button"
                onClick={() => setRole("admin")}
                className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg font-semibold text-sm transition-all ${
                  role === "admin"
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <Shield className="w-4 h-4" />
                Admin
              </button>
              <button
                type="button"
                onClick={() => setRole("employee")}
                className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg font-semibold text-sm transition-all ${
                  role === "employee"
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <User className="w-4 h-4" />
                Employee
              </button>
            </div>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="mb-6 p-4 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-3 text-rose-700 text-sm">
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-5 h-5 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={role === "admin" ? "admin@example.com" : "john.doe@example.com"}
                  required
                  className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:bg-white transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-5 h-5 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:bg-white transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full mt-2 py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm rounded-xl shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {submitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Signing In...
                </>
              ) : (
                "Login"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
