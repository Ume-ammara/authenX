import { Router } from "express";

import {
  loginController,
  refreshTokenController,
} from "../controllers/auth.controller.js";

const router = Router();
router.route("/login").post(loginController);
router.route("/refresh").post(refreshTokenController);

export default router;
