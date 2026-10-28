import mongoose, {Schema} from 'mongoose';

const internshipSchema = new Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    company: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        required: true,
        trim: true,
    },
    preferredSkills: {
        type: [String],
        default: [],
    },
    requiredSkills: {
        type: [String],
        required: true,
        validate: {
         validator: (skills) => skills.length > 0,
         message: "At least one required skill must be provided.",
        },
    },
    location: {
        type: String,
        required: true, 
        trim: true,
    },
    workMode: {
        type: String,
        enum: ['Remote', 'On-site', 'Hybrid'],
        required: true,
    },
    stipend: {
        min: {
            type: Number,
            min: 0,
            default: null,
        },
        max: {
          type: Number,
          min: 0,
          default: null,
          validate: {
           validator: function (value) {
            const min = this.stipend?.min;

            // If either amount is unknown, skip comparison.
              if (min == null || value == null) {
                return true;
              }

              return min <= value;
            },
             message: "Maximum stipend must be greater than or equal to minimum stipend.",
          },
        },

        currency: {
            type: String,
            default: 'INR',
        },
    },
    applicationUrl: {
        type: String,
        required: true,
        trim: true,
        validate: {
            validator: function (value) {
                try{
                    const url = new URL(value);
                    return (
                        ["http:", "https:"].includes(url.protocol) &&
                        Boolean(url.hostname)
                    );
                }catch{
                    return false;
                }
            },
            message: "Please provide a valid HTTP or HTTPS URL for the application.",
        }
    },
    deadline: {
        type: Date,
        default: null,
    },
    status: {
        type: String,
        enum: ["draft", "active", "closed"],
        default: "active",
    },
}, { timestamps: true });

export const Internship = mongoose.model('Internship', internshipSchema);