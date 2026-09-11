import { z } from "zod";

export const createTaskSchema = z.object({
  title: z.string().min(3, "Task title is required (at least 3 characters)"),
  description: z.string().min(5, "Task description is required"),
  assignedTo: z.string().min(1, "Employee selection is required"),
  priority: z.enum(["high", "medium", "low"], {
    errorMap: () => ({ message: "Priority must be high, medium, or low" }),
  }),
  dueDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Valid due date is required",
  }),
});

export const updateTaskStatusSchema = z.object({
  status: z.enum(["not_started", "in_progress", "completed"], {
    errorMap: () => ({ message: "Status must be not_started, in_progress, or completed" }),
  }),
});

export const taskQuerySchema = z.object({
  search: z.string().optional(),
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
});
