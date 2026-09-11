import React from "react";
import { useAuth } from "../../context/AuthContext";
import { Menu, LogOut, User as UserIcon } from "lucide-react";

export const Navbar = ({ title, onMenuClick }) => {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-200 px-4 md:px-8 py-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 md:hidden"
        >
          <Menu className="w-5 h-5" />
        </button>
        <h1 className="text-xl font-bold text-slate-900">{title}</h1>
      </div>

      <div className="flex items-center gap-4">
        {/* User Info Capsule */}
        <div className="flex items-center gap-3 px-3 py-1.5 rounded-full bg-slate-100 border border-slate-200">
          <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-xs uppercase shadow-sm">
            {user?.name?.charAt(0) || "U"}
          </div>
          <div className="hidden sm:block text-left pr-1">
            <p className="text-xs font-bold text-slate-900 leading-tight">{user?.name}</p>
            <p className="text-[11px] text-slate-500 leading-tight">{user?.email}</p>
          </div>
        </div>

        <button
          onClick={logout}
          title="Logout"
          className="p-2 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
};
