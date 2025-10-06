import { Router } from "express";

import {
  forgotPasswordController,
  loginController,
  refreshTokenController,
  registercontoller,
  verifyEmailController,
} from "../controllers/auth.controller.js";

const router = Router();
router.route("/register").post(registercontoller);
router.route("/login").post(loginController);
router.route("/refresh").post(refreshTokenController);
router.route("/verify/:token").get(verifyEmailController);
router.route("/forgot-password").post(forgotPasswordController);

export default router;
