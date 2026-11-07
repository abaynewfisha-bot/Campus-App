export function stringParam(value: unknown): string | undefined {
  if (typeof value === "string" && value.trim().length > 0) {
    return value.trim();
  }
  return undefined;
}

export function booleanParam(value: unknown): boolean {
  return value === "true" || value === "1" || value === true;
}
