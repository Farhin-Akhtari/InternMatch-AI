import { applyToInternship, getApplicantsForInternship, getMyApplications, updateApplicationStatus } from "../controllers/application.controller.js";
import { Router } from "express";
import {verifyJWT} from "../middleware/auth.middleware.js";
import {verifyAdmin} from "../middleware/role.middleware.js";

const router = Router();

router.route("/my-applications").get(verifyJWT, getMyApplications);
router.route("/:internshipId/apply").post(verifyJWT, applyToInternship);
router.route("/:internshipId/applicants").get(verifyJWT, verifyAdmin, getApplicantsForInternship)
router.route("/:applicationId/status").patch(verifyJWT, verifyAdmin, updateApplicationStatus);

export default router;