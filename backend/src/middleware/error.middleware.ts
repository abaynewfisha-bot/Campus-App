import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { ApiError } from "../utils/ApiError";
import { logger } from "../utils/logger";

interface PgError extends Error {
  code?: string;
}

export function notFoundHandler(req: Request, res: Response): void {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.originalUrl} not found`,
  });
}

export function errorHandler(
  error: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  if (error instanceof ApiError) {
    res.status(error.statusCode).json({
      success: false,
      message: error.message,
      ...(error.details ? { errors: error.details } : {}),
    });
    return;
  }

  if (error instanceof ZodError) {
    res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: error.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
      })),
    });
    return;
  }

  const pgError = error as PgError;

  if (pgError?.code === "23505") {
    res.status(409).json({
      success: false,
      message: "A record with those details already exists",
    });
    return;
  }

  if (pgError?.code === "23503") {
    res.status(400).json({
      success: false,
      message: "Referenced record does not exist",
    });
    return;
  }

  logger.error(error);

  res.status(500).json({
    success: false,
    message: "Internal server error",
  });
}
