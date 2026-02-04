const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User.model");
const verifySession = require("../middleware/auth.middleware");

const router = express.Router();

// Login Route
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log("Login attempt for:", email);

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required." });
    }

    // Check database connection
    const mongoose = require("mongoose");
    if (mongoose.connection.readyState !== 1) {
      console.error(
        "MongoDB not connected. State:",
        mongoose.connection.readyState,
      );
      return res.status(503).json({ message: "Database connection error." });
    }

    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      console.log("User not found:", email);
      return res.status(404).json({ message: "User not found." });
    }

    console.log("User found, comparing password...");
    const passwordIsValid = await user.comparePassword(password);

    if (!passwordIsValid) {
      console.log("Invalid password for user:", email);
      return res.status(401).json({ message: "Invalid password." });
    }

    console.log("Password valid, creating session...");

    // Set session
    req.session.userId = user._id.toString();
    req.session.userRole = user.role;
    req.session.userEmail = user.email;

    // Explicitly save session before sending response
    req.session.save((err) => {
      if (err) {
        console.error("Session save error:", err);
        console.error(
          "Session save error details:",
          JSON.stringify(err, null, 2),
        );
        return res.status(500).json({
          message: "Failed to create session.",
          error:
            process.env.NODE_ENV === "development" ? err.message : undefined,
        });
      }

      console.log("Login successful for:", email);
      res.status(200).json({
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        message: "Login successful",
      });
    });
  } catch (error) {
    console.error("Login error:", error);
    console.error("Login error stack:", error.stack);
    res.status(500).json({
      message: "Internal server error during login.",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
    });
  }
});

// Logout Route
router.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Could not log out, please try again." });
    }
    res.clearCookie("connect.sid");
    res.status(200).json({ message: "Logout successful" });
  });
});

// Get current user
router.get("/me", verifySession, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Get user error:", error);
    res.status(500).json({ message: "Internal server error." });
  }
});

// Change Password Route
router.post("/change-password", verifySession, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res
        .status(400)
        .json({ message: "Current password and new password are required." });
    }

    if (newPassword.length < 6) {
      return res
        .status(400)
        .json({ message: "New password must be at least 6 characters long." });
    }

    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Verify current password
    const passwordIsValid = await user.comparePassword(currentPassword);

    if (!passwordIsValid) {
      return res
        .status(401)
        .json({ message: "Current password is incorrect." });
    }

    // Update password - the pre-save hook will hash it
    user.password = newPassword;
    await user.save();

    res.status(200).json({ message: "Password changed successfully." });
  } catch (error) {
    console.error("Change password error:", error);
    res
      .status(500)
      .json({ message: "Internal server error while changing password." });
  }
});

module.exports = router;
