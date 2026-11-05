import { Router } from "express"
import { verifyJWT } from "../middleware/auth.middleware.js";
import { verifyPlatformAdmin } from "../middleware/role.middleware.js";
import { registerUser, registerCompanyAdmin, verifyCompanyEmail, resendCompanyVerificationEmail, getPendingCompanyAdminRequests, approveCompanyAdminRequest, rejectCompanyAdminRequest, loginUser, refreshAccessToken, logoutUser, getCurrentUser, updateUserProfile } from "../controllers/user.controller.js"

const router = Router();

router.route("/register").post(registerUser);
router.route("/register/company-admin").post(registerCompanyAdmin);
router.route("/verify-company-email").post(verifyCompanyEmail);
router.route("/resend-company-verification").post(resendCompanyVerificationEmail);
router.route("/admin/company-requests/pending").get(verifyJWT, verifyPlatformAdmin, getPendingCompanyAdminRequests);
router.route("/admin/company-requests/:userId/approve").patch(verifyJWT, verifyPlatformAdmin, approveCompanyAdminRequest);
router.route("/admin/company-requests/:userId/reject").patch(verifyJWT, verifyPlatformAdmin, rejectCompanyAdminRequest);
router.route("/login").post(loginUser);
router.route("/refresh-token").post(refreshAccessToken);
router.route("/logout").post(logoutUser);
router.route("/current-user").get(verifyJWT, getCurrentUser);
router.route("/update-profile").patch(verifyJWT, updateUserProfile);

export default router;