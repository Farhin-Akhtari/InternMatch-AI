import { isValidObjectId } from 'mongoose';
import { Internship } from '../models/internship.model.js';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import {ApiResponse} from "../utils/ApiResponse.js";

//get active internships
const getActiveInternships = asyncHandler(async (req, res) => {
    const internships = await Internship.find ({
        status: "active",
    }).sort({ createdAt: -1 });
    return res
    .status(200)
    .json(new ApiResponse(200, internships, "ACTIVE INTERNSHIP FETCHED SUCCESSFULLY"))
})

//get internship by ID
const getInternshipById = asyncHandler(async (req, res) => {
    const {internshipId} = req.params;
    if(!isValidObjectId(internshipId)){
        throw new ApiError(400, "ID is not valid")
    }

    const internship = await Internship.findById({
        _id: internshipId,
        status: "active"
    });
    if(!internship){
        throw new ApiError(404, "Internship page not found")
    }

    return res
    .status(200)
    .json(new ApiResponse(200, internship, "INTERNSHIP FETCHED SUCCESSFULLY"))
})

//create internship
const createInternship = asyncHandler(async (req, res) => {
    const {
        title, 
        company, 
        description, 
        preferredSkills,
        requiredSkills, 
        location,
        workMode,
        stipend,
        applicationUrl,
        deadline,
        status
    } = req.body;
    if (deadline !== undefined && deadline !== null) {
    const deadlineDate = new Date(deadline);

    if (Number.isNaN(deadlineDate.getTime())) {
        throw new ApiError(400, "Please provide a valid deadline.");
    }

    if (deadlineDate <= new Date()) {
        throw new ApiError(400, "Deadline cannot be in the past.");
    }
}

  if (stipend !== undefined && stipend !== null) {
    if (typeof stipend !== "object" || Array.isArray(stipend)) {
        throw new ApiError(400, "Stipend must be an object.");
    }

    const { min, max } = stipend;

    if (
        (min != null && (typeof min !== "number" || !Number.isFinite(min) || min < 0)) ||
        (max != null && (typeof max !== "number" || !Number.isFinite(max) || max < 0)) ||
        (min != null && max != null && min > max)
    ) {
        throw new ApiError(
            400,
            "Stipend must contain non-negative numbers, and minimum cannot exceed maximum."
        );
    }
 }

    const newInternship = await Internship.create({
         title,
         company,
         description,
         preferredSkills,
         requiredSkills,
         location,
         workMode,
         stipend,
         applicationUrl,
         deadline,
         status
        });
     if(!newInternship){
        throw new ApiError(400, "FAILED TO CREATE INTERNSHIP");
     }

    return res
    .status(201)
    .json(new ApiResponse(
        201,
        newInternship,
        "INTERNSHIP CREATED SUCCESSFULLY"
    ));
})

//update internship
const updateInternship = asyncHandler(async (req,res) => {
    const {internshipId} = req.params;
    if(!isValidObjectId(internshipId)){
        throw new ApiError(400, "ID is not valid")
    }

    if (
    !req.body ||
    typeof req.body !== "object" ||
    Array.isArray(req.body)) {
    throw new ApiError(400, "Request body must be a valid object.");
    }

       // Accept only the fields that are allowed to be updated.
    const allowedFields = [
        "title",
        "company",
        "description",
        "preferredSkills",
        "requiredSkills",
        "location",
        "workMode",
        "stipend",
        "applicationUrl",
        "deadline",
        "status"
    ];

    const updatedData = {};

    for (const field of allowedFields) {
        if (req.body[field] !== undefined) {
            updatedData[field] = req.body[field];
        }
    }
        if (Object.keys(updatedData).length === 0) {
          throw new ApiError(400, "No valid fields provided for update");
        }

    if (updatedData.deadline !== undefined && updatedData.deadline !== null) {
    const deadlineDate = new Date(updatedData.deadline);

    if (Number.isNaN(deadlineDate.getTime())) {
        throw new ApiError(400, "Please provide a valid deadline.");
    }

    if (deadlineDate <= new Date()) {
        throw new ApiError(400, "Deadline must be in the future.");
    }
  }

    if (updatedData.stipend !== undefined) {
      if (
       updatedData.stipend === null ||
       typeof updatedData.stipend !== "object" ||
       Array.isArray(updatedData.stipend)
      ) {
         throw new ApiError(400, "Stipend must be an object.");
        }
       const existingInternship = await Internship.findById(internshipId);

        if (!existingInternship) {
           throw new ApiError(404, "Internship not found");
        }
    
       const currentStipend = existingInternship.stipend?.toObject
        ? existingInternship.stipend.toObject()
        : existingInternship.stipend?.toJSON
            ? existingInternship.stipend.toJSON()
            : existingInternship.stipend ?? {};

        const newStipend = {
          ...currentStipend,
          ...updatedData.stipend,
        };

        const { min, max } = newStipend;

        if (
          (min != null && (typeof min !== "number" || !Number.isFinite(min) || min < 0)) ||
          (max != null && (typeof max !== "number" || !Number.isFinite(max) || max < 0)) ||
          (min != null && max != null && min > max)
        ) {
           throw new ApiError( 400, "Stipend must contain non-negative numbers, and minimum cannot exceed maximum.");
          }
    }

     //findByIdAndUpdate(id, update, options)
    const updatedInternship = await Internship.findByIdAndUpdate(internshipId, 
       {
        $set: updatedData
       },
        {
            new: true,
            runValidators: true
        }
)

    if(!updatedInternship){
        throw new ApiError(404, "Internship not found")
    }

    return res
    .status(200)
    .json(new ApiResponse(200, updatedInternship, "INTERNSHIP UPDATED SUCCESSFULLY"))

})

//delete internship
const deleteInternship = asyncHandler(async (req, res) => {
    const {internshipId} = req.params;
    if(!isValidObjectId(internshipId)){
        throw new ApiError(400, "ID is not valid")
    }

    const deletedInternship = await Internship.findByIdAndDelete(internshipId)
    if(!deletedInternship){
        throw new ApiError(404, "Internship failed to delete")
    }

    return res
    .status(200)
    .json(new ApiResponse(200, {}, "INTERNSHIP DELETED SUCCESSFULLY"))
})

export { getActiveInternships, getInternshipById, updateInternship, deleteInternship, createInternship };