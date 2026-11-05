import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const verifyJWT = asyncHandler(async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith("Bearer ")) {
        throw new ApiError(401, "Unauthorized request.");
    }

    const accessToken = authHeader.slice(7).trim();

    if (!accessToken) {
        throw new ApiError(401, "Access token is required.");
    }

    let decodedToken;

    try {
        decodedToken = jwt.verify(
            accessToken,
            process.env.ACCESS_TOKEN_SECRET
        );
    } catch (error) {
        if (
            error.name === "TokenExpiredError" ||
            error.name === "JsonWebTokenError" ||
            error.name === "NotBeforeError"
        ) {
            throw new ApiError(401, "Invalid or expired access token.");
        }

        throw error;
    }

    const user = await User.findById(decodedToken._id);

    if (!user) {
        throw new ApiError(401, "Invalid access token.");
    }

    // Verify current admin account permissions.
    if (user.role === "admin") {
     const isValidAdmin =
        ["platform", "company"].includes(user.adminType) &&
        user.emailVerified === true &&
        user.accountStatus === "approved";

     if (!isValidAdmin) {
        throw new ApiError(
            403,
            "Your admin account is no longer authorized to access the platform."
        );
     }
    }

    req.user = user;
    next();
});
