import { Router } from "express";
import { isAdmin } from "../middlewares/auth.middleware.js";
import { isLoggedIn } from "../middlewares/auth.middleware.js";
import {
  avatarController,
  deleteSessionController,
  deleteUserByIdController,
  getAllSessionController,
  getAllUserController,
  getSessionByIdController,
  getUserByIdController,
  profileController,
} from "../controllers/admin.controller.js";
import { upload } from "../middlewares/multer.js";

const router = Router();
router.route("/profile").get(isLoggedIn, profileController);
router
  .route("/profile/avatar")
  .post(isLoggedIn, upload.single("avatar"), avatarController);
router.route("/get-all-users").get(isLoggedIn, isAdmin, getAllUserController);
router.route("/user/:id").get(isLoggedIn, isAdmin, getUserByIdController);

router
  .route("/getallsessions")
  .get(isLoggedIn, isAdmin, getAllSessionController);

router.route("/:sessionId").get(isLoggedIn, isAdmin, getSessionByIdController);
router.route("/delete/:sessionId").delete(isLoggedIn, deleteSessionController);

router.route("/:userId").delete(isLoggedIn, isAdmin, deleteUserByIdController);
export default router;
