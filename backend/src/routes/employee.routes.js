import { Router } from "express";
import {
  getEmployeeDashboardStats,
  getEmployeeTasks,
  updateEmployeeTaskStatus,
} from "../controllers/employee.controller.js";
import { requireAuth, requireRole } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { updateTaskStatusSchema } from "../validators/task.validator.js";

const router = Router();

// Protect all employee endpoints
router.use(requireAuth, requireRole("employee"));

router.get("/dashboard/stats", getEmployeeDashboardStats);
router.get("/tasks", getEmployeeTasks);
router.patch("/tasks/:id/status", validate(updateTaskStatusSchema), updateEmployeeTaskStatus);

export default router;
