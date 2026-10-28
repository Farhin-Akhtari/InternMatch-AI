import mongoose, {Schema} from "mongoose";
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

const userSchema = new Schema({
    fullName: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        "Please provide a valid email address",
      ],
    },

    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must be at least 8 characters long"],
      select: false,
    },
    skills: {
        type: [String],
        default: [],
    },
    preferredLocations: {
        type: [String],
        default: [],
    },
    preferredWorkModes: {
        type: [{
           type: String,
           enum: ['Remote', 'On-site', 'Hybrid'],
        }],
        default: [],
    },
    role: {
        type: String,
        enum: ["student", "admin"],
        default: "student",
    },
},{timestamps: true})

// PASSWORD HASHING MIDDLEWARE
userSchema.pre("save", async function(){
    if (!this.isModified("password") || !this.password) return;
    
        this.password = await bcrypt.hash(this.password, 10);
});
// PASSWORD COMPARISON METHOD
userSchema.methods.isPasswordCorrect = async function(password){
   return await bcrypt.compare(password, this.password)
}

// Generate Access Token
userSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            fullName: this.fullName,
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
        }
    );
};

// Generate Refresh Token
userSchema.methods.generateRefreshToken = function (sessionId) {
    return jwt.sign(
        {
            _id: this._id,
            sid: sessionId,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
        }
    );
};

export const User = mongoose.model("User", userSchema);