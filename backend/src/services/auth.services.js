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
import { includes } from "zod";

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

export const refreshTokenService = async (token, ipAddress, userAgent) => {
  if (!token) {
    throw new ApiError(HTTPSTATUS.BAD_REQUEST, "Refresh token is required");
  }

  const hashedToken = createHash(token);
  const session = await prisma.session.findUnique({
    where: { refreshToken: hashedToken },
  });

  if (!session) {
    throw new ApiError(
      HTTPSTATUS.UNAUTHORIZED,
      "Refresh token expired or invalid",
    );
  }

  const user = await prisma.user.findUnique({
    where: {
      id: session.userId,
    },
  });

  if (!user) {
    throw new ApiError(HTTPSTATUS.UNAUTHORIZED, "User not found");
  }

  const accessToken = await generateAccessToken({
    id: user.id,
    email: user.email,
    role: user.role,
    sessionId: session.id,
  });

  const refreshToken = await generateRefreshToken({
    id: user.id,
    email: user.email,
    role: user.role,
    sessionId: session.id,
  });

  await prisma.session.update({
    where: { id: session.id },
    data: {
      refreshToken: createHash(refreshToken),
      ipAddress,
      userAgent,
      expiresAt: new Date(Date.now() + env.REFRESH_TOKEN_EXPIRY),
    },
  });

  return { accessToken, refreshToken, user };
};
