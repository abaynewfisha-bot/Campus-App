export type UserRole = "student" | "staff" | "admin";

export type RequestStatus =
  | "pending"
  | "in_progress"
  | "resolved"
  | "rejected";

export type FeedbackStatus =
  | "pending"
  | "reviewed"
  | "resolved"
  | "rejected";

export interface User {
  id: string;
  fullName: string;
  email: string;
  role: UserRole;
  createdAt: string;
}

export interface AuthResult {
  user: User;
  token: string;
}

export interface Announcement {
  id: string;
  title: string;
  description: string;
  category: string;
  authorId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface EventItem {
  id: string;
  title: string;
  description: string;
  location: string;
  category: string;
  startDate: string;
  endDate: string;
  organizerId: string | null;
  createdAt: string;
}

export interface Club {
  id: string;
  name: string;
  description: string;
  contactEmail: string;
  imageUrl: string | null;
  activities: string | null;
  createdAt: string;
}

export interface Facility {
  id: string;
  name: string;
  category: string;
  description: string;
  latitude: number;
  longitude: number;
  contact: string | null;
  createdAt: string;
}

export interface ServiceRequest {
  id: string;
  userId: string;
  title: string;
  description: string;
  category: string;
  location: string | null;
  status: RequestStatus;
  createdAt: string;
  updatedAt: string;
}

export interface Feedback {
  id: string;
  userId: string;
  subject: string;
  description: string;
  category: string;
  status: FeedbackStatus;
  createdAt: string;
  updatedAt: string;
}

export interface EmergencyContact {
  id: string;
  department: string;
  phone: string;
  description: string | null;
  createdAt: string;
}

export interface AppNotification {
  id: string;
  userId: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface Paginated<T> {
  data: T[];
  meta: PaginationMeta;
}

export interface NotificationList extends Paginated<AppNotification> {
  unread: number;
}

export interface ListParams {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  status?: string;
  upcoming?: boolean;
  unreadOnly?: boolean;
}

export interface RegisterInput {
  fullName: string;
  email: string;
  password: string;
  role?: "student" | "staff";
}

export interface UpdateProfileInput {
  fullName?: string;
  email?: string;
  password?: string;
}

export interface CreateRequestInput {
  title: string;
  description: string;
  category: string;
  location?: string;
}

export interface CreateFeedbackInput {
  subject: string;
  description: string;
  category: string;
}

export interface CreateAnnouncementInput {
  title: string;
  description: string;
  category: string;
}

export interface CreateEventInput {
  title: string;
  description: string;
  location: string;
  category: string;
  startDate: string;
  endDate: string;
}
