import { db } from "../db/index.js";
import { tasks, users } from "../db/schema/index.js";
import { eq, sql, count, desc } from "drizzle-orm";
import { sendTaskAssignedEmail } from "../services/email.service.js";
import crypto from "crypto";

export async function getAdminTasks(req, res, next) {
  try {
    const page = parseInt(req.query.page || "1", 10);
    const limit = parseInt(req.query.limit || "10", 10);
    const search = req.query.search?.trim() || "";

    const offset = (page - 1) * limit;

    let whereClause = sql`1=1`;

    if (search) {
      const searchPattern = `%${search}%`;
      whereClause = sql`
        (${tasks.title} ILIKE ${searchPattern} OR 
         ${tasks.description} ILIKE ${searchPattern} OR 
         ${users.name} ILIKE ${searchPattern} OR 
         ${users.email} ILIKE ${searchPattern})
      `;
    }

    // Count query
    const [countResult] = await db
      .select({ total: count(tasks.id) })
      .from(tasks)
      .leftJoin(users, eq(tasks.assignedTo, users.id))
      .where(whereClause);

    const total = Number(countResult?.total || 0);
    const totalPages = Math.ceil(total / limit) || 1;

    // Data query with join to user (assignee)
    const taskList = await db
      .select({
        id: tasks.id,
        title: tasks.title,
        description: tasks.description,
        priority: tasks.priority,
        status: tasks.status,
        dueDate: tasks.dueDate,
        createdAt: tasks.createdAt,
        updatedAt: tasks.updatedAt,
        assignedTo: tasks.assignedTo,
        createdBy: tasks.createdBy,
        employeeName: users.name,
        employeeEmail: users.email,
      })
      .from(tasks)
      .leftJoin(users, eq(tasks.assignedTo, users.id))
      .where(whereClause)
      .orderBy(desc(tasks.createdAt))
      .limit(limit)
      .offset(offset);

    return res.status(200).json({
      tasks: taskList,
      page,
      limit,
      total,
      totalPages,
    });
  } catch (error) {
    next(error);
  }
}

export async function createTask(req, res, next) {
  try {
    const { title, description, assignedTo, priority, dueDate } = req.body;
    const adminId = req.user.id;

    // Verify assigned employee exists
    const [employee] = await db.select().from(users).where(eq(users.id, assignedTo));
    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Assigned employee not found",
      });
    }

    const taskId = crypto.randomUUID();
    const parsedDueDate = new Date(dueDate);

    const [newTask] = await db
      .insert(tasks)
      .values({
        id: taskId,
        title,
        description,
        priority,
        status: "not_started",
        assignedTo,
        createdBy: adminId,
        dueDate: parsedDueDate,
      })
      .returning();

    // Trigger email notification asynchronously
    sendTaskAssignedEmail({
      employeeEmail: employee.email,
      employeeName: employee.name,
      taskTitle: title,
      description,
      priority,
      dueDate: parsedDueDate,
    }).catch((err) => console.error("Email notification async error:", err));

    return res.status(201).json({
      success: true,
      message: "Task created and assigned successfully",
      task: {
        ...newTask,
        employeeName: employee.name,
        employeeEmail: employee.email,
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function getTaskById(req, res, next) {
  try {
    const { id } = req.params;

    const [task] = await db
      .select({
        id: tasks.id,
        title: tasks.title,
        description: tasks.description,
        priority: tasks.priority,
        status: tasks.status,
        dueDate: tasks.dueDate,
        createdAt: tasks.createdAt,
        updatedAt: tasks.updatedAt,
        assignedTo: tasks.assignedTo,
        createdBy: tasks.createdBy,
        employeeName: users.name,
        employeeEmail: users.email,
      })
      .from(tasks)
      .leftJoin(users, eq(tasks.assignedTo, users.id))
      .where(eq(tasks.id, id));

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    return res.status(200).json({
      success: true,
      task,
    });
  } catch (error) {
    next(error);
  }
}

export async function updateTask(req, res, next) {
  try {
    const { id } = req.params;
    const { title, description, assignedTo, priority, dueDate, status } = req.body;

    const [existingTask] = await db.select().from(tasks).where(eq(tasks.id, id));
    if (!existingTask) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    const updates = { updatedAt: new Date() };
    if (title) updates.title = title;
    if (description) updates.description = description;
    if (assignedTo) updates.assignedTo = assignedTo;
    if (priority) updates.priority = priority;
    if (status) updates.status = status;
    if (dueDate) updates.dueDate = new Date(dueDate);

    const [updatedTask] = await db
      .update(tasks)
      .set(updates)
      .where(eq(tasks.id, id))
      .returning();

    return res.status(200).json({
      success: true,
      message: "Task updated successfully",
      task: updatedTask,
    });
  } catch (error) {
    next(error);
  }
}

export async function deleteTask(req, res, next) {
  try {
    const { id } = req.params;

    const [existingTask] = await db.select().from(tasks).where(eq(tasks.id, id));
    if (!existingTask) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    await db.delete(tasks).where(eq(tasks.id, id));

    return res.status(200).json({
      success: true,
      message: "Task deleted successfully",
    });
  } catch (error) {
    next(error);
  }
}
