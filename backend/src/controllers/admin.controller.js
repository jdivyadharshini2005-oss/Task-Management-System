import { db } from "../db/index.js";
import { users, tasks } from "../db/schema/index.js";
import { eq, like, or, sql, count, desc } from "drizzle-orm";
import { hashPassword } from "../auth/auth.service.js";
import crypto from "crypto";

export async function getDashboardStats(req, res, next) {
  try {
    const statsResult = await db
      .select({
        status: tasks.status,
        count: count(tasks.id),
      })
      .from(tasks)
      .groupBy(tasks.status);

    let notStarted = 0;
    let inProgress = 0;
    let completed = 0;
    let total = 0;

    statsResult.forEach((row) => {
      const cnt = Number(row.count);
      total += cnt;
      if (row.status === "not_started") notStarted = cnt;
      if (row.status === "in_progress") inProgress = cnt;
      if (row.status === "completed") completed = cnt;
    });

    return res.status(200).json({
      success: true,
      stats: {
        notStarted,
        inProgress,
        completed,
        total,
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function getEmployees(req, res, next) {
  try {
    const { search } = req.query;

    let query = db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        role: users.role,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
      })
      .from(users)
      .where(eq(users.role, "employee"));

    if (search && search.trim() !== "") {
      const searchPattern = `%${search.trim()}%`;
      query = db
        .select({
          id: users.id,
          name: users.name,
          email: users.email,
          role: users.role,
          createdAt: users.createdAt,
          updatedAt: users.updatedAt,
        })
        .from(users)
        .where(
          sql`${users.role} = 'employee' AND (${users.name} ILIKE ${searchPattern} OR ${users.email} ILIKE ${searchPattern})`
        );
    }

    const employeeList = await query.orderBy(desc(users.createdAt));

    return res.status(200).json({
      success: true,
      employees: employeeList,
    });
  } catch (error) {
    next(error);
  }
}

export async function createEmployee(req, res, next) {
  try {
    const { name, email, password } = req.body;
    const normalizedEmail = email.toLowerCase().trim();

    // Check if email already exists
    const [existing] = await db.select().from(users).where(eq(users.email, normalizedEmail));
    if (existing) {
      return res.status(409).json({
        success: false,
        message: "An account with this email address already exists.",
      });
    }

    const hashedPassword = await hashPassword(password);
    const userId = crypto.randomUUID();

    const [newEmployee] = await db
      .insert(users)
      .values({
        id: userId,
        name,
        email: normalizedEmail,
        password: hashedPassword,
        role: "employee",
      })
      .returning({
        id: users.id,
        name: users.name,
        email: users.email,
        role: users.role,
        createdAt: users.createdAt,
      });

    return res.status(201).json({
      success: true,
      message: "Employee created successfully",
      employee: newEmployee,
    });
  } catch (error) {
    next(error);
  }
}

export async function getEmployeeById(req, res, next) {
  try {
    const { id } = req.params;

    const [employee] = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        role: users.role,
        createdAt: users.createdAt,
      })
      .from(users)
      .where(sql`${users.id} = ${id} AND ${users.role} = 'employee'`);

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    const employeeTasks = await db.select().from(tasks).where(eq(tasks.assignedTo, id));

    return res.status(200).json({
      success: true,
      employee: {
        ...employee,
        tasks: employeeTasks,
      },
    });
  } catch (error) {
    next(error);
  }
}
