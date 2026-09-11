import React, { useState, useEffect } from "react";
import { api } from "../../services/api";
import { Search, UserPlus, Mail, Lock, User, Calendar, Check, X, AlertCircle } from "lucide-react";

export const AdminEmployees = () => {
  const [employees, setEmployees] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Create employee form state
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [formErrors, setFormErrors] = useState({});
  const [formGeneralError, setFormGeneralError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const fetchEmployees = async (searchQuery = "") => {
    setLoading(true);
    try {
      const res = await api.get(`/admin/employees${searchQuery ? `?search=${encodeURIComponent(searchQuery)}` : ""}`);
      if (res.data.success) {
        setEmployees(res.data.employees);
      }
    } catch (err) {
      console.error("Failed to fetch employees:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchEmployees(search);
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    setFormErrors({});
    setFormGeneralError("");
    setSubmitting(true);

    try {
      const res = await api.post("/admin/employees", formData);
      if (res.data.success) {
        setSuccessMessage(`Employee ${res.data.employee.name} created successfully!`);
        setFormData({ name: "", email: "", password: "" });
        setIsModalOpen(false);
        fetchEmployees(search);
        setTimeout(() => setSuccessMessage(""), 4000);
      }
    } catch (err) {
      if (err.response?.data?.errors) {
        setFormErrors(err.response.data.errors);
      } else {
        setFormGeneralError(err.response?.data?.message || "Failed to create employee.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Employee Management</h2>
          <p className="text-xs text-slate-500 mt-1">View registered team members or provision new employee accounts.</p>
        </div>
        <button
          onClick={() => {
            setFormErrors({});
            setFormGeneralError("");
            setIsModalOpen(true);
          }}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm rounded-xl shadow-md shadow-indigo-600/20 transition-all shrink-0"
        >
          <UserPlus className="w-4 h-4" />
          Create Employee
        </button>
      </div>

      {successMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-sm flex items-center gap-2">
          <Check className="w-5 h-5 text-emerald-600" />
          {successMessage}
        </div>
      )}

      {/* Search Filter Box */}
      <div className="relative max-w-md">
        <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-3" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search employees by name or email..."
          className="w-full pl-11 pr-4 py-2.5 bg-white border border-slate-300 rounded-xl text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-600 shadow-sm"
        />
      </div>

      {/* Employees Responsive Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold uppercase tracking-wider text-slate-500">
                <th className="py-4 px-6">Name</th>
                <th className="py-4 px-6">Email</th>
                <th className="py-4 px-6">Role</th>
                <th className="py-4 px-6">Created Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm font-medium text-slate-700">
              {loading ? (
                Array.from({ length: 4 }).map((_, idx) => (
                  <tr key={idx}>
                    <td className="py-4 px-6"><div className="h-4 w-32 bg-slate-100 rounded animate-pulse" /></td>
                    <td className="py-4 px-6"><div className="h-4 w-44 bg-slate-100 rounded animate-pulse" /></td>
                    <td className="py-4 px-6"><div className="h-4 w-16 bg-slate-100 rounded animate-pulse" /></td>
                    <td className="py-4 px-6"><div className="h-4 w-28 bg-slate-100 rounded animate-pulse" /></td>
                  </tr>
                ))
              ) : employees.length === 0 ? (
                <tr>
                  <td colSpan="4" className="py-12 text-center text-slate-500">
                    No employees found matching query.
                  </td>
                </tr>
              ) : (
                employees.map((emp) => (
                  <tr key={emp.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs">
                          {emp.name?.charAt(0) || "E"}
                        </div>
                        <span className="font-semibold text-slate-900">{emp.name}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-slate-600">{emp.email}</td>
                    <td className="py-4 px-6">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {emp.role}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-slate-500 text-xs">
                      {new Date(emp.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Employee Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 border border-slate-200 relative animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-bold text-slate-900 mb-1">Create New Employee</h3>
            <p className="text-xs text-slate-500 mb-6">Provision login credentials for a new team member.</p>

            {formGeneralError && (
              <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                {formGeneralError}
              </div>
            )}

            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Jane Smith"
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600"
                  />
                </div>
                {formErrors.name && <p className="text-xs text-rose-600 mt-1">{formErrors.name}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="jane.smith@example.com"
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600"
                  />
                </div>
                {formErrors.email && <p className="text-xs text-rose-600 mt-1">{formErrors.email}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="password"
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="At least 6 characters"
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600"
                  />
                </div>
                {formErrors.password && <p className="text-xs text-rose-600 mt-1">{formErrors.password}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Role</label>
                <input
                  type="text"
                  disabled
                  value="employee"
                  className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-xl text-sm text-slate-500 font-semibold cursor-not-allowed uppercase"
                />
              </div>

              <div className="pt-3 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-2.5 border border-slate-300 text-slate-700 font-semibold text-sm rounded-xl hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm rounded-xl shadow-md shadow-indigo-600/20 disabled:opacity-60"
                >
                  {submitting ? "Creating..." : "Create Employee"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
