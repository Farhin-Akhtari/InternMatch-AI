import mongoose, { Schema } from "mongoose";

const sessionSchema = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },

        sessionId:{
            type: String,
            required: true,
            unique: true,
            immutable: true,
        },

        refreshTokenHash: {
            type: String,
            required: true,
            trim: true,
            select: false,
            minlength: [1, "Refresh token hash is required"],
        },

        expiresAt: {
            type: Date,
            required: true,
            validate: {
             validator: (value) => value instanceof Date && !Number.isNaN(value.getTime()),
             message: "A valid session expiry date is required.",
            },
        },

        revokedAt: {
            type: Date,
            default: null,
            validate: {
             validator: (value) => value === null || (
             value instanceof Date && !Number.isNaN(value.getTime())),
             message: "Revocation date must be a valid date or null.",
            },
        },

        userAgent: {
            type: String,
            default: null,
        },

        ipAddress: {
            type: String,
            default: null,
        },
    },
    { timestamps: true }
);

// Automatically remove expired sessions from MongoDB.
sessionSchema.index(
    { expiresAt: 1 },
    { expireAfterSeconds: 0 }
);

export const Session = mongoose.model("Session", sessionSchema);
