import { db, client } from "./index.js";
import { sql } from "drizzle-orm";

export async function initTables() {
  console.log("Initializing database tables...");
  try {
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS "user" (
        "id" TEXT PRIMARY KEY,
        "name" TEXT NOT NULL,
        "email" TEXT NOT NULL UNIQUE,
        "email_verified" BOOLEAN DEFAULT FALSE,
        "image" TEXT,
        "role" TEXT NOT NULL DEFAULT 'employee',
        "password" TEXT,
        "created_at" TIMESTAMP DEFAULT NOW() NOT NULL,
        "updated_at" TIMESTAMP DEFAULT NOW() NOT NULL
      );
    `);

    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS "session" (
        "id" TEXT PRIMARY KEY,
        "user_id" TEXT NOT NULL REFERENCES "user"("id") ON DELETE CASCADE,
        "token" TEXT NOT NULL UNIQUE,
        "expires_at" TIMESTAMP NOT NULL,
        "ip_address" TEXT,
        "user_agent" TEXT,
        "created_at" TIMESTAMP DEFAULT NOW() NOT NULL,
        "updated_at" TIMESTAMP DEFAULT NOW() NOT NULL
      );
    `);

    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS "account" (
        "id" TEXT PRIMARY KEY,
        "user_id" TEXT NOT NULL REFERENCES "user"("id") ON DELETE CASCADE,
        "account_id" TEXT NOT NULL,
        "provider_id" TEXT NOT NULL,
        "password" TEXT,
        "created_at" TIMESTAMP DEFAULT NOW() NOT NULL,
        "updated_at" TIMESTAMP DEFAULT NOW() NOT NULL
      );
    `);

    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS "task" (
        "id" TEXT PRIMARY KEY,
        "title" TEXT NOT NULL,
        "description" TEXT NOT NULL,
        "priority" TEXT NOT NULL DEFAULT 'medium',
        "status" TEXT NOT NULL DEFAULT 'not_started',
        "assigned_to" TEXT NOT NULL REFERENCES "user"("id") ON DELETE CASCADE,
        "created_by" TEXT NOT NULL REFERENCES "user"("id") ON DELETE CASCADE,
        "due_date" TIMESTAMP NOT NULL,
        "created_at" TIMESTAMP DEFAULT NOW() NOT NULL,
        "updated_at" TIMESTAMP DEFAULT NOW() NOT NULL
      );
    `);

    console.log("Database tables initialized successfully.");
  } catch (error) {
    console.error("Error initializing database tables:", error);
    throw error;
  }
}

if (process.argv[1]?.endsWith("migrate.js")) {
  initTables().then(async () => {
    if (typeof client.end === "function") await client.end();
    else if (typeof client.close === "function") await client.close();
  });
}
