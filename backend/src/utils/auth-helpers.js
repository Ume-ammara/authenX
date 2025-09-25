import bcrypt from "bcryptjs";
import crypto from "crypto";
import jwt from "jsonwebtoken";

export const hashPassword = async (password) => {
  return await bcrypt.hash(password, 10);
};

export const comparePassword = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword);
};

export const generateAccessToken = (user) => {
  return jwt.sign(
    {
      _id: user.id,
      email: user.email,
      role: user.role,
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRY },
  );
};

export const generateRefreshToken = (user) => {
  return jwt.sign(
    {
      _id: user.id,
      email: user.email,
      role: user.role,
    },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRY },
  );
};

export const createHash = (value) => {
  return crypto.createHash("sha256").update(value).digest("hex");
};

export const generateTemporaryToken = () => {
  const unHashedToken = crypto.randomBytes(20).toString("hex");

  const hashedToken = crypto
    .createHash("sha256")
    .update(unHashedToken)
    .digest("hex");
  const tokenExpiry = Date.now() + 20 * 60 * 1000; 

  return { hashedToken, unHashedToken, tokenExpiry };
};
