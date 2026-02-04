const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  // Get token from Authorization header
  const authHeader = req.headers.authorization;
  const token =
    authHeader && authHeader.startsWith("Bearer ")
      ? authHeader.substring(7)
      : null;

  if (!token) {
    if (process.env.NODE_ENV === "production") {
      console.warn("Auth failed - no token:", {
        path: req.path,
        method: req.method,
        hasAuthHeader: !!authHeader,
        origin: req.headers.origin,
      });
    }
    return res
      .status(401)
      .json({ message: "Not authenticated. Please log in." });
  }

  try {
    // Verify token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "fallback_secret_change_in_production",
    );

    // Attach user info to request
    req.userId = decoded.userId;
    req.userRole = decoded.userRole;
    req.userEmail = decoded.userEmail;

    next();
  } catch (error) {
    if (process.env.NODE_ENV === "production") {
      console.warn("Auth failed - invalid token:", {
        path: req.path,
        error: error.message,
      });
    }
    return res
      .status(401)
      .json({ message: "Invalid or expired token. Please log in again." });
  }
};

module.exports = verifyToken;
