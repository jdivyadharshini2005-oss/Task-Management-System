import bcrypt from "bcryptjs";
import crypto from "crypto";
import { db } from "../db/index.js";
import { users, sessions } from "../db/schema/index.js";
import { eq, and, gt } from "drizzle-orm";

export async function hashPassword(password) {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

export async function comparePassword(password, hashedPassword) {
  return bcrypt.compare(password, hashedPassword);
}

export async function createSession(userId, ipAddress = null, userAgent = null) {
  const token = crypto.randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

  const sessionId = crypto.randomUUID();

  const [session] = await db
    .insert(sessions)
    .values({
      id: sessionId,
      userId,
      token,
      expiresAt,
      ipAddress,
      userAgent,
    })
    .returning();

  return session;
}

export async function validateSession(token) {
  if (!token) return null;

  const now = new Date();

  const results = await db
    .select({
      user: users,
      session: sessions,
    })
    .from(sessions)
    .innerJoin(users, eq(sessions.userId, users.id))
    .where(and(eq(sessions.token, token), gt(sessions.expiresAt, now)));

  if (results.length === 0) {
    return null;
  }

  const { user, session } = results[0];
  // Remove password before returning
  const { password, ...userWithoutPassword } = user;

  return { user: userWithoutPassword, session };
}

export async function deleteSession(token) {
  if (!token) return;
  await db.delete(sessions).where(eq(sessions.token, token));
}
