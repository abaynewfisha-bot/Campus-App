export type UserRole = "student" | "staff" | "admin";

export interface AuthUser {
  id: string;
  fullName: string;
  email: string;
  role: UserRole;
}

export interface JwtPayload {
  sub: string;
  email: string;
  role: UserRole;
}

export interface PaginationParams {
  page: number;
  limit: number;
  offset: number;
}

export interface PaginatedResult<T> {
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export type RequestStatus = "pending" | "in_progress" | "resolved" | "rejected";
export type FeedbackStatus = "pending" | "reviewed" | "resolved" | "rejected";
