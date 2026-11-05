import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const verifyAdmin = asyncHandler(async (req, res, next) => {
    if(req.user?.role !== "admin"){
        throw new ApiError(403, "Access denied. Admin only.");
    }
    next();
  
});

export const verifyPlatformAdmin = asyncHandler(async (req, res, next) => {
    if (
        req.user?.role !== "admin" ||
        req.user?.adminType !== "platform"
    ) {
        throw new ApiError(403, "Access denied. Platform admin only.");
    }

    next();
});


export const verifyCompanyAdmin = asyncHandler(async (req, res, next) => {
    if (
        req.user?.role !== "admin" ||
        req.user?.adminType !== "company"
    ) {
        throw new ApiError(403, "Access denied. Company admin only.");
    }

    next();
});