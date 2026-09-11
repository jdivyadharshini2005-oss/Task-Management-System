import { db } from "../db/index.js";
import { users } from "../db/schema/index.js";
import { eq } from "drizzle-orm";
import { comparePassword, createSession, deleteSession } from "../auth/auth.service.js";

export async function login(req, res, next) {
  try {
    const { email, password, role } = req.body;

    const [user] = await db.select().from(users).where(eq(users.email, email.toLowerCase()));

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Verify password
    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Check Role matching
    if (user.role !== role) {
      return res.status(403).json({
        success: false,
        message: `Unauthorized role. This account is registered as '${user.role}', not '${role}'.`,
      });
    }

    // Create Session
    const session = await createSession(user.id, req.ip, req.headers["user-agent"]);

    // Set cookie
    res.cookie("session_token", session.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    const { password: _, ...userWithoutPassword } = user;

    return res.status(200).json({
      success: true,
      message: "Login successful",
      user: userWithoutPassword,
      token: session.token,
    });
  } catch (error) {
    next(error);
  }
}

export async function logout(req, res, next) {
  try {
    const token = req.headers.authorization?.substring(7) || req.cookies?.session_token;
    if (token) {
      await deleteSession(token);
    }
    res.clearCookie("session_token");

    return res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    next(error);
  }
}

export async function getSession(req, res, next) {
  try {
    return res.status(200).json({
      success: true,
      user: req.user,
    });
  } catch (error) {
    next(error);
  }
}
