require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const morgan = require("morgan");
const connectDB = require("./config/database");
const authRoutes = require("./routes/auth.routes");
const promptRoutes = require("./routes/prompt.routes");
const categoryPromptRoutes = require("./routes/categoryPrompt.routes");
const reportRoutes = require("./routes/report.routes");

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Morgan logger - only in development
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
} else {
  app.use(morgan("combined"));
}

// CORS configuration - allow multiple origins for local network access and cloud deployment
const allowedOrigins = [
  process.env.FRONTEND_URL,
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  // Add your local network IPs here when needed
  // 'http://192.168.1.100:5173',
].filter(Boolean);

// Split multiple origins from FRONTEND_URL if provided as comma-separated
if (process.env.FRONTEND_URL && process.env.FRONTEND_URL.includes(",")) {
  const extraOrigins = process.env.FRONTEND_URL.split(",").map((url) =>
    url.trim(),
  );
  allowedOrigins.push(...extraOrigins);
}

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps, curl, or Postman)
      if (!origin) return callback(null, true);

      // In development, allow all origins
      if (process.env.NODE_ENV === "development") {
        return callback(null, true);
      }

      // In production, check against allowed origins
      if (allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        console.warn(`CORS blocked origin: ${origin}`);
        console.log(`Allowed origins:`, allowedOrigins);
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  }),
);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Session configuration
app.use(
  session({
    secret: process.env.SESSION_SECRET || "your_session_secret_key",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI,
      touchAfter: 24 * 3600, // lazy session update (in seconds)
    }),
    cookie: {
      secure:
        process.env.NODE_ENV === "production" &&
        process.env.COOKIE_SECURE !== "false", // requires HTTPS in production
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", // 'none' for cross-origin in production with HTTPS
    },
  }),
);

// Debug middleware - log session info in development
if (process.env.NODE_ENV === "development") {
  app.use((req, res, next) => {
    console.log("Session ID:", req.sessionID);
    // console.log("Session Data:", req.session);
    next();
  });
}

// Routes
app.use("/api", authRoutes);
app.use("/api/prompts", promptRoutes);
app.use("/api/category-prompts", categoryPromptRoutes);
app.use("/api/reports", reportRoutes);

app.get("/", (req, res) => {
  res.json({ message: "Welcome to PCB Automotions API." });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: "Something went wrong!",
    error: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
});
