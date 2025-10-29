import { prisma } from "../config/db.js";
import { ApiError } from "../utils/ApiError.js";
import { HTTPSTATUS } from "../config/http.config.js";

export const profileServices = async (userId) => {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      id: true,
      fullname: true,
      username: true,
      email: true,
      avatar: true,
      role: true,
      isVerified: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!user) {
    throw new ApiError(HTTPSTATUS.BAD_REQUEST, "User no found");
  }

  return user;
};

export const avatarServices = async (userId, avatarLocalPath) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });
  if (!user) {
    throw new ApiError(HTTPSTATUS.NOT_FOUND, "User not found");
  }

  let avatarUrl = "";
  if (avatarLocalPath) {
    const uploadResult = await uploadOnCloudinary(avatarLocalPath);
    avatarUrl = uploadResult?.secure_url || "";
  }
  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: { avatar: avatarUrl },
    select: {
      id: true,
      fullname: true,
      email: true,
      avatar: true,
    },
  });

  return updatedUser;
};

export const getAllUserServices = async () => {
  return await prisma.user.findMany({
    select: {
      id: true,
      fullname: true,
      email: true,
      role: true,
      isVerified: true,
      createdAt: true,
    },
  });
};

export const getUserByIdServices = async (userId) => {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });
  if (!user) {
    throw new ApiError(HTTPSTATUS.BAD_REQUEST, "User not found");
  }

  return user;
};

export const getAllSessionServices = async (userId) => {
  const sessions = await prisma.session.findMany({
    where: {
      userId: userId,
    },
    select: {
      id: true,
      userId: true,
      createdAt: true,
      userAgent: true,
      ipAddress: true,
      device: true,
      os: true,
      browser: true,
    },
  });

  return sessions;
};

export const getSessionByIdServices = async (sessionId, userId) => {
  const session = await prisma.session.findUnique({
    where: {
      userId: userId,
      id: sessionId,
    },
  });

  if (!session) {
    throw new ApiError(HTTPSTATUS.BAD_REQUEST, "Session not found");
  }

  return session;
};

export const deleteSessionServices = async (sessionId) => {
  const session = await prisma.session.findUnique({
    where: {
      id: sessionId,
    },
  });

  if (!session) {
    throw new ApiError(404, "Session not found");
  }

  return await prisma.session.delete({
    where: {
      id: sessionId,
    },
  });
};

export const deleteUserByIdServices = async (userId) => {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!user) {
    throw new ApiError(HTTPSTATUS.BAD_REQUEST, "User no found");
  }
  await prisma.session.deleteMany({
    where: { userId },
  });

  return await prisma.user.delete({
    where: {
      id: userId,
    },
  });
};
