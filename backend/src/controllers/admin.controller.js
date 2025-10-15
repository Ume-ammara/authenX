import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import {
  getAllUserServices,
  profileServices,
} from "../services/admin.services.js";
import { HTTPSTATUS } from "../config/http.config.js";

export const profileController = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const user = await profileServices(userId);

  return res
    .status(HTTPSTATUS.OK)
    .json(
      new ApiResponse(HTTPSTATUS.OK, "Profile fetched successfully", { user }),
    );
});

export const getAllUserController = asyncHandler(async (req, res) => {
  const user = await getAllUserServices();
  console.log("userrr", user);
 
  return res.status(HTTPSTATUS.OK, "Users fetched successfully", { user });
});
