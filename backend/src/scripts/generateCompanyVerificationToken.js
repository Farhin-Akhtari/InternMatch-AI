import "dotenv/config";
import crypto from "crypto";
import mongoose from "mongoose";

import connectDB from "../config/db.js";
import { User } from "../models/user.model.js";
import { EmailVerificationToken } from "../models/emailVerificationToken.model.js";

const generateTestToken = async () => {
    try {
        await connectDB();

        const email = process.argv[2]?.trim().toLowerCase();

        if (!email) {
            throw new Error("Please provide the company admin email.");
        }

        const user = await User.findOne({
            email,
            role: "admin",
            adminType: "company",
            emailVerified: false,
            accountStatus: "pending",
        });

        if (!user) {
            throw new Error("No eligible unverified company admin found.");
        }

        const rawToken = crypto.randomBytes(32).toString("hex");

        const tokenHash = crypto
            .createHash("sha256")
            .update(rawToken)
            .digest("hex");

        const expiresAt = new Date(Date.now() + 30 * 60 * 1000);

        await EmailVerificationToken.findOneAndUpdate(
            { user: user._id },
            { tokenHash, expiresAt },
            { upsert: true, new: true, runValidators: true }
        );

        console.log("\nTest verification token generated!");
        console.log("Company admin:", user.email);
        console.log("Raw token:", rawToken);
        console.log("Expires at:", expiresAt);
    } catch (error) {
        console.error("Token generation failed:", error.message);
    } finally {
        await mongoose.disconnect();
    }
};

generateTestToken();