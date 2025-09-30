import { ApiError } from "../utils/ApiError.js";
import { HTTPSTATUS } from "../config/http.config.js";
import { prisma } from "../config/db.js";
import { env } from "../config/env.js";
import {
  comparePassword,
  createHash,
  generateRefreshToken,
  hashPassword,
  generateAccessToken,
  generateTemporaryToken,
} from "../utils/auth-helpers.js";

export const loginServices = async (email, password) => {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new ApiError(HTTPSTATUS.BAD_REQUEST, "User not found");
  }
  if (!user.isVerified) {
    throw new ApiError(HTTPSTATUS.UNAUTHORIZED, "Please verify your email");
  }

  const isPasswordValid = await comparePassword(password, user.password);
  if (!isPasswordValid) {
    throw new ApiError(HTTPSTATUS.UNAUTHORIZED, "Invalid credentials");
  }

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  await prisma.session.create({
    data: {
      userId: user.id,
      refreshToken,
      userAgent: req.headers["user-agent"],
      ipAddress: req.ip,
      expiresAt: new Date(Date.now() + env.REFRESH_TOKEN_EXPIRY),
    },
  });

  return { user, refreshToken, accessToken };
};

export const refreshTokenService = async()
