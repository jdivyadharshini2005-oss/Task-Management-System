import { db, client } from "./index.js";
import { users, tasks, sessions, accounts } from "./schema/index.js";
import { hashPassword } from "../auth/auth.service.js";
import { initTables } from "./migrate.js";
import crypto from "crypto";

async function seed() {
  console.log("🌱 Starting Database Seeding...");

  try {
    await initTables();

    // Clear existing data
    console.log("Clearing existing tasks and users...");
    await db.delete(tasks);
    await db.delete(sessions);
    await db.delete(accounts);
    await db.delete(users);

    const adminPassword = await hashPassword("Admin123!");
    const employeePassword = await hashPassword("Employee123!");

    // 1. Create Admin
    const adminId = crypto.randomUUID();
    const [admin] = await db
      .insert(users)
      .values({
        id: adminId,
        name: "System Admin",
        email: "admin@example.com",
        role: "admin",
        password: adminPassword,
      })
      .returning();

    console.log(`✅ Admin created: ${admin.email} (password: Admin123!)`);

    // 2. Create Employees
    const emp1Id = crypto.randomUUID();
    const emp2Id = crypto.randomUUID();
    const emp3Id = crypto.randomUUID();

    const employeeData = [
      { id: emp1Id, name: "John Doe", email: "john.doe@example.com", role: "employee", password: employeePassword },
      { id: emp2Id, name: "Jane Smith", email: "jane.smith@example.com", role: "employee", password: employeePassword },
      { id: emp3Id, name: "Alex Jones", email: "alex.jones@example.com", role: "employee", password: employeePassword },
    ];

    await db.insert(users).values(employeeData);
    console.log(`✅ 3 Employees created (password: Employee123!)`);

    // 3. Create Sample Tasks
    const now = new Date();
    const futureDate = (days) => new Date(now.getTime() + days * 24 * 60 * 60 * 1000);

    const sampleTasks = [
      {
        id: crypto.randomUUID(),
        title: "Design Authentication Flow",
        description: "Implement session-based Better Auth flow with RBAC role selection.",
        priority: "high",
        status: "completed",
        assignedTo: emp1Id,
        createdBy: adminId,
        dueDate: futureDate(2),
      },
      {
        id: crypto.randomUUID(),
        title: "Setup Drizzle ORM Migrations",
        description: "Configure Neon PostgreSQL schema for users, sessions, and task tables.",
        priority: "high",
        status: "in_progress",
        assignedTo: emp1Id,
        createdBy: adminId,
        dueDate: futureDate(3),
      },
      {
        id: crypto.randomUUID(),
        title: "Build Responsive Admin Dashboard UI",
        description: "Develop statistics cards, responsive navigation sidebar, and employee table.",
        priority: "high",
        status: "in_progress",
        assignedTo: emp2Id,
        createdBy: adminId,
        dueDate: futureDate(5),
      },
      {
        id: crypto.randomUUID(),
        title: "Configure Nodemailer SMTP Notifications",
        description: "Set up automated email alerts when tasks are assigned or status is updated.",
        priority: "medium",
        status: "not_started",
        assignedTo: emp2Id,
        createdBy: adminId,
        dueDate: futureDate(7),
      },
      {
        id: crypto.randomUUID(),
        title: "Implement Server-Side Task Pagination",
        description: "Add page, limit, and search filters to REST API endpoints for large datasets.",
        priority: "medium",
        status: "not_started",
        assignedTo: emp3Id,
        createdBy: adminId,
        dueDate: futureDate(4),
      },
      {
        id: crypto.randomUUID(),
        title: "Integrate Zod Request Validation",
        description: "Validate all login, employee creation, and task status payloads cleanly.",
        priority: "low",
        status: "completed",
        assignedTo: emp3Id,
        createdBy: adminId,
        dueDate: futureDate(1),
      },
      {
        id: crypto.randomUUID(),
        title: "Perform Security Audit & RBAC Checks",
        description: "Verify HTTP 401 unauthenticated and HTTP 403 unauthorized role guard behaviors.",
        priority: "high",
        status: "not_started",
        assignedTo: emp1Id,
        createdBy: adminId,
        dueDate: futureDate(6),
      },
      {
        id: crypto.randomUUID(),
        title: "Write End-to-End README Documentation",
        description: "Document project setup, prerequisites, migration steps, and seed credentials.",
        priority: "medium",
        status: "not_started",
        assignedTo: emp3Id,
        createdBy: adminId,
        dueDate: futureDate(8),
      },
    ];

    await db.insert(tasks).values(sampleTasks);
    console.log(`✅ Seeded ${sampleTasks.length} sample tasks successfully.`);

    console.log("\n================ SEED SUMMARY ================");
    console.log("Admin Account:");
    console.log("  Email: admin@example.com");
    console.log("  Password: Admin123!");
    console.log("Employee Accounts:");
    console.log("  Email: john.doe@example.com (Password: Employee123!)");
    console.log("  Email: jane.smith@example.com (Password: Employee123!)");
    console.log("  Email: alex.jones@example.com (Password: Employee123!)");
    console.log("===============================================\n");
  } catch (error) {
    console.error("❌ Seeding failed:", error);
  } finally {
    if (typeof client.end === "function") await client.end();
    else if (typeof client.close === "function") await client.close();
  }
}

seed();
