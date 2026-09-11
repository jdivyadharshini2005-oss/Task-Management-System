import { Router } from "express";
import { login, logout, getSession } from "../controllers/auth.controller.js";
import { validate } from "../middleware/validate.middleware.js";
import { loginSchema } from "../validators/auth.validator.js";
import { requireAuth } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/login", validate(loginSchema), login);
router.post("/logout", requireAuth, logout);
router.get("/session", requireAuth, getSession);

export default router;
