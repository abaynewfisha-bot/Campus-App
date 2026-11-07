export const colors = {
  primary: "#1d4ed8",
  primaryDark: "#1e3a8a",
  primaryLight: "#dbeafe",
  accent: "#f59e0b",
  background: "#f8fafc",
  surface: "#ffffff",
  surfaceAlt: "#f1f5f9",
  text: "#0f172a",
  textMuted: "#64748b",
  border: "#e2e8f0",
  success: "#16a34a",
  warning: "#f59e0b",
  danger: "#dc2626",
  info: "#0ea5e9",
  white: "#ffffff",
  black: "#000000",
};

export const statusColors: Record<string, string> = {
  pending: colors.warning,
  in_progress: colors.info,
  reviewed: "#8b5cf6",
  resolved: colors.success,
  rejected: colors.danger,
};

export type AppColors = typeof colors;
