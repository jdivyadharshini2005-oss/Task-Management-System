import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { api } from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import { StatCard } from "../../components/common/StatCard";
import { StatusBadge, PriorityBadge } from "../../components/common/Badge";
import { AlertCircle, Clock, CheckCircle2, ListTodo, ArrowRight } from "lucide-react";

export const EmployeeDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({ notStarted: 0, inProgress: 0, completed: 0, total: 0 });
  const [myTasks, setMyTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [statsRes, tasksRes] = await Promise.all([
          api.get("/employee/dashboard/stats"),
          api.get("/employee/tasks"),
        ]);

        if (statsRes.data.success) {
          setStats(statsRes.data.stats);
        }
        if (tasksRes.data.tasks) {
          setMyTasks(tasksRes.data.tasks);
        }
      } catch (err) {
        console.error("Employee dashboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-slate-900 to-indigo-900 rounded-2xl p-6 md:p-8 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">Employee Workspace</span>
          <h2 className="text-2xl font-bold tracking-tight mt-0.5">Welcome back, {user?.name}!</h2>
          <p className="text-slate-300 text-sm mt-1">
            Here is an overview of tasks currently assigned to you.
          </p>
        </div>
        <Link
          to="/employee/tasks"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl text-sm transition-all shadow-md shrink-0"
        >
          View My Tasks <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Scoped Statistics Cards */}
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
          title="My Total Tasks"
          value={stats.total}
          icon={ListTodo}
          color="indigo"
          loading={loading}
        />
      </div>

      {/* Recent Assigned Tasks Preview */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-slate-900">Assigned Tasks Overview</h3>
          <Link
            to="/employee/tasks"
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
          >
            Manage All ({myTasks.length}) <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-16 bg-slate-100 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : myTasks.length === 0 ? (
          <div className="py-12 text-center text-slate-500 text-sm">
            You currently have no tasks assigned.
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {myTasks.slice(0, 5).map((task) => (
              <div key={task.id} className="py-3.5 flex items-center justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-slate-900 truncate">{task.title}</p>
                  <p className="text-xs text-slate-500 truncate mt-0.5">{task.description}</p>
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
    </div>
  );
};
