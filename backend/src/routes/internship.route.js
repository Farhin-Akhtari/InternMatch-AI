import {Router} from 'express';
import { verifyJWT } from '../middleware/auth.middleware.js';
import { verifyAdmin, verifyCompanyAdmin } from '../middleware/role.middleware.js';
import {deleteInternship, getActiveInternships, getInternshipById, updateInternship, createInternship, getAllInternship} from '../controllers/internship.controller.js';

const router = Router();

router.route("/admin/all").get(verifyJWT, verifyAdmin, getAllInternship);
router.route("/").get(getActiveInternships);
router.route("/:internshipId").get(getInternshipById);
router.route("/").post(verifyJWT, verifyCompanyAdmin, createInternship)
router.route("/:internshipId").patch(verifyJWT, verifyAdmin, updateInternship);
router.route("/:internshipId").delete(verifyJWT,verifyAdmin, deleteInternship);

export default router;