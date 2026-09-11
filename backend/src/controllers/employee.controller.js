import { db } from "../db/index.js";
import { tasks, users } from "../db/schema/index.js";
import { eq, and, sql, count, desc } from "drizzle-orm";
import { sendTaskStatusUpdatedEmail } from "../services/email.service.js";

export async function getEmployeeDashboardStats(req, res, next) {
  try {
    const employeeId = req.user.id;

    const statsResult = await db
      .select({
        status: tasks.status,
        count: count(tasks.id),
      })
      .from(tasks)
      .where(eq(tasks.assignedTo, employeeId))
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

export async function getEmployeeTasks(req, res, next) {
  try {
    const employeeId = req.user.id;

    const myTasks = await db
      .select({
        id: tasks.id,
        title: tasks.title,
        description: tasks.description,
        priority: tasks.priority,
        status: tasks.status,
        dueDate: tasks.dueDate,
        createdAt: tasks.createdAt,
        updatedAt: tasks.updatedAt,
      })
      .from(tasks)
      .where(eq(tasks.assignedTo, employeeId))
      .orderBy(desc(tasks.createdAt));

    return res.status(200).json({
      success: true,
      tasks: myTasks,
    });
  } catch (error) {
    next(error);
  }
}

export async function updateEmployeeTaskStatus(req, res, next) {
  try {
    const { id } = req.params;
    const { status: newStatus } = req.body;
    const employeeId = req.user.id;
    const employeeName = req.user.name;

    // Check if task exists and belongs to logged in employee
    const [task] = await db.select().from(tasks).where(eq(tasks.id, id));

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    if (task.assignedTo !== employeeId) {
      return res.status(403).json({
        success: false,
        message: "Forbidden - You do not have permission to update this task",
      });
    }

    const oldStatus = task.status;
    const updatedAt = new Date();

    const [updatedTask] = await db
      .update(tasks)
      .set({
        status: newStatus,
        updatedAt,
      })
      .where(eq(tasks.id, id))
      .returning();

    // Trigger Admin Email notification asynchronously
    sendTaskStatusUpdatedEmail({
      adminEmail: process.env.ADMIN_EMAIL,
      employeeName,
      taskTitle: task.title,
      oldStatus,
      newStatus,
      updatedAt,
    }).catch((err) => console.error("Email status notification async error:", err));

    return res.status(200).json({
      success: true,
      message: "Task status updated successfully",
      task: updatedTask,
    });
  } catch (error) {
    next(error);
  }
}
