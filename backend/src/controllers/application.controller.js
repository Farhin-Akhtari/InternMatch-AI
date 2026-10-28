import { Application } from "../models/application.model.js";
import { Internship } from "../models/internship.model.js"
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js"
import  { isValidObjectId } from "mongoose";

// apply internship
const applyToInternship = asyncHandler(async (req, res) => {
    const {internshipId} = req.params;
    if(!isValidObjectId(internshipId)){
        throw new ApiError(400, "INVALID INTERNSHIP ID");
    }

    const internship = await Internship.findById(internshipId);
    if(!internship){
        throw new ApiError(404, "Internship page not found")
    }
    if(internship.status !== "active"){
        throw new ApiError(409, "INTERNSHIP IS NOT ACTIVE.")
    }
    const now = new Date();
    if(internship.deadline && internship.deadline <= now){
        throw new ApiError(400, "APPLICATION DEADLINE HAS PASSED")
    }

    const existingApplication = await Application.findOne({
        student: req.user._id,
        internship: internshipId
    })
    if (existingApplication) {
      throw new ApiError(409, "YOU HAVE ALREADY APPLIED");
    }

    
   let application;

    try {
       application = await Application.create({
         student: req.user._id,
         internship: internshipId,
        });
     } catch (error) {
       if (error.code === 11000) {
        throw new ApiError(409, "YOU HAVE ALREADY APPLIED");
      }

      throw error;
    }

    return res
    .status(201)
    .json(new ApiResponse(201, application, "INTERNSHIP APPLIED SUCCESSFULLY."));
})

//get my application
const getMyApplications = asyncHandler(async (req, res) => {
    const application = await Application.find({
        student: req.user._id,
    }).populate("internship")
      .sort({createdAt: -1});

      return res
      .status(200)
      .json(new ApiResponse(200, application,application.length === 0
                    ? "NO APPLICATIONS FOUND"
                    : "APPLICATION FETCHED SUCCESFULLY"));
})

//get applicant for internship
const getApplicantsForInternship = asyncHandler(async (req, res) => {
    const {internshipId} = req.params;
    if(!isValidObjectId(internshipId)){
        throw new ApiError(400, "INVALID INTERNSHIP ID");
    }

    const internship = await Internship.findById(internshipId);
    if(!internship){
        throw new ApiError(404, "INTERNSHIP PAGE NOT FOUND")
    }
    const applications = await Application.find({
        internship: internshipId
    }).populate("student", "fullName email skills")
      .sort({createdAt: -1});

    return res
    .status(200)
    .json(new ApiResponse(200, applications, "APPLICATION FETCHED SUCCESSFULLY."))
})

// update application status
const updateApplicationStatus = asyncHandler(async (req, res) => {
    const {applicationId} = req.params;
    if(!isValidObjectId(applicationId)){
        throw new ApiError(400, "INVALID APPLICATION ID.")
    }

    const application = await Application.findById(applicationId);
    if(!application){
        throw new ApiError(404, "APPLICATION NOT FOUND.")
    }

    const {status} = req.body;
    const allowedStatus = ["reviewed", "accepted", "rejected"];
    if(!allowedStatus.includes(status)){
        throw new ApiError(400, "INVALID APPLICATION STATUS")
    }
    const updateStatus = await Application.findByIdAndUpdate(applicationId,
        { $set: {status}},
       {new: true, runValidators: true}
    )

    return res
    .status(200)
    .json(new ApiResponse(200, updateStatus, "APPLICATION STATUS UPDATED SUCCESSFULLY."))
})

export { applyToInternship, getMyApplications, getApplicantsForInternship, updateApplicationStatus };