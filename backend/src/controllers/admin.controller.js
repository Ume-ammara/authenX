import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import {
  avatarServices,
  deleteSessionServices,
  deleteUserByIdServices,
  getAllSessionServices,
  getAllUserServices,
  getSessionByIdServices,
  getUserByIdServices,
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

export const avatarController = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const avatarLocalPath = req.file?.path;

  if (!avatarLocalPath) {
    throw new ApiError(HTTPSTATUS.BAD_REQUEST, "No file uploaded");
  }
  const user = avatarServices(userId, avatarLocalPath);
  return res
    .status(HTTPSTATUS.OK)
    .json(
      new ApiResponse(HTTPSTATUS.OK, "Avatar uploaded successfully", { user }),
    );
});

export const getAllUserController = asyncHandler(async (req, res) => {
  const user = await getAllUserServices();

  return res
    .status(HTTPSTATUS.OK)
    .json(
      new ApiResponse(HTTPSTATUS.OK, "Users fetched successfully", { user }),
    );
});

export const getUserByIdController = asyncHandler(async (req, res) => {
  const userId = req.params?.id;
  const user = await getUserByIdServices(userId);

  return res
    .status(HTTPSTATUS.OK)
    .json(
      new ApiResponse(HTTPSTATUS.OK, "User fetched successfully", { user }),
    );
});

export const getAllSessionController = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const sessions = await getAllSessionServices(userId);
  return res
    .status(HTTPSTATUS.OK)
    .json(
      new ApiResponse(HTTPSTATUS.OK, "Fetched all user sessions", { sessions }),
    );
});

export const getSessionByIdController = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { sessionId } = req.params;
  const session = await getSessionByIdServices(sessionId, userId);
  return res
    .status(HTTPSTATUS.OK)
    .json(new ApiResponse(HTTPSTATUS.OK, "fetched session by id", { session }));
});

export const deleteSessionController = asyncHandler(async (req, res) => {
  const { sessionId } = req.params;
  await deleteSessionServices(sessionId);

  return res
    .status(HTTPSTATUS.OK)
    .json(new ApiResponse(HTTPSTATUS.OK, "Session deleted successfully"));
});

export const deleteUserByIdController = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  await deleteUserByIdServices(userId);
  return res
    .status(HTTPSTATUS.OK)
    .json(new ApiResponse(HTTPSTATUS.OK, "User deleted successfully"));
});
