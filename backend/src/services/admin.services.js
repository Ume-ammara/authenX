import { email } from "zod";
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
