
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
  try {
    // Create Android notification channel first
    if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync("default", {
        name: "University Campus Notifications",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        sound: "default",
      });
    }

    // Check existing permission
    const current = await Notifications.getPermissionsAsync();

    let permission = current;

    // Request permission if not already granted
    if (!current.granted) {
      permission = await Notifications.requestPermissionsAsync();
    }

    if (!permission.granted) {
      console.warn(
        "Notification permission denied:",
        permission.status,
        "Can ask again:",
        permission.canAskAgain
      );

      return false;
    }

    console.log("University Campus notifications enabled!");

    return true;
  } catch (error) {
    console.error("Notification registration error:", error);
    return false;
  }
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
      channelId: "default",
    },
  });
}
