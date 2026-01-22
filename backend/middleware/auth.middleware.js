const verifySession = (req, res, next) => {
  if (!req.session || !req.session.userId) {
    return res
      .status(401)
      .json({ message: "Not authenticated. Please log in." });
  }

  // Attach user info to request
  req.userId = req.session.userId;
  req.userRole = req.session.userRole;
  req.userEmail = req.session.userEmail;

  next();
};

module.exports = verifySession;
