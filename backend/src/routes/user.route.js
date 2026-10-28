import { Router } from "express"
import { verifyJWT } from "../middleware/auth.middleware.js";
import { registerUser, loginUser, refreshAccessToken, logoutUser, getCurrentUser, updateUserProfile } from "../controllers/user.controller.js"

const router = Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/refresh-token").post(refreshAccessToken);
router.route("/logout").post(logoutUser);
router.route("/current-user").get(verifyJWT, getCurrentUser);
router.route("/update-profile").patch(verifyJWT, updateUserProfile);


export default router;