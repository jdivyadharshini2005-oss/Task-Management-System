import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { api } from "../../services/api";
import { StatusBadge, PriorityBadge } from "../../components/common/Badge";
import { Pagination } from "../../components/common/Pagination";
import { Search, PlusSquare, Calendar, User, CheckSquare } from "lucide-react";

export const AdminTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalTasks, setTotalTasks] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchTasks = async (p = 1, searchQuery = "") => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams({
        page: p.toString(),
        limit: "10",
      });
      if (searchQuery) queryParams.append("search", searchQuery);

      const res = await api.get(`/tasks?${queryParams.toString()}`);
      if (res.data.tasks) {
        setTasks(res.data.tasks);
        setPage(res.data.page);
        setTotalPages(res.data.totalPages);
        setTotalTasks(res.data.total);
      }
    } catch (err) {
      console.error("Failed to fetch tasks:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchTasks(page, search);
    }, 300);
    return () => clearTimeout(timer);
  }, [search, page]);

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Task Management</h2>
          <p className="text-xs text-slate-500 mt-1">
            Server-side searchable and paginated view of all assigned tasks ({totalTasks} total).
          </p>
        </div>
        <Link
          to="/admin/tasks/create"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm rounded-xl shadow-md shadow-indigo-600/20 transition-all shrink-0"
        >
          <PlusSquare className="w-4 h-4" />
          Assign New Task
        </Link>
      </div>

      {/* Search Input Box */}
      <div className="relative max-w-md">
        <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-3" />
        <input
          type="text"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1); // Reset to page 1 on search change
          }}
          placeholder="Search tasks by title, description, employee..."
          className="w-full pl-11 pr-4 py-2.5 bg-white border border-slate-300 rounded-xl text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-600 shadow-sm"
        />
      </div>

      {/* Responsive Tasks Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col justify-between">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold uppercase tracking-wider text-slate-500">
                <th className="py-4 px-6">Task</th>
                <th className="py-4 px-6">Employee</th>
                <th className="py-4 px-6">Priority</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6">Due Date</th>
                <th className="py-4 px-6">Created Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm font-medium text-slate-700">
              {loading ? (
                Array.from({ length: 5 }).map((_, idx) => (
                  <tr key={idx}>
                    <td className="py-4 px-6"><div className="h-4 w-48 bg-slate-100 rounded animate-pulse" /></td>
                    <td className="py-4 px-6"><div className="h-4 w-32 bg-slate-100 rounded animate-pulse" /></td>
                    <td className="py-4 px-6"><div className="h-4 w-16 bg-slate-100 rounded animate-pulse" /></td>
                    <td className="py-4 px-6"><div className="h-4 w-20 bg-slate-100 rounded animate-pulse" /></td>
                    <td className="py-4 px-6"><div className="h-4 w-24 bg-slate-100 rounded animate-pulse" /></td>
                    <td className="py-4 px-6"><div className="h-4 w-24 bg-slate-100 rounded animate-pulse" /></td>
                  </tr>
                ))
              ) : tasks.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-slate-500">
                    No tasks match your query.
                  </td>
                </tr>
              ) : (
                tasks.map((task) => (
                  <tr key={task.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-4 px-6">
                      <div className="max-w-xs">
                        <p className="font-semibold text-slate-900 truncate">{task.title}</p>
                        <p className="text-xs text-slate-500 truncate mt-0.5">{task.description}</p>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-slate-400" />
                        <div>
                          <p className="font-semibold text-slate-800 text-xs">{task.employeeName || "Unassigned"}</p>
                          <p className="text-[11px] text-slate-500">{task.employeeEmail}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <PriorityBadge priority={task.priority} />
                    </td>
                    <td className="py-4 px-6">
                      <StatusBadge status={task.status} />
                    </td>
                    <td className="py-4 px-6 text-xs text-slate-600 font-semibold">
                      {new Date(task.dueDate).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
                    </td>
                    <td className="py-4 px-6 text-xs text-slate-500">
                      {new Date(task.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Server-Side Pagination Controls */}
        <Pagination page={page} totalPages={totalPages} onPageChange={(p) => setPage(p)} />
      </div>
    </div>
  );
};
