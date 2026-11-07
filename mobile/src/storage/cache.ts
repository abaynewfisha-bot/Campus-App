import AsyncStorage from "@react-native-async-storage/async-storage";

const PREFIX = "campus_cache:";
const DEFAULT_TTL_MS = 1000 * 60 * 30;

interface CacheEntry<T> {
  value: T;
  expiresAt: number;
}

export async function setCache<T>(key: string, value: T): Promise<void> {
  const entry: CacheEntry<T> = {
    value,
    expiresAt: Date.now() + DEFAULT_TTL_MS,
  };

  await AsyncStorage.setItem(`${PREFIX}${key}`, JSON.stringify(entry));
}

export async function getCache<T>(key: string): Promise<T | null> {
  const raw = await AsyncStorage.getItem(`${PREFIX}${key}`);

  if (!raw) {
    return null;
  }

  try {
    const entry = JSON.parse(raw) as CacheEntry<T>;

    if (entry.expiresAt < Date.now()) {
      await AsyncStorage.removeItem(`${PREFIX}${key}`);
      return null;
    }

    return entry.value;
  } catch {
    return null;
  }
}

export async function clearCache(): Promise<void> {
  const keys = await AsyncStorage.getAllKeys();
  const cacheKeys = keys.filter((key) => key.startsWith(PREFIX));
  await AsyncStorage.multiRemove(cacheKeys);
}
