import { pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { users } from "./auth-schema.js";

export const tasks = pgTable("task", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  priority: text("priority").notNull().default("medium"), // 'high' | 'medium' | 'low'
  status: text("status").notNull().default("not_started"), // 'not_started' | 'in_progress' | 'completed'
  assignedTo: text("assigned_to").notNull().references(() => users.id, { onDelete: "cascade" }),
  createdBy: text("created_by").notNull().references(() => users.id, { onDelete: "cascade" }),
  dueDate: timestamp("due_date").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
