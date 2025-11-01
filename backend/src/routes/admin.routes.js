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
// User profile routes
router.get("/profile", isLoggedIn, profileController);
router.post(
  "/profile/avatar",
  isLoggedIn,
  upload.single("avatar"),
  avatarController,
);

//  Admin: User management
router.get("/users", isLoggedIn, isAdmin, getAllUserController);
router.get("/user/:id", isLoggedIn, isAdmin, getUserByIdController);
router.delete("/users/:id", isLoggedIn, isAdmin, deleteUserByIdController);

//  Admin: Session management
router.get("/sessions", isLoggedIn, isAdmin, getAllSessionController);
router.get("/sessions/:id", isLoggedIn, isAdmin, getSessionByIdController);
router.delete("/sessions/:id", isLoggedIn, isAdmin, deleteSessionController);
export default router;
