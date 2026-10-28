import crypto from "node:crypto";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import { Session } from "../models/session.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

// Hash a refresh token before storing it in the database.
const hashRefreshToken = (token) => {
    return crypto
        .createHash("sha256")
        .update(token)
        .digest("hex");
};

// Cookie configuration.
const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
};

// Create a session and generate tokens for a user.
const createUserSession = async (user, req, dbSession) => {
    const sessionId = crypto.randomUUID();

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken(sessionId);

    // Keep this duration synchronized with REFRESH_TOKEN_EXPIRY.
    const expiresAt = new Date(
        Date.now() + 7 * 24 * 60 * 60 * 1000
    );

    const sessionRecord = new Session({
        user: user._id,
        sessionId,
        refreshTokenHash: hashRefreshToken(refreshToken),
        expiresAt,
        userAgent: req.get("user-agent") || null,
        ipAddress: req.ip || null,
    });

    await sessionRecord.save({ session: dbSession });

    return { accessToken, refreshToken };
};

// Register a new user.
const registerUser = asyncHandler(async (req, res) => {
    const { fullName, email, password } = req.body ?? {};

    // Validate input types.
    if (
        typeof fullName !== "string" ||
        typeof email !== "string" ||
        typeof password !== "string"
    ) {
        throw new ApiError(
            400,
            "Full name, email, and password are required."
        );
    }

    const normalizedFullName = fullName.trim();
    const normalizedEmail = email.trim().toLowerCase();

    if (
        !normalizedFullName ||
        !normalizedEmail ||
        !password.trim()
    ) {
        throw new ApiError(
            400,
            "Full name, email, and password are required."
        );
    }

    // Validate full name.
    if (normalizedFullName.length > 100) {
        throw new ApiError(
            400,
            "Full name must be 100 characters or fewer."
        );
    }

    // Validate email.
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (
        normalizedEmail.length > 254 ||
        !emailRegex.test(normalizedEmail)
    ) {
        throw new ApiError(
            400,
            "Please provide a valid email address."
        );
    }

    // Validate password.
    if (password.length < 8) {
        throw new ApiError(
            400,
            "Password must be at least 8 characters long."
        );
    }

    if (password.length > 128) {
        throw new ApiError(
            400,
            "Password must be 128 characters or fewer."
        );
    }

    // Check whether the email already exists.
    const existingUser = await User.findOne({
        email: normalizedEmail,
    });

    if (existingUser) {
        throw new ApiError(
            409,
            "An account with this email already exists."
        );
    }

    let createdUser;
    let accessToken;
    let refreshToken;

    const dbSession = await mongoose.startSession();

    try {
        await dbSession.withTransaction(async () => {
            // Create the user inside the transaction.
            const [user] = await User.create(
                [
                    {
                        fullName: normalizedFullName,
                        email: normalizedEmail,
                        password,
                    },
                ],
                { session: dbSession }
            );

            // Create the user's session in the same transaction.
            const tokens = await createUserSession(
                user,
                req,
                dbSession
            );

            accessToken = tokens.accessToken;
            refreshToken = tokens.refreshToken;

            // Retrieve only the safe user fields.
            createdUser = await User.findById(user._id)
                .select("-password")
                .session(dbSession)
                .lean();
        });
    } finally {
        await dbSession.endSession();
    }

    if (!createdUser || !accessToken || !refreshToken) {
        throw new ApiError(
            500,
            "Something went wrong while registering the user."
        );
    }

    // Send the refresh token as an HTTP-only cookie.
    res.cookie("refreshToken", refreshToken, cookieOptions);

    // Return the access token and safe user details.
    return res.status(201).json(
        new ApiResponse(
            201,
            {
                user: createdUser,
                accessToken,
            },
            "User registered successfully."
        )
    );
});

// Login new user
const loginUser = asyncHandler(async (req, res) => {
  const {email, password} = req.body ?? {};

  // Validate input.
    if (
        typeof email !== "string" ||
        typeof password !== "string" ||
        !email.trim() ||
        !password
    ) {
        throw new ApiError(400, "Email and password are required.");
      }


    const normalizedEmail = email.trim().toLowerCase();

    // Validate email format.
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (
        normalizedEmail.length > 254 ||
        !emailRegex.test(normalizedEmail) ||
        password.length > 128
    ) {
        throw new ApiError(400, "Invalid email or password.");
    }

     // Explicitly retrieve the password hash.
    const user = await User.findOne({
        email: normalizedEmail,
    }).select("+password");

    // Use the same message for unknown email and wrong password.
    if (!user || !(await user.isPasswordCorrect(password))) {
        throw new ApiError(
            401,
            "Invalid email or password."
        );
    }

    let accessToken;
    let refreshToken;

    const dbSession = await mongoose.startSession();

    try {
        await dbSession.withTransaction(async () => {
            const tokens = await createUserSession(
                user,
                req,
                dbSession
            );

            accessToken = tokens.accessToken;
            refreshToken = tokens.refreshToken;
        });
    } finally {
        await dbSession.endSession();
    }

    if (!accessToken || !refreshToken) {
        throw new ApiError(
            500,
            "Something went wrong while logging in."
        );
    }

    // Set the refresh token as an HTTP-only cookie.
    res.cookie("refreshToken", refreshToken, {
        ...cookieOptions,
        maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // Exclude the password hash from the response.
    const safeUser = user.toObject();
    delete safeUser.password;

    return res.status(200).json(
        new ApiResponse(
            200,
            {
                user: safeUser,
                accessToken,
            },
            "User logged in successfully."
        )
    );
});

// Refresh access and refresh tokens.
const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken = req.cookies?.refreshToken;

    if (!incomingRefreshToken) {
        throw new ApiError(401, "Refresh token is required.");
    }

    // 1. Verify the refresh token.
    let decodedToken;

    try {
        decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        );
    } catch (error) {
        if (
            error.name === "TokenExpiredError" ||
            error.name === "JsonWebTokenError" ||
            error.name === "NotBeforeError"
        ) {
            throw new ApiError(401, "Invalid or expired refresh token.");
        }

        throw error;
    }

    if (
        typeof decodedToken._id !== "string" ||
        typeof decodedToken.sid !== "string"
    ) {
        throw new ApiError(401, "Invalid refresh token.");
    }

    // 2. Find the active session.
    const sessionRecord = await Session.findOne({
        sessionId: decodedToken.sid,
        user: decodedToken._id,
        revokedAt: null,
        expiresAt: { $gt: new Date() },
    }).select("+refreshTokenHash");

    if (!sessionRecord) {
        throw new ApiError(401, "Session is invalid or expired.");
    }

    // 3. Compare the incoming token hash with the stored hash.
    const incomingTokenHash = hashRefreshToken(incomingRefreshToken);
    const storedHash = Buffer.from(sessionRecord.refreshTokenHash, "hex");
    const incomingHash = Buffer.from(incomingTokenHash, "hex");

    if (
        storedHash.length !== incomingHash.length ||
        !crypto.timingSafeEqual(storedHash, incomingHash)
    ) {
        throw new ApiError(401, "Invalid refresh token.");
    }

    // 4. Load the user.
    const user = await User.findById(decodedToken._id);

    if (!user) {
        throw new ApiError(401, "User no longer exists.");
    }

    // 5. Generate a new pair of tokens.
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken(decodedToken.sid);
    const newRefreshTokenHash = hashRefreshToken(refreshToken);

    // 6. Atomically replace the old refresh-token hash.
    // This also prevents two simultaneous requests from both succeeding.
    const updatedSession = await Session.findOneAndUpdate(
        {
            _id: sessionRecord._id,
            refreshTokenHash: incomingTokenHash,
            revokedAt: null,
            expiresAt: { $gt: new Date() },
        },
        {
            $set: {
                refreshTokenHash: newRefreshTokenHash,
            },
        },
        {
            new: true,
        }
    );

    if (!updatedSession) {
        throw new ApiError(
            401,
            "Refresh token has already been used or the session is invalid."
        );
    }

    // 7. Send the rotated refresh token in the HTTP-only cookie.
    res.cookie("refreshToken", refreshToken, {
        ...cookieOptions,
        maxAge: Math.max(
            0,
            updatedSession.expiresAt.getTime() - Date.now()
        ),
    });

    // 8. Return the new access token.
    return res.status(200).json(
        new ApiResponse(
            200,
            { accessToken },
            "Access token refreshed successfully."
        )
    );
});

// logout user
const logoutUser = asyncHandler(async (req, res) => {
    const incomingRefreshToken = req.cookies?.refreshToken;

    // Clear the cookie even if it is missing or invalid.
    if (!incomingRefreshToken) {
        res.clearCookie("refreshToken", cookieOptions);

        return res.status(200).json(
            new ApiResponse(200, {}, "Logged out successfully.")
        );
    }

    let decodedToken;

    try {
        decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        );
    } catch (error) {
        if (
            error.name === "TokenExpiredError" ||
            error.name === "JsonWebTokenError" ||
            error.name === "NotBeforeError"
        ) {
            res.clearCookie("refreshToken", cookieOptions);

            return res.status(200).json(
                new ApiResponse(200, {}, "Logged out successfully.")
            );
        }

        throw error;
    }

    if (
        typeof decodedToken._id === "string" &&
        typeof decodedToken.sid === "string"
    ) {
        await Session.findOneAndUpdate(
            {
                sessionId: decodedToken.sid,
                user: decodedToken._id,
                revokedAt: null,
            },
            {
                $set: { revokedAt: new Date() },
            }
        );
    }

    res.clearCookie("refreshToken", cookieOptions);

    return res.status(200).json(
        new ApiResponse(200, {}, "Logged out successfully.")
    );
});

// get current user
const getCurrentUser = asyncHandler(async (req, res) => {
    return res
    .status(200)
    .json(new ApiResponse(200, {user: req.user}, "CURRENT USER FETCHED SUCCESSFULLY."))
});

//update user profile
const updateUserProfile = asyncHandler(async (req, res) => {
    const {fullName, skills, preferredLocations, preferredWorkModes} = req.body?? {}

    const updates = {};

    if(fullName !== undefined){
        if(typeof fullName !== "string" || !fullName.trim()){
            throw new ApiError(400, "FullName must be a non-empty string.");
        }
          // Validate full name.
        if (fullName.trim().length > 100) {
        throw new ApiError(400, "Full name must be 100 characters or fewer.");
    }

        updates.fullName = fullName.trim();

    }

    if(skills !== undefined){
        if( !Array.isArray(skills) ||
        skills.length > 50 ||
        !skills.every(
            (skill) =>
                typeof skill === "string" &&
                skill.trim().length > 0 &&
                skill.trim().length <= 50
        )){
            throw new ApiError(400, "Skills must contain up to 50 non-empty strings, each at most 50 characters.");
        }

        updates.skills = [
       ...new Set(skills.map((skill) => skill.trim()))
      ];
    }

    if (preferredLocations !== undefined) {
    if (
        !Array.isArray(preferredLocations) ||
        preferredLocations.length > 20 ||
        !preferredLocations.every(
            (location) =>
                typeof location === "string" &&
                location.trim().length > 0 &&
                location.trim().length <= 100
        )
    ) {
        throw new ApiError(
            400,
            "Preferred locations must contain up to 20 non-empty strings, each at most 100 characters."
        );
    }
     updates.preferredLocations = [
        ...new Set(preferredLocations.map((location) => location.trim()))
    ];
 }

   if (preferredWorkModes !== undefined) {
    const allowedModes = ["Remote", "On-site", "Hybrid"];

    if (
        !Array.isArray(preferredWorkModes) ||
        preferredWorkModes.length > 3 ||
        !preferredWorkModes.every((mode) => allowedModes.includes(mode)) ||
        new Set(preferredWorkModes).size !== preferredWorkModes.length
    ) {
        throw new ApiError(
            400,
         "Preferred work modes must contain unique values from Remote, On-site, and Hybrid."
        );
    }

    updates.preferredWorkModes = preferredWorkModes;
  }

    if(Object.keys(updates).length === 0){
         throw new ApiError(400, "Please provide at least one valid profile field to update.");
    }

    const updateUser = await User.findByIdAndUpdate(req.user._id, {
        $set: updates
    },
    {
        new: true,
        runValidators: true,
    }
    ).select("-password");

    if(!updateUser){
        throw new ApiError(404, "User not found");
    }

    return res
    .status(200)
    .json(new ApiResponse(200, { user: updateUser }, "User profile updated successfully."))

})

export { registerUser, createUserSession, loginUser, refreshAccessToken, logoutUser, getCurrentUser, updateUserProfile };
