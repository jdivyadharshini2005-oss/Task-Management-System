import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import employeeRoutes from "./routes/employee.routes.js";
import taskRoutes from "./routes/task.routes.js";
import { getEmployees, createEmployee, getEmployeeById } from "./controllers/admin.controller.js";
import { requireAuth, requireRole } from "./middleware/auth.middleware.js";
import { validate } from "./middleware/validate.middleware.js";
import { createEmployeeSchema } from "./validators/employee.validator.js";
import { errorHandler, notFoundHandler } from "./middleware/error.middleware.js";
import { initTables } from "./db/migrate.js";
import { db } from "./db/index.js";
import { users } from "./db/schema/index.js";
import { eq } from "drizzle-orm";
import { hashPassword } from "./auth/auth.service.js";
import crypto from "crypto";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// CORS setup
const allowedOrigins = [
  process.env.FRONTEND_URL || "http://localhost:5173",
  "http://localhost:5173",
  "http://127.0.0.1:5173",
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(null, true); // Allow during dev testing
      }
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

// Health Check
app.get("/api/health", (req, res) => {
  res.status(200).json({ success: true, message: "Task Management API is running", timestamp: new Date() });
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/employee", employeeRoutes);
app.use("/api/tasks", taskRoutes);

// Direct /api/employees routes for Admin
app.get("/api/employees", requireAuth, requireRole("admin"), getEmployees);
app.post("/api/employees", requireAuth, requireRole("admin"), validate(createEmployeeSchema), createEmployee);
app.get("/api/employees/:id", requireAuth, requireRole("admin"), getEmployeeById);

// 404 & Centralized Error Handling
app.use(notFoundHandler);
app.use(errorHandler);

// Auto-seed default admin account on startup
async function seedDefaultAdmin() {
  try {
    const DEFAULT_ADMIN_EMAIL = "admin@example.com";
    const DEFAULT_ADMIN_PASSWORD = "Admin123!";

    const [existing] = await db.select().from(users).where(eq(users.email, DEFAULT_ADMIN_EMAIL));
    if (!existing) {
      const hashedPassword = await hashPassword(DEFAULT_ADMIN_PASSWORD);
      await db.insert(users).values({
        id: crypto.randomUUID(),
        name: "System Admin",
        email: DEFAULT_ADMIN_EMAIL,
        role: "admin",
        password: hashedPassword,
      });
      console.log("✅ Default admin account created.");
      console.log("   Email   : admin@example.com");
      console.log("   Password: Admin123!");
    } else {
      console.log("ℹ️  Default admin already exists — skipping seed.");
    }
  } catch (err) {
    console.warn("⚠ Could not seed default admin:", err.message);
  }
}

// Start server
async function startServer() {
  try {
    // Initialize tables
    await initTables().catch((err) => {
      console.warn("⚠ Table initialization notice:", err.message);
    });

    // Ensure default admin credentials exist
    await seedDefaultAdmin();

    app.listen(PORT, () => {
      console.log(`🚀 Task Management API listening on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

startServer();
