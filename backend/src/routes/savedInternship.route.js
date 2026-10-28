import { Router } from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { getSavedInternship, removeInternship, saveInternship } from "../controllers/savedInternship.controller.js";

const router = Router();

router.route("/:internshipId").post(verifyJWT, saveInternship);
router.route("/retrieve-internships").get(verifyJWT, getSavedInternship);
router.route("/:internshipId").delete(verifyJWT, removeInternship)

export default router;