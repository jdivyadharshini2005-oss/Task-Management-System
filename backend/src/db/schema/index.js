import { relations } from "drizzle-orm";
import { users, sessions, accounts } from "./auth-schema.js";
import { tasks } from "./tasks-schema.js";

export * from "./auth-schema.js";
export * from "./tasks-schema.js";

export const usersRelations = relations(users, ({ many }) => ({
  assignedTasks: many(tasks, { relationName: "assignee" }),
  createdTasks: many(tasks, { relationName: "creator" }),
  sessions: many(sessions),
  accounts: many(accounts),
}));

export const tasksRelations = relations(tasks, ({ one }) => ({
  assignee: one(users, {
    fields: [tasks.assignedTo],
    references: [users.id],
    relationName: "assignee",
  }),
  creator: one(users, {
    fields: [tasks.createdBy],
    references: [users.id],
    relationName: "creator",
  }),
}));
