const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("./models/User");
require("dotenv").config();

const createTestUser = async () => {
    try {
        // Connect to database
        await mongoose.connect(process.env.MONGO_URL);
        console.log("Connected to database");

        // Check if test user already exists
        const existingUser = await User.findOne({ email: "test@example.com" });
        if (existingUser) {
            console.log("Test user already exists!");
            console.log("Login with:");
            console.log("Email: test@example.com");
            console.log("Password: testpass123");
            process.exit(0);
        }

        // Create test user
        const hashedPassword = await bcrypt.hash("testpass123", 10);
        
        const testUser = await User.create({
            name: "Test User",
            username: "testuser",
            email: "test@example.com",
            password: hashedPassword
        });

        console.log("Test user created successfully!");
        console.log("Login with:");
        console.log("Email: test@example.com");
        console.log("Password: testpass123");
        
        process.exit(0);
    } catch (error) {
        console.error("Error creating test user:", error);
        process.exit(1);
    }
};

createTestUser();
