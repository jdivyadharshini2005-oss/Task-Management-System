import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { api } from "../../services/api";
import { StatCard } from "../../components/common/StatCard";
import { StatusBadge, PriorityBadge } from "../../components/common/Badge";
import { AlertCircle, Clock, CheckCircle2, ListTodo, PlusSquare, Users, ArrowRight } from "lucide-react";

export const AdminDashboard = () => {
  const [stats, setStats] = useState({ notStarted: 0, inProgress: 0, completed: 0, total: 0 });
  const [recentTasks, setRecentTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchData = async () => {
    setLoading(true);
    setError("");
    try {
      const [statsRes, tasksRes] = await Promise.all([
        api.get("/admin/dashboard/stats"),
        api.get("/tasks?page=1&limit=5"),
      ]);

      if (statsRes.data.success) {
        setStats(statsRes.data.stats);
      }
      if (tasksRes.data.tasks) {
        setRecentTasks(tasksRes.data.tasks);
      }
    } catch (err) {
      console.error("Dashboard fetch error:", err);
      setError("Failed to load dashboard metrics. Please refresh the page.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="space-y-8">
      {/* Top Banner / Welcome */}
      <div className="bg-gradient-to-r from-indigo-600 to-indigo-800 rounded-2xl p-6 md:p-8 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Admin Overview</h2>
          <p className="text-indigo-200 text-sm mt-1">
            Monitor system-wide task execution, track team stats, and manage task assignments.
          </p>
        </div>
        <div className="flex gap-3">
          <Link
            to="/admin/tasks/create"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-white text-indigo-700 font-semibold rounded-xl text-sm hover:bg-indigo-50 transition-colors shadow-md"
          >
            <PlusSquare className="w-4 h-4" />
            Assign New Task
          </Link>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-sm">
          {error}
        </div>
      )}

      {/* Statistics Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Not Started"
          value={stats.notStarted}
          icon={AlertCircle}
          color="amber"
          loading={loading}
        />
        <StatCard
          title="In Progress"
          value={stats.inProgress}
          icon={Clock}
          color="blue"
          loading={loading}
        />
        <StatCard
          title="Completed"
          value={stats.completed}
          icon={CheckCircle2}
          color="emerald"
          loading={loading}
        />
        <StatCard
          title="Total Tasks"
          value={stats.total}
          icon={ListTodo}
          color="indigo"
          loading={loading}
        />
      </div>

      {/* Quick Navigation Cards & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Tasks List (2 cols) */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-slate-900">Recent Assigned Tasks</h3>
            <Link
              to="/admin/tasks"
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
            >
              View All Tasks <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((n) => (
                <div key={n} className="h-16 bg-slate-100 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : recentTasks.length === 0 ? (
            <div className="py-12 text-center text-slate-500 text-sm">
              No tasks found. Click "Assign New Task" to create one.
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {recentTasks.map((task) => (
                <div key={task.id} className="py-3.5 flex items-center justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-slate-900 truncate">{task.title}</p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Assigned to: <span className="font-medium text-slate-700">{task.employeeName || "Unassigned"}</span>
                    </p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <PriorityBadge priority={task.priority} />
                    <StatusBadge status={task.status} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Action Shortcuts (1 col) */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <h3 className="text-base font-bold text-slate-900 mb-4">Quick Management</h3>
            <div className="space-y-3">
              <Link
                to="/admin/tasks/create"
                className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-200 text-slate-800 hover:text-indigo-700 font-semibold text-sm transition-all"
              >
                <div className="flex items-center gap-3">
                  <PlusSquare className="w-5 h-5 text-indigo-600" />
                  Assign New Task
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400" />
              </Link>

              <Link
                to="/admin/employees"
                className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-200 text-slate-800 hover:text-indigo-700 font-semibold text-sm transition-all"
              >
                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5 text-indigo-600" />
                  Manage Employees
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
