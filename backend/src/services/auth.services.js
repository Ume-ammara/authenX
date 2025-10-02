import { ApiError } from "../utils/ApiError.js";
import { HTTPSTATUS } from "../config/http.config.js";
import { prisma } from "../config/db.js";
import { env } from "../config/env.js";
import { emailVerificationMailGenContent, sendMail } from "../utils/mail.js";
import {
  comparePassword,
  createHash,
  generateRefreshToken,
  hashPassword,
  generateAccessToken,
  generateTemporaryToken,
} from "../utils/auth-helpers.js";

export const registerServices = async (fullname, email, password) => {
  const existedUser = await prisma.user.findUnique({ where: { email } });
  if (existedUser) {
    throw new ApiError(
      HTTPSTATUS.CONFLICT,
      "User already exists with this email",
    );
  }

  const hashedPassword = await hashPassword(password);
  const { hashedToken, unHashedToken, tokenExpiry } = generateTemporaryToken();

  const user = await prisma.user.create({
    data: {
      fullname,
      email,
      password: hashedPassword,
      verificationToken: hashedToken,
      verificationTokenExpiry: new Date(Date.now() + tokenExpiry),
    },
  });

  const verificationUrl = `${env.FRONTEND_URL}/auth/verify/${unHashedToken}`;

  try {
    await sendMail({
      email,
      subject: "email verification",
      mailGenContent: emailVerificationMailGenContent(
        fullname,
        verificationUrl,
      ),
    });
  } catch (error) {
    console.error("Failed to send verification email:", error);
    throw new ApiError(
      HTTPSTATUS.INTERNAL_SERVER_ERROR,
      "Failed to send verification email",
    );
  }

  return user;
};

export const loginServices = async (email, password, ipAddress, userAgent) => {
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
      refreshToken: createHash(refreshToken),
      userAgent,
      ipAddress,
      expiresAt: new Date(Date.now() + Number(env.REFRESH_TOKEN_EXPIRY)),
    },
  });

  return { user, refreshToken, accessToken };
};

export const verifyEmailServices = async (token) => {
  const hashToken = createHash(token);

  const user = await prisma.user.findFirst({
    where: {
      verificationToken: hashToken,
    },
  });

  if (!user) {
    throw new ApiError(HTTPSTATUS.BAD_REQUEST, "User not found");
  }

  if (user.isVerified) {
    throw new ApiError(HTTPSTATUS.BAD_REQUEST, "Email is already verified");
  }
  if (user.verificationTokenExpiry < new Date()) {
    throw new ApiError(
      HTTPSTATUS.BAD_REQUEST,
      "Token expired, please request a new one",
    );
  }

  const { hashedToken, unHashedToken, tokenExpiry } = generateTemporaryToken();

  const verificationUrl = `${env.FRONTEND_URL}/auth/verify/${unHashedToken}`;

  try {
    await sendMail({
      email,
      subject: "email verification",
      mailGenContent: emailVerificationMailGenContent(
        fullname,
        verificationUrl,
      ),
    });
  } catch (error) {
    console.error("Failed to send verification email:", error);
    throw new ApiError(
      HTTPSTATUS.INTERNAL_SERVER_ERROR,
      "Failed to send verification email",
    );
  }

  await prisma.user.update({
    where: {
      email: user.email,
    },
    data: {
      verificationToken: hashedToken,
      verificationTokenExpiry: tokenExpiry,
    },
  });
  return 
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
      expiresAt: new Date(Date.now() + Number(env.REFRESH_TOKEN_EXPIRY)),
    },
  });

  return { accessToken, refreshToken, user };
};
