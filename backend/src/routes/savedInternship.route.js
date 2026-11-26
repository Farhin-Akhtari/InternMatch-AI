import { Router } from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { verifyStudent } from "../middleware/role.middleware.js";
import { getSavedInternship, removeInternship, saveInternship } from "../controllers/savedInternship.controller.js";

const router = Router();

router.route("/:internshipId").post(verifyJWT, verifyStudent, saveInternship);
router.route("/retrieve-internships").get(verifyJWT, verifyStudent, getSavedInternship);
router.route("/:internshipId").delete(verifyJWT, verifyStudent, removeInternship)

export default router;