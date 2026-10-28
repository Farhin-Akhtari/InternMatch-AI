import { SavedInternship } from "../models/savedInternship.model.js";
import { Internship } from "../models/internship.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { isValidObjectId } from "mongoose";

// Save student internship
const saveInternship = asyncHandler(async (req, res) => {
    const {internshipId} = req.params;
     if(!isValidObjectId(internshipId)){
            throw new ApiError(400, "ID is not valid")
        }
    
        const internship = await Internship.findById(internshipId);
        if(!internship){
            throw new ApiError(404, "Internship page not found")
        }

        if(internship.status !== "active"){
            throw new ApiError(400, "This internship is not available to save");
        }

        const existingSavedInternships = await SavedInternship.findOne({
            user: req.user._id,
            internship: internshipId
        });
        if (existingSavedInternships) {
       return res.status(200).json(
        new ApiResponse(
            200,
            existingSavedInternships,
            "Internship already saved"
        )
    )}

   try {
     const savedInternship = await SavedInternship.create({
        user: req.user._id,
        internship: internshipId
     });

     return res
        .status(201)
        .json(new ApiResponse(
            201,
            savedInternship,
            "Internship saved successfully"
        ));
    } catch (error) {
     if (error.code === 11000) {
         throw new ApiError(409, "Internship already saved");
     }
     throw error;
   }
})

// retrieve internship
const getSavedInternship = asyncHandler(async (req, res) => {
    const savedinternship = await SavedInternship.find({
        user: req.user._id
    }).populate("internship",  "title company description preferredSkills requiredSkills location workMode stipend applicationUrl deadline status") 
      .sort({createdAt: -1});

      return res
      .status(200)
      .json(new ApiResponse(200, savedinternship, 
      savedinternship.length === 0 
      ? "NO INTERNSHIP FOUND" 
      : "INTERNSHIP RETRIEVED SUCCESSFULLY"));
})

// remove internship
const removeInternship = asyncHandler(async (req, res) => {
    const {internshipId} = req.params;
     if(!isValidObjectId(internshipId)){
            throw new ApiError(400, "ID is not valid")
        }
    
     const internship = await SavedInternship.findOneAndDelete({
        user: req.user._id,
        internship: internshipId
     });
        if(!internship){
            throw new ApiError(404, "Saved internship not found")
        }

    return res
    .status(200)
    .json(new ApiResponse(200, internship, "Saved Internship removed successfully."))
           
})

export { saveInternship, getSavedInternship, removeInternship }