import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { errorHandler } from './middleware/errorHandler.js';

import userRouter from "./routes/user.route.js"
import internshipRouter from "./routes/internship.route.js"
import savedInternshipRouter from "./routes/savedInternship.route.js"
import applicationRouter from "./routes/application.route.js"

const app = express();

app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  credentials: true,
}));
app.use(express.json({limit: "16kb"}));
app.use(express.urlencoded({extended: true, limit: "16kb"}));
app.use(cookieParser());

app.use("/api/v1/users", userRouter);
app.use("/api/v1/internships", internshipRouter);
app.use("/api/v1/saved-internships", savedInternshipRouter);
app.use("/api/v1/applications", applicationRouter);

app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: `Route not found: ${req.method} ${req.originalUrl}`,
    });
});

app.use(errorHandler);

export { app };