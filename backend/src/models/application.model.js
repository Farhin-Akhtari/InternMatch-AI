import mongoose, { Schema } from "mongoose";

const applicationSchema = new Schema({
    student: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    internship: {
        type: Schema.Types.ObjectId,
        ref: "Internship",
        required: true
    },
    status: {
        type: String,
        enum: ["pending", "reviewed", "accepted", "rejected"],
        default: "pending"
    }
}, {timestamps: true})

 applicationSchema.index(
    {
        student: 1,
        internship: 1
    },
    {unique: true}
 );

export const Application = mongoose.model("Application", applicationSchema);