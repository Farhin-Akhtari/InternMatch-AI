import mongoose, { isValidObjectId } from "mongoose";
import cloudinary from "../config/cloudinary.js";
import { Application } from '../models/application.model.js';
import { Internship } from "../models/internship.model.js"
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadBufferToCloudinary, deleteOnCloudinary } from "../utils/cloudinary.js";

//upload student resume
const uploadStudentResume = asyncHandler(async (req, res) => {
    if (!req.file) {
        throw new ApiError(400, "Please upload a resume.");
    }

    // Keep the current resume details in case this is a replacement
    const oldResume = req.user.resume;

    // Upload the new PDF to Cloudinary
    const uploadedResume = await uploadBufferToCloudinary(req.file.buffer, {
        resource_type: "raw",
        type: "authenticated",
        asset_folder: "InternMatch AI/resumes",
        public_id: `student_${req.user._id}_${Date.now()}.pdf`,
        overwrite: false,
    });

    // Prepare the metadata that will be stored in MongoDB
    const resumeData = {
        publicId: uploadedResume.public_id,
        format: uploadedResume.format || "pdf",
        fileName: req.file.originalname,
        bytes: uploadedResume.bytes,
        uploadedAt: new Date(),
    };

    let updatedUser;

    try {
        updatedUser = await User.findByIdAndUpdate(
            req.user._id,
            {
                $set: {
                    resume: resumeData,
                },
            },
            {
                new: true,
                runValidators: true,
            }
        ).select("-password");

        if (!updatedUser) {
            throw new ApiError(404, "Student account not found.");
        }
    } catch (error) {
        // If MongoDB update fails, clean up the newly uploaded file
        try {
            await deleteOnCloudinary(
                uploadedResume.public_id,
                "raw",
                "authenticated"
            );
        } catch (cleanupError) {
            console.error("Failed to clean up new resume:", cleanupError);
        }

        throw error;
    }

    // Delete the previous resume only after MongoDB is updated
    if (oldResume?.publicId) {
        try {
            const deletionResult = await deleteOnCloudinary(
                oldResume.publicId,
                "raw",
                "authenticated"
            );

            if (deletionResult.result !== "ok") {
                console.error(
                    "Previous resume could not be deleted:",
                    deletionResult
                );
            }
        } catch (error) {
            // The new resume is already saved, so don't fail the request
            console.error("Failed to delete previous resume:", error);
        }
    }

    return res.status(200).json(
        new ApiResponse(
            200,
            updatedUser.resume,
            "Resume uploaded successfully."
        )
    );
});

const generateResumeViewUrl = (resume, attachment = false) => {
    return cloudinary.utils.private_download_url(
        resume.publicId,
        resume.format,
        {
            resource_type: "raw",
            type: "authenticated",
            expires_at: Math.floor(Date.now() / 1000) + 300,
            attachment,
        }
    );
};

//view own resume
const viewMyResume = asyncHandler(async(req, res) => {
    const user = await User.findById(req.user._id).select("resume");

    if(!user || !user.resume){
        throw new ApiError(404, "Resume not found.");
    }

    const resumeUrl = generateResumeViewUrl(user.resume);

    return res
    .status(200)
    .json(new ApiResponse(200, {resumeUrl}, "RESUME URL GENERATED SUCCESSFULLY."));
})

//view students resume by company admin
const viewStudentResume = asyncHandler(async(req, res) => {
    const {studentId} = req.params;
    if(!isValidObjectId(studentId)){
        throw new ApiError(400, "Invalid student ID.");
    }

    // Find internships owned by the logged-in Company Admin
    const companyInternships = await Internship.find({
     owner: req.user._id,
    }).select("_id");


    const application = await Application.findOne({
        student: studentId,
        internship: {
            $in: companyInternships.map((internship) => internship._id),
        },
    });

    if(!application){
        throw new ApiError(403, "You are not authorized to view this student's resume.");
    }

    const student = await User.findById(studentId).select("resume");

    if (!student || !student.resume) {
        throw new ApiError(404, "Resume not found.");
    }

    const resumeUrl = generateResumeViewUrl(student.resume);

    return res.status(200).json(
        new ApiResponse(
            200,
            { resumeUrl },
            "Resume URL generated successfully."
        )
    );
})

//download own resume
const downloadMyResume = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id).select("resume");

    if (!user || !user.resume) {
        throw new ApiError(404, "Resume not found.");
    }

    const resumeUrl = generateResumeViewUrl(user.resume, true);

    return res.status(200).json(
        new ApiResponse(
            200,
            { resumeUrl },
            "Resume download URL generated successfully."
        )
    );
});

//company admin download resume
const downloadStudentResume = asyncHandler(async (req, res) => {
    const { studentId } = req.params;

    if (!isValidObjectId(studentId)) {
        throw new ApiError(400, "Invalid student ID.");
    }

    const companyInternships = await Internship.find({
        owner: req.user._id,
    }).select("_id");

    const application = await Application.findOne({
        student: studentId,
        internship: {
            $in: companyInternships.map((internship) => internship._id),
        },
    });

    if (!application) {
        throw new ApiError(
            403,
            "You are not authorized to download this student's resume."
        );
    }

    const student = await User.findById(studentId).select("resume");

    if (!student || !student.resume) {
        throw new ApiError(404, "Resume not found.");
    }

    const resumeUrl = generateResumeViewUrl(student.resume, true);

    return res.status(200).json(
        new ApiResponse(
            200,
            { resumeUrl },
            "Resume download URL generated successfully."
        )
    );
});

//delete resume
const deleteStudentOwnResume = asyncHandler(async(req, res) => {
    const user = await User.findById(req.user._id).select("resume");

    if(!user || !user.resume){
        throw new ApiError(404, "Resume not found.");
    }
    const publicId = user.resume.publicId;
     
     // Delete the actual PDF from Cloudinary
    const deletionResult = await deleteOnCloudinary(
        publicId,
        "raw",
        "authenticated",
    );
     if (
        deletionResult.result !== "ok" &&
        deletionResult.result !== "not found"
    ) {
        throw new ApiError(500, "Failed to delete resume from storage.");
    }

    //remove resume metadata from mongoDB
    const removeResume = await User.findByIdAndUpdate(req.user._id,
        {
        $unset: {resume: 1}
        },
        {
        runValidators: true
        }
    );
     
    return res
    .status(200)
    .json(new ApiResponse(200, {}, "RESUME DELETED SUCCESSFULLY."))

})

export { uploadStudentResume, viewMyResume, viewStudentResume, downloadMyResume, downloadStudentResume, deleteStudentOwnResume };