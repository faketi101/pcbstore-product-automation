const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    console.log("Attempting to connect to MongoDB...");
    console.log(
      "Connection URI (masked):",
      process.env.MONGODB_URI?.replace(/\/\/([^:]+):([^@]+)@/, "//***:***@"),
    );

    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 10000, // Timeout after 10s instead of default 30s
      socketTimeoutMS: 45000,
      family: 4, // Use IPv4, skip trying IPv6
    });

    console.log(`✓ MongoDB Connected: ${conn.connection.host}`);
    console.log(`✓ Database Name: ${conn.connection.name}`);

    // Handle connection events
    mongoose.connection.on("error", (err) => {
      console.error("❌ MongoDB connection error:", err);
    });

    mongoose.connection.on("disconnected", () => {
      console.warn("⚠️  MongoDB disconnected");
    });

    mongoose.connection.on("reconnected", () => {
      console.log("✓ MongoDB reconnected");
    });

    // Graceful shutdown
    process.on("SIGINT", async () => {
      await mongoose.connection.close();
      console.log("MongoDB connection closed through app termination");
      process.exit(0);
    });
  } catch (error) {
    console.error("❌ Error connecting to MongoDB:");
    console.error("Error name:", error.name);
    console.error("Error message:", error.message);

    if (error.name === "MongooseServerSelectionError") {
      console.error("\n⚠️  Common causes:");
      console.error(
        "1. MongoDB Atlas IP whitelist doesn't include this server's IP",
      );
      console.error("2. Network/firewall blocking MongoDB port (27017)");
      console.error("3. Incorrect connection string or credentials");
      console.error("4. MongoDB cluster is paused or deleted");
      console.error("\n💡 To fix:");
      console.error(
        "- Add 0.0.0.0/0 to IP whitelist (MongoDB Atlas → Network Access)",
      );
      console.error("- Verify MONGODB_URI credentials are correct");
      console.error("- Check if cluster is active in MongoDB Atlas");
    }

    // Don't exit in production - allow server to start and retry
    if (process.env.NODE_ENV === "production") {
      console.warn(
        "⚠️  Server starting without MongoDB connection (will retry)",
      );
    } else {
      process.exit(1);
    }
  }
};

module.exports = connectDB;
