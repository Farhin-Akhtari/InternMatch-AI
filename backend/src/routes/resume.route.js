import { Router } from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { verifyCompanyAdmin, verifyStudent } from "../middleware/role.middleware.js";
import { uploadResume, validatePdfSignature } from "../middleware/multer.middleware.js";
import { deleteStudentOwnResume, downloadMyResume, downloadStudentResume, uploadStudentResume, viewMyResume, viewStudentResume } from "../controllers/resume.controller.js";

const router = Router();

router.route("/").post(verifyJWT, verifyStudent, uploadResume, validatePdfSignature, uploadStudentResume);
router.route("/me").get(verifyJWT, verifyStudent, viewMyResume);
router.route("/student/:studentId").get(verifyJWT, verifyCompanyAdmin, viewStudentResume);
router.route("/me/download").get(verifyJWT, verifyStudent, downloadMyResume);
router.route("/student/:studentId/download").get(verifyJWT, verifyCompanyAdmin, downloadStudentResume);
router.route("/").delete(verifyJWT, verifyStudent,deleteStudentOwnResume);

export default router;