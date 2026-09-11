import { validateSession } from "../auth/auth.service.js";

export async function requireAuth(req, res, next) {
  try {
    let token = null;

    // Check Authorization header (Bearer <token>)
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.substring(7);
    } else if (req.cookies && req.cookies.session_token) {
      token = req.cookies.session_token;
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized - No session token provided",
      });
    }

    const authResult = await validateSession(token);
    if (!authResult) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized - Invalid or expired session",
      });
    }

    req.user = authResult.user;
    req.session = authResult.session;
    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    return res.status(401).json({
      success: false,
      message: "Unauthorized - Session validation failed",
    });
  }
}

export function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized - User not authenticated",
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Forbidden - Required role: ${roles.join(" or ")}, your role: ${req.user.role}`,
      });
    }

    next();
  };
}
