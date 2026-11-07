export function isEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

export function isRequired(value: string): boolean {
  return value.trim().length > 0;
}

export function hasMinLength(value: string, length: number): boolean {
  return value.trim().length >= length;
}

export function validatePassword(value: string): string | null {
  if (value.length < 6) {
    return "Password must be at least 6 characters";
  }
  return null;
}
