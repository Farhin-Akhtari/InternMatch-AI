import mongoose, {Schema} from "mongoose";

const emailVerificationTokenSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        unique: true,
    },
    tokenHash: {
        type: String,
        required: true,
    },
    expiresAt: {
        type: Date,
        required: true,
    },
}, {timestamps: true});

emailVerificationTokenSchema.index(
    { expiresAt: 1 }, 
    { expireAfterSeconds: 0 }
);

export const EmailVerificationToken = mongoose.model("EmailVerificationToken", emailVerificationTokenSchema);