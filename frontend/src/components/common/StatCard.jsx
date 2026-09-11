import React from "react";

export const StatCard = ({ title, value, icon: Icon, color = "indigo", loading = false }) => {
  const colorStyles = {
    amber: "bg-amber-50 text-amber-600 border-amber-100",
    blue: "bg-blue-50 text-blue-600 border-blue-100",
    emerald: "bg-emerald-50 text-emerald-600 border-emerald-100",
    indigo: "bg-indigo-50 text-indigo-600 border-indigo-100",
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{title}</p>
          {loading ? (
            <div className="h-8 w-16 bg-slate-200 animate-pulse rounded mt-2"></div>
          ) : (
            <h3 className="text-2xl font-bold text-slate-900 mt-1">{value}</h3>
          )}
        </div>
        <div className={`p-3 rounded-xl border ${colorStyles[color] || colorStyles.indigo}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
};
