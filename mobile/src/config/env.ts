import Constants from "expo-constants";

function inferApiUrl(): string {
  const explicit = process.env.EXPO_PUBLIC_API_URL?.trim();

  if (explicit) {
    return explicit.replace(/\/$/, "");
  }

  const hostUri =
    Constants.expoConfig?.hostUri ??
    (Constants as unknown as { expoGoConfig?: { debuggerHost?: string } })
      .expoGoConfig?.debuggerHost;

  if (hostUri) {
    const host = hostUri.split(":")[0];
    return `http://${host}:5000/api`;
  }

  return "http://localhost:5000/api";
}

export const API_URL = inferApiUrl();
