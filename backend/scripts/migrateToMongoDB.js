require("dotenv").config();
const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
const User = require("../models/User.model");

const migrateUsers = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Connected to MongoDB");

    // Read existing users from JSON file
    const usersFilePath = path.join(__dirname, "../data/users.json");
    const usersData = JSON.parse(fs.readFileSync(usersFilePath, "utf8"));

    console.log(`📄 Found ${usersData.length} users to migrate`);

    // Clear existing users in MongoDB (optional - be careful!)
    const existingCount = await User.countDocuments();
    if (existingCount > 0) {
      console.log(`⚠️  Found ${existingCount} existing users in MongoDB`);
      const readline = require("readline").createInterface({
        input: process.stdin,
        output: process.stdout,
      });

      const answer = await new Promise((resolve) => {
        readline.question(
          "Do you want to delete existing users and proceed? (yes/no): ",
          resolve,
        );
      });
      readline.close();

      if (answer.toLowerCase() === "yes") {
        await User.deleteMany({});
        console.log("🗑️  Cleared existing users");
      } else {
        console.log("❌ Migration cancelled");
        process.exit(0);
      }
    }

    // Migrate each user
    let successCount = 0;
    let errorCount = 0;

    for (const userData of usersData) {
      try {
        // Create new user with existing data
        const user = new User({
          name: userData.name,
          email: userData.email,
          password: userData.password, // Already hashed, will be detected by pre-save hook
          role: userData.role,
          prompts: userData.prompts || {
            staticPrompt: "",
            mainPromptTemplate: "",
          },
          reports: userData.reports || [],
        });

        await user.save();
        successCount++;
        console.log(`✅ Migrated user: ${userData.email}`);
      } catch (error) {
        errorCount++;
        console.error(
          `❌ Error migrating user ${userData.email}:`,
          error.message,
        );
      }
    }

    console.log("\n=== Migration Summary ===");
    console.log(`✅ Successfully migrated: ${successCount}`);
    console.log(`❌ Failed: ${errorCount}`);
    console.log(`📊 Total: ${usersData.length}`);

    // Backup original file
    const backupPath = path.join(__dirname, "../data/users.json.backup");
    fs.copyFileSync(usersFilePath, backupPath);
    console.log(`\n💾 Original file backed up to: ${backupPath}`);

    console.log("\n✨ Migration completed!");
  } catch (error) {
    console.error("❌ Migration failed:", error);
  } finally {
    await mongoose.connection.close();
    console.log("🔌 Disconnected from MongoDB");
    process.exit(0);
  }
};

// Run migration
migrateUsers();
