import dotenv from "dotenv";
import mongoose from "mongoose";
import connectDB from "../config/db.js";
import { User } from "../models/user.model.js";

dotenv.config();

const createAdmin = async () => {
    await connectDB();
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminEmail || !adminPassword) {
     throw new Error("ADMIN_EMAIL and ADMIN_PASSWORD must be set in .env");
    }

    let admin = await User.findOne({ email: adminEmail });

if (admin) {
    admin.role = "admin";
    await admin.save();

    console.log("Existing user promoted to admin.");
} else {
    admin = await User.create({
        fullName: "InternMatch Admin",
        email: adminEmail,
        password: adminPassword,
        role: "admin",
    });

    console.log("Admin account created successfully.");
}
};

createAdmin()
    .catch((error) => {
        console.error("Failed to create admin:", error);
        process.exitCode = 1;
    })
    .finally(async () => {
    try {
        await mongoose.connection.close();
        console.log("MongoDB connection closed.");
    } catch (error) {
        console.error("Failed to close MongoDB connection:", error);
        process.exitCode = 1;
    }
});