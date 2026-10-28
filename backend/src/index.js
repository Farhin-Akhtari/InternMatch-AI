import "dotenv/config";
import { app } from "./app.js";
import connectDB from "./config/db.js";

const requiredEnvVariables = [
    "ACCESS_TOKEN_SECRET",
    "ACCESS_TOKEN_EXPIRY",
    "REFRESH_TOKEN_SECRET",
    "REFRESH_TOKEN_EXPIRY",
];

const missingVariables = requiredEnvVariables.filter(
    (variable) => !process.env[variable]
);

if (missingVariables.length > 0) {
    throw new Error(
        `Missing required environment variables: ${missingVariables.join(", ")}`
    );
}

if (
    process.env.ACCESS_TOKEN_SECRET ===
    process.env.REFRESH_TOKEN_SECRET
) {
    throw new Error(
        "Access and refresh token secrets must be different."
    );
}

const PORT = process.env.PORT || 8000;

const startServer = async () => {
    try {
        await connectDB();

        app.listen(PORT, () => {
            console.log(`⚙️  Server is running at port: ${PORT}`);
        });
    } catch (error) {
        console.error("Failed to start server:", error.message);
        process.exit(1);
    }
};

startServer();