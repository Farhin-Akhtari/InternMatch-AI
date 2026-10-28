import mongoose, { Schema } from 'mongoose';

const savedInternshipSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    internship: {
        type: Schema.Types.ObjectId,
        ref: "Internship",
        required: true
    }
}, {timestamps: true});

 savedInternshipSchema.index(
    {
        user: 1,
        internship: 1
    },
    {unique: true}
 );

export const SavedInternship = mongoose.model("SavedInternship", savedInternshipSchema);
