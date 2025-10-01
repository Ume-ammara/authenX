import { sendMail, emailVerificationMailGenContent } from "../utils/mail";
import { ApiError } from "../utils/ApiError.js";
import { generateTemporaryToken } from "./auth-helpers.js";
import { prisma } from "../generated/prisma/index.js";

export const sendEmailVerification = async (user) => {
  const { hashedToken, unHashedToken, tokenExpiry } = generateTemporaryToken();

  await prisma.user.update({
    where: { id: user.id },
    data: {
      emailVerificationToken: hashedToken,
      verificationTokenExpiry: tokenExpiry,
    },
  });

  const emailVerificationUrl = `${process.env.FRONTEND_URL}/auth/verify/${unHashedToken}`;

  try {
    await sendMail({
      email: user.email,
      subject: "Email verification",
      mailGenContent: emailVerificationMailGenContent(emailVerificationUrl),
    });
  } catch (error) {
    throw new ApiError(500, "Failed to send verification email");
  }
};
