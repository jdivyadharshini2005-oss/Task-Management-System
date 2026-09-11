import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  LayoutDashboard,
  Users,
  CheckSquare,
  PlusSquare,
  LogOut,
  CheckCircle2,
  X,
} from "lucide-react";

export const Sidebar = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const isAdmin = user?.role === "admin";

  const adminLinks = [
    { name: "Dashboard", path: "/admin/dashboard", icon: LayoutDashboard },
    { name: "Employees", path: "/admin/employees", icon: Users },
    { name: "Tasks", path: "/admin/tasks", icon: CheckSquare },
    { name: "Assign Task", path: "/admin/tasks/create", icon: PlusSquare },
  ];

  const employeeLinks = [
    { name: "Dashboard", path: "/employee/dashboard", icon: LayoutDashboard },
    { name: "My Tasks", path: "/employee/tasks", icon: CheckSquare },
  ];

  const links = isAdmin ? adminLinks : employeeLinks;

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm md:hidden"
        />
      )}

      <aside
        className={`fixed top-0 left-0 z-50 h-full w-64 bg-slate-900 text-white flex flex-col justify-between transition-transform duration-300 md:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div>
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-600 rounded-lg text-white">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <span className="text-lg font-bold tracking-tight text-white">TaskMaster</span>
            </div>
            <button
              onClick={onClose}
              className="p-1 text-slate-400 hover:text-white md:hidden"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* User Role Tag */}
          <div className="px-6 py-3 border-b border-slate-800/60 bg-slate-950/40">
            <span className="text-xs text-slate-400">Signed in as</span>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="font-semibold text-sm text-slate-200 truncate">{user?.name}</span>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                  isAdmin ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30" : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                }`}
              >
                {user?.role}
              </span>
            </div>
          </div>

          {/* Navigation */}
          <nav className="p-4 space-y-1.5">
            {links.map((link) => {
              const Icon = link.icon;
              return (
                <NavLink
                  key={link.path}
                  to={link.path}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-sm transition-colors ${
                      isActive
                        ? "bg-indigo-600 text-white font-semibold shadow-md shadow-indigo-600/30"
                        : "text-slate-300 hover:bg-slate-800 hover:text-white"
                    }`
                  }
                >
                  <Icon className="w-5 h-5" />
                  {link.name}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Footer Logout */}
        <div className="p-4 border-t border-slate-800">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-lg font-medium text-sm text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
};
