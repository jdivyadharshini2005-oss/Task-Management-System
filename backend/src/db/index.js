import { drizzle as drizzlePg } from "drizzle-orm/postgres-js";
import { drizzle as drizzlePglite } from "drizzle-orm/pglite";
import postgres from "postgres";
import { PGlite } from "@electric-sql/pglite";
import * as schema from "./schema/index.js";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";

dotenv.config();

const connectionString = process.env.DATABASE_URL;

let db;
let client;

if (connectionString && !connectionString.includes("localhost") && !connectionString.includes("127.0.0.1")) {
  console.log("Connecting to remote PostgreSQL database...");
  client = postgres(connectionString, { prepare: false });
  db = drizzlePg(client, { schema });
} else {
  const dataDir = path.join(process.cwd(), "data");
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  const pglitePath = path.join(dataDir, "pglite");
  console.log(`Using PGlite embedded database at ${pglitePath}...`);
  client = new PGlite(pglitePath);
  db = drizzlePglite(client, { schema });
}

export { db, client };

