import { ApiError } from "../utils/ApiError.js";
import { HTTPSTATUS } from "../config/http.config.js";
import { prisma } from "../config/db.js";
import { env } from "../config/env.js";
import {
  emailVerificationMailGenContent,
  sendMail,
  forgotPasswordMailGenContent,
} from "../utils/mail.js";
import {
  comparePassword,
  createHash,
  generateRefreshToken,
  hashPassword,
  generateAccessToken,
  generateTemporaryToken,
} from "../utils/auth-helpers.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

export const registerServices = async (
  fullname,
  email,
  password,
  avatarLocalPath,
) => {
  const existedUser = await prisma.user.findUnique({ where: { email } });
  if (existedUser) {
    throw new ApiError(
      HTTPSTATUS.CONFLICT,
      "User already exists with this email",
    );
  }

  const hashedPassword = await hashPassword(password);
  const { hashedToken, unHashedToken, tokenExpiry } = generateTemporaryToken();
  let avatarUrl = "";
  if (avatarLocalPath) {
    const uploadResult = await uploadOnCloudinary(avatarLocalPath);
    avatarUrl = uploadResult?.secure_url || "";
  }

  const user = await prisma.user.create({
    data: {
      fullname,
      email,
      password: hashedPassword,
      avatar: avatarUrl,
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

  const updateUser = await prisma.user.update({
    where: { id: user.id },
    data: {
      isVerified: true,
      verificationToken: null,
      verificationTokenExpiry: null,
    },
  });

  return updateUser;
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

export const forgotPasswordService = async (email) => {
  const user = await prisma.user.findUnique({
    where: {
      email: email,
    },
  });

  if (!user) {
    throw new ApiError(HTTPSTATUS.BAD_REQUEST, "Unauthorized request");
  }

  const { hashedToken, unHashedToken, tokenExpiry } = generateTemporaryToken();

  const updatedUser = await prisma.user.update({
    where: { id: user.id },
    data: {
      resetPasswordToken: hashedToken,
      resetPasswordTokenExpiry: new Date(Date.now() + tokenExpiry),
    },
  });

  const resetUrl = `${env.FRONTEND_URL}/auth/reset/${unHashedToken}`;

  await sendMail({
    email,
    subject: "Reset your password",
    mailGenContent: forgotPasswordMailGenContent(user.fullname, resetUrl),
  });

  return { updatedUser };
};

// google Oauth services

export const googleOAuthServices = async (profile) => {
  let user = await prisma.user.findUnique({
    where: {
      email: profile.email,
    },
  });

  if (!user) {
    user = await prisma.user.create({
      data: {
        email: profile.email,
        fullname: profile.fullname,
        username:
          profile.username ||
          profile.email.split("@")[0] + Math.floor(Math.random() * 1000),
        avatar: profile.avatar,
        isVerified: true,
      },
    });
  }

  const session = await prisma.session.create({
    data: {
      userId: user.id,
      isValid: true,
      expiresAt: new Date(Date.now() + Number(env.REFRESH_TOKEN_EXPIRY)),
    },
  });

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
    where: {
      id: session.id,
    },
    data: {
      refreshToken: createHash(refreshToken),
      isValid: true,
    },
  });

  return { accessToken, refreshToken };
};
