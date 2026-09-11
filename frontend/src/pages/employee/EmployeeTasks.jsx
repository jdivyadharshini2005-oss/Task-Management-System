import React, { useState, useEffect } from "react";
import { api } from "../../services/api";
import { PriorityBadge } from "../../components/common/Badge";
import { Calendar, CheckCircle2, AlertCircle, Clock, Check } from "lucide-react";

export const EmployeeTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingTaskId, setUpdatingTaskId] = useState(null);
  const [notification, setNotification] = useState("");

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const res = await api.get("/employee/tasks");
      if (res.data.success) {
        setTasks(res.data.tasks);
      }
    } catch (err) {
      console.error("Failed to fetch employee tasks:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleStatusChange = async (taskId, newStatus) => {
    setUpdatingTaskId(taskId);
    setNotification("");
    try {
      const res = await api.patch(`/employee/tasks/${taskId}/status`, { status: newStatus });
      if (res.data.success) {
        setTasks((prev) =>
          prev.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t))
        );
        setNotification("Status updated & notification sent to Admin!");
        setTimeout(() => setNotification(""), 4000);
      }
    } catch (err) {
      console.error("Failed to update task status:", err);
      alert(err.response?.data?.message || "Failed to update status.");
    } finally {
      setUpdatingTaskId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">My Assigned Tasks</h2>
          <p className="text-xs text-slate-500 mt-1">
            View and update the execution status of your assigned tasks.
          </p>
        </div>
      </div>

      {notification && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-sm flex items-center gap-2">
          <Check className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* Task Cards & Table Container */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold uppercase tracking-wider text-slate-500">
                <th className="py-4 px-6">Task Title & Description</th>
                <th className="py-4 px-6">Priority</th>
                <th className="py-4 px-6">Due Date</th>
                <th className="py-4 px-6">Status Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm font-medium text-slate-700">
              {loading ? (
                Array.from({ length: 4 }).map((_, idx) => (
                  <tr key={idx}>
                    <td className="py-4 px-6"><div className="h-4 w-64 bg-slate-100 rounded animate-pulse" /></td>
                    <td className="py-4 px-6"><div className="h-4 w-16 bg-slate-100 rounded animate-pulse" /></td>
                    <td className="py-4 px-6"><div className="h-4 w-24 bg-slate-100 rounded animate-pulse" /></td>
                    <td className="py-4 px-6"><div className="h-8 w-32 bg-slate-100 rounded animate-pulse" /></td>
                  </tr>
                ))
              ) : tasks.length === 0 ? (
                <tr>
                  <td colSpan="4" className="py-12 text-center text-slate-500">
                    No tasks assigned to you yet.
                  </td>
                </tr>
              ) : (
                tasks.map((task) => (
                  <tr key={task.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-4 px-6">
                      <div className="max-w-md">
                        <p className="font-semibold text-slate-900">{task.title}</p>
                        <p className="text-xs text-slate-500 mt-1 leading-relaxed">{task.description}</p>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <PriorityBadge priority={task.priority} />
                    </td>
                    <td className="py-4 px-6 text-xs text-slate-600 font-semibold">
                      {new Date(task.dueDate).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
                    </td>
                    <td className="py-4 px-6">
                      <div className="relative inline-block w-40">
                        <select
                          disabled={updatingTaskId === task.id}
                          value={task.status}
                          onChange={(e) => handleStatusChange(task.id, e.target.value)}
                          className={`w-full py-2 px-3 pr-8 rounded-xl text-xs font-bold border transition-all focus:outline-none focus:ring-2 focus:ring-indigo-600 cursor-pointer ${
                            task.status === "completed"
                              ? "bg-emerald-50 text-emerald-700 border-emerald-300"
                              : task.status === "in_progress"
                              ? "bg-blue-50 text-blue-700 border-blue-300"
                              : "bg-amber-50 text-amber-700 border-amber-300"
                          }`}
                        >
                          <option value="not_started">Not Started</option>
                          <option value="in_progress">In Progress</option>
                          <option value="completed">Completed</option>
                        </select>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
