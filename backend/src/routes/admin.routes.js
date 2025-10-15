import { Router } from "express";
import { isAdmin } from "../middlewares/auth.middleware.js";
import { isLoggedIn } from "../middlewares/auth.middleware.js";
import {
  getAllUserController,
  profileController,
} from "../controllers/admin.controller.js";

const router = Router();
router.route("/profile").get(isLoggedIn, profileController);
router.route("/get-all-users").get(isLoggedIn, isAdmin, getAllUserController);
export default router;
