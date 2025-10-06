import {
  forgotPasswordService,
  loginServices,
  refreshTokenService,
  registerServices,
  verifyEmailServices,
} from "../services/auth.services.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import {
  forgotPasswordSchema,
  loginSchema,
  registerSchema,
} from "../schemas/auth.schema.js";
import { HTTPSTATUS } from "../config/http.config.js";

export const registercontoller = asyncHandler(async (req, res) => {
  const { fullname, email, password } = registerSchema.parse(req.body);
  const user = await registerServices(fullname, email, password);
  return res
    .status(HTTPSTATUS.CREATED)
    .json(
      new ApiResponse(
        HTTPSTATUS.CREATED,
        { user },
        "User registered successfully",
      ),
    );
});

export const loginController = asyncHandler(async (req, res) => {
  const { email, password } = loginSchema.parse(req.body);
  const ipAddress = req.ip;
  const userAgent = req.headers["user-agent"];
  const { user, refreshToken, accessToken } = await loginServices(
    email,
    password,
    ipAddress,
    userAgent,
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

  return res.status(HTTPSTATUS.OK).json(
    new ApiResponse(HTTPSTATUS.OK, "Login successful", {
      user,
      accessToken,
      refreshToken,
    }),
  );
});

export const verifyEmailController = asyncHandler(async (req, res) => {
  const { token } = req.params;

  const user = verifyEmailServices(token);

  return res
    .status(HTTPSTATUS.OK)
    .json(
      new ApiResponse(HTTPSTATUS.OK, "Email verified successfully", { user }),
    );
});

export const refreshTokenController = asyncHandler(async (req, res) => {
  const token = req.cookies?.refreshToken;
  if (!token) {
    throw new ApiError(HTTPSTATUS.UNAUTHORIZED, "Refresh token is missing");
  }

  const ipAddress = req.ip;
  const userAgent = req.headers["user-agent"];
  const { user, refreshToken, accessToken } = await refreshTokenService(
    token,
    ipAddress,
    userAgent,
  );

  const isProduction = process.env.NODE_ENV === "production";
  const cookieOptions = {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
  };

  res
    .cookie("accessToken", accessToken, {
      ...cookieOptions,
      maxAge: 15 * 60 * 1000,
    })
    .cookie("refreshToken", refreshToken, {
      ...cookieOptions,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

  return res
    .status(HTTPSTATUS.OK)
    .json(
      new ApiResponse(
        HTTPSTATUS.OK,
        { user, accessToken, refreshToken },
        "Access token refreshed successfully",
      ),
    );
});

export const forgotPasswordController = asyncHandler(async (req, res) => {
  const { email } = forgotPasswordSchema.parse(req.body);
  const user = await forgotPasswordService(email);
  return res.status(HTTPSTATUS.OK).json(
    new ApiResponse(HTTPSTATUS.OK, "Password reset link sent successfully", {
      user,
    }),
  );
});
