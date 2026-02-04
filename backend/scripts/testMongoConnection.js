#!/usr/bin/env node
/**
 * MongoDB Connection Test Script
 *
 * This script tests the MongoDB connection independently from the main app.
 * Useful for diagnosing connection issues on production servers.
 *
 * Usage:
 *   node scripts/testMongoConnection.js
 *
 * Or with custom URI:
 *   MONGODB_URI="your-connection-string" node scripts/testMongoConnection.js
 */

require("dotenv").config();
const mongoose = require("mongoose");

const testConnection = async () => {
  console.log("\n=== MongoDB Connection Test ===\n");

  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.error("❌ Error: MONGODB_URI not found in environment variables");
    console.log(
      "\nPlease set MONGODB_URI in your .env file or pass it as an environment variable:",
    );
    console.log(
      '  MONGODB_URI="mongodb+srv://..." node scripts/testMongoConnection.js\n',
    );
    process.exit(1);
  }

  // Mask credentials in output
  const maskedUri = uri.replace(/\/\/([^:]+):([^@]+)@/, "//***:***@");
  console.log("Connection URI (masked):", maskedUri);
  console.log("\nAttempting to connect...\n");

  try {
    const startTime = Date.now();

    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      family: 4, // Force IPv4
    });

    const duration = Date.now() - startTime;

    console.log("✅ SUCCESS! MongoDB connection established");
    console.log(`   Time taken: ${duration}ms`);
    console.log(`   Host: ${conn.connection.host}`);
    console.log(`   Database: ${conn.connection.name}`);
    console.log(`   Port: ${conn.connection.port}`);

    // Test a simple operation
    console.log("\n📝 Testing database operation...");
    const collections = await mongoose.connection.db
      .listCollections()
      .toArray();
    console.log(
      `✅ Database accessible - Found ${collections.length} collection(s):`,
    );
    collections.forEach((col) => {
      console.log(`   - ${col.name}`);
    });

    await mongoose.connection.close();
    console.log("\n✅ Connection closed successfully\n");
    process.exit(0);
  } catch (error) {
    console.error("\n❌ CONNECTION FAILED\n");
    console.error("Error Type:", error.name);
    console.error("Error Message:", error.message);

    if (error.name === "MongooseServerSelectionError") {
      console.error("\n🔍 Troubleshooting Steps:\n");
      console.error("1. Check MongoDB Atlas Network Access:");
      console.error("   - Go to: https://cloud.mongodb.com/");
      console.error("   - Navigate to: Network Access");
      console.error(
        "   - Add IP: 0.0.0.0/0 (allow all) OR your server's specific IP",
      );
      console.error("   - Wait 2-5 minutes for changes to propagate");

      console.error("\n2. Verify Connection String:");
      console.error("   - Username and password are correct");
      console.error("   - Database name is specified");
      console.error("   - Cluster URL is correct");
      console.error(
        "   - Format: mongodb+srv://username:password@cluster.mongodb.net/database",
      );

      console.error("\n3. Check MongoDB Cluster Status:");
      console.error("   - Ensure cluster is not paused");
      console.error("   - Verify cluster is in active state");

      console.error("\n4. Network/Firewall Issues:");
      console.error("   - Port 27017 might be blocked");
      console.error("   - Try from a different network to isolate the issue");

      console.error("\n5. Get Your Server's Public IP:");
      console.error("   Run: curl ifconfig.me");
      console.error("   Then add this IP to MongoDB Atlas whitelist");
    }

    console.error("\n");
    process.exit(1);
  }
};

// Handle unhandled promise rejections
process.on("unhandledRejection", (error) => {
  console.error("\n❌ Unhandled Error:", error.message);
  process.exit(1);
});

testConnection();
