import { Router } from "express";
import { getDashboardStats, getEmployees, createEmployee, getEmployeeById } from "../controllers/admin.controller.js";
import { requireAuth, requireRole } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { createEmployeeSchema } from "../validators/employee.validator.js";

const router = Router();

// Protect all admin endpoints
router.use(requireAuth, requireRole("admin"));

router.get("/dashboard/stats", getDashboardStats);
router.get("/employees", getEmployees);
router.post("/employees", validate(createEmployeeSchema), createEmployee);
router.get("/employees/:id", getEmployeeById);

export default router;
