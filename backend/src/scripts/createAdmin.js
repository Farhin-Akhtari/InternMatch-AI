import dotenv from "dotenv";
import mongoose from "mongoose";
import connectDB from "../config/db.js";
import { User } from "../models/user.model.js";

dotenv.config();

const createAdmin = async () => {
    await connectDB();

    const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminEmail || !adminPassword) {
        throw new Error("ADMIN_EMAIL and ADMIN_PASSWORD must be set in .env");
    }

    const existingUser = await User.findOne({ email: adminEmail });

    if (existingUser) {
        if (existingUser.role !== "admin") {
            throw new Error(
                "This email belongs to an existing student. Admin promotion is not allowed."
            );
        }

        existingUser.adminType = "platform";
        existingUser.emailVerified = true;
        existingUser.accountStatus = "approved";

        await existingUser.save();

        console.log("Platform admin account verified and configured.");
        return;
    }

    const existingPlatformAdmin = await User.findOne({
        role: "admin",
        adminType: "platform",
    });

    if (existingPlatformAdmin) {
        throw new Error("A platform admin account already exists.");
    }

    await User.create({
        fullName: "InternMatch Admin",
        email: adminEmail,
        password: adminPassword,
        role: "admin",
        adminType: "platform",
        emailVerified: true,
        accountStatus: "approved",
    });

    console.log("Platform admin account created successfully.");
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