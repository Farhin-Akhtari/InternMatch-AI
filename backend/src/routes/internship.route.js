import {Router} from 'express';
import { verifyJWT } from '../middleware/auth.middleware.js';
import { verifyAdmin } from '../middleware/role.middleware.js';
import {deleteInternship, getActiveInternships, getInternshipById, updateInternship, createInternship} from '../controllers/internship.controller.js';

const router = Router();

router.route("/").get(getActiveInternships);
router.route("/:internshipId").get(getInternshipById);
router.route("/").post(verifyJWT, verifyAdmin, createInternship)
router.route("/:internshipId").patch(verifyJWT, verifyAdmin, updateInternship);
router.route("/:internshipId").delete(verifyJWT,verifyAdmin, deleteInternship);

export default router;