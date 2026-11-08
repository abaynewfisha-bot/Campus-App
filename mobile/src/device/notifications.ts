
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export async function registerForNotifications(): Promise<boolean> {
  if (Platform.OS === "android" && Number(Platform.Version) >= 26) {
    try {
      await Notifications.setNotificationChannelAsync("default", {
        name: "University Campus Notifications",
        importance: Notifications.AndroidImportance.DEFAULT,
      });
    } catch (error) {
      console.warn(
        "Android notification channel setup failed; continuing with permission request.",
        error,
      );
    }
  }

  const current = await Notifications.getPermissionsAsync();
  const permission = current.granted
    ? current
    : await Notifications.requestPermissionsAsync();

  if (!permission.granted) {
    console.warn(
      "Notification permission denied:",
      permission.status,
      "Can ask again:",
      permission.canAskAgain,
    );

    return false;
  }

  console.log("University Campus notifications enabled!");
  return true;
}

export async function scheduleLocalNotification(
  title: string,
  body: string,
  seconds = 1
): Promise<string> {
  return Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
      sound: "default",
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
      seconds,
    },
  });
}
