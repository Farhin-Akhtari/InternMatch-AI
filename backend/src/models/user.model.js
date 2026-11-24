import mongoose, {Schema} from "mongoose";
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"


const educationSchema = new Schema({
    institution: {
        type: String,
        required: true,
        trim: true,
    },
    degree: {
        type: String,
        required: true,
        trim: true,
    },
    fieldOfStudy: {
        type: String,
        trim: true,
        default: "",
    },
    startYear: {
        type: Number,
        required: true,
    },
    endYear: {
        type: Number,
        default: null,
    },
    currentlyStudying: {
        type: Boolean,
        default: false,
    },
});

const projectSchema = new Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        trim: true,
        maxlength: [1000, "Project description must be 1000 characters or fewer."],
        default: "",
    },
    technologies: {
        type: [String],
        default: [],
    },
    githubUrl: {
        type: String,
        trim: true,
        default: "",
    },
    liveDemoUrl: {
        type: String,
        trim: true,
        default: "",
    },
});

const resumeSchema = new Schema({
        publicId: {
           type: String,
           required: true,
        },
        format: {
            type: String,
            default: "pdf",
        },
        fileName: {
            type: String,
            required: true,
            trim: true,
        },
        bytes: {
            type: Number,
            required: true,
        },
        uploadedAt: {
            type: Date,
            default: Date.now,
        },
});


const userSchema = new Schema({
    fullName: {
        type: String,
        required: true,
        trim: true,
    },
    bio: {
        type: String,
        trim: true,
        maxLength: [500, "Bio must be 500 characters or fewer."],
        default: "",
    },
    education: {
        type: [educationSchema],
        default: [],
    },

    projects: {
        type: [projectSchema],
        default: [],
    },

    professionalLinks: {
        linkedin: {
          type: String,
          trim: true,
          default: "",
        },
        github: {
          type: String,
          trim: true,
          default: "",
        },
        portfolio: {
          type: String,
          trim: true,
          default: "",
        },
    },
    resume: {
        type: resumeSchema,
        default: null,
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
    adminType: {
        type: String,
        enum: ["platform", "company"],
        default: null,
    },
    companyName: {
        type: String,
        trim: true,
        maxlength: [150, "Company name must be 150 characters or fewer."],
        default: null,
    },
    companyWebsite: {
    type: String,
    trim: true,
    default: null,
    },
    emailVerified: {
        type: Boolean,
        default: false,
    },

    accountStatus: {
        type: String,
        enum: ["pending", "approved", "rejected"],
        default: "approved",
    }
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