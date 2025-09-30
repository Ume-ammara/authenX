import { loginServices } from "../services/auth.services.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { loginSchema } from "../schemas/auth.schema.js";

export const loginController = asyncHandler(async (req, res) => {
  const { email, password } = loginSchema.parse(req.body);
  const { user, refreshToken, accessToken } = await loginServices(
    email,
    password,
    req,
  );
  const isProduction = process.env.NODE_ENV === "production";

  const refreshCookieOptions = {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  };

  const accessCookieOptions = {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    maxAge: 15 * 60 * 1000,
  };

  res.cookie("refreshToken", refreshToken, refreshCookieOptions);
  res.cookie("accessToken", accessToken, accessCookieOptions);

  return res.status(200).json(
    new ApiResponse(200, "Login successful", {
      user,
      accessToken,
    }),
  );
});
