import { Router } from "express";
import {
  getAdminTasks,
  createTask,
  getTaskById,
  updateTask,
  deleteTask,
} from "../controllers/task.controller.js";
import { requireAuth, requireRole } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { createTaskSchema } from "../validators/task.validator.js";

const router = Router();

// Protect all task endpoints for Admin
router.use(requireAuth, requireRole("admin"));

router.get("/", getAdminTasks);
router.post("/", validate(createTaskSchema), createTask);
router.get("/:id", getTaskById);
router.patch("/:id", updateTask);
router.delete("/:id", deleteTask);

export default router;
