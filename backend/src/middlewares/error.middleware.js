import { ApiError } from "../utils/ApiError.js";
import { env } from "../config/env.js";
import { ZodError } from "zod";
import { HTTPSTATUS } from "../config/http.config.js";

export const errorHandler = (err, req, res, next) => {
  if (err instanceof ZodError) {
    if (env.NODE_ENV === "development") {
      console.error("ZodError:", err);
    }

    return res.status(HTTPSTATUS.BAD_REQUEST).json({
      statusCode: HTTPSTATUS.BAD_REQUEST,
      success: false,
      message: "Validation failed",
      error: err.errors.map((e) => ({
        field: e.path.join("."),
        message: e.message,
      })),
    });
  }

  if (err instanceof ApiError) {
    if (env.NODE_ENV === "development") {
      console.error("ApiError:", err.message);
      console.error("Stack:", err.stack);
    }

    return res.status(err.statusCode || HTTPSTATUS.INTERNAL_SERVER_ERROR).json({
      statusCode: err.statusCode || HTTPSTATUS.INTERNAL_SERVER_ERROR,
      success: false,
      message: err.message || "Something went wrong",
      error:
        Array.isArray(err.errors) && err.errors.length > 0 ? err.errors : null,
    });
  }

  if (env.NODE_ENV === "development") {
    console.error("Unhandled error:", err);
  }

  return res.status(HTTPSTATUS.INTERNAL_SERVER_ERROR).json({
    statusCode: HTTPSTATUS.INTERNAL_SERVER_ERROR,
    success: false,
    message: "Internal Server Error",
    error: err,
  });
};
