import { Ionicons } from "@expo/vector-icons";
import { useCallback, useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "../src/components/common/Button";
import { EmptyState } from "../src/components/common/EmptyState";
import { ErrorState } from "../src/components/common/ErrorState";
import { Header } from "../src/components/common/Header";
import { Loader } from "../src/components/common/Loader";
import { NotificationItem } from "../src/components/notifications/NotificationItem";
import {
  registerForNotifications,
  scheduleLocalNotification,
} from "../src/device/notifications";
import { getErrorMessage } from "../src/services/apiClient";
import { notificationService } from "../src/services/notificationService";
import { colors } from "../src/theme/colors";
import { fontSizes } from "../src/theme/fonts";
import { spacing } from "../src/theme/spacing";
import { AppNotification } from "../src/types";

export default function NotificationsScreen() {
  const [items, setItems] = useState<AppNotification[]>([]);
  const [unread, setUnread] = useState(0);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async (mode: "initial" | "refresh" = "initial") => {
    if (mode === "initial") setLoading(true);
    if (mode === "refresh") setRefreshing(true);
    setError(null);

    try {
      const result = await notificationService.list({ limit: 50 });
      setItems(result.data);
      setUnread(result.unread);
    } catch (loadError) {
      setError(getErrorMessage(loadError));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function handlePress(item: AppNotification) {
    if (item.isRead) return;

    try {
      await notificationService.markRead(item.id);
      setItems((prev) =>
        prev.map((entry) =>
          entry.id === item.id ? { ...entry, isRead: true } : entry,
        ),
      );
      setUnread((prev) => Math.max(0, prev - 1));
    } catch (markError) {
      Alert.alert("Could not mark as read", getErrorMessage(markError));
    }
  }

  function handleDelete(item: AppNotification) {
    Alert.alert("Delete notification", "Remove this notification?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await notificationService.remove(item.id);
            setItems((prev) => prev.filter((entry) => entry.id !== item.id));
            if (!item.isRead) setUnread((prev) => Math.max(0, prev - 1));
          } catch (deleteError) {
            Alert.alert("Delete failed", getErrorMessage(deleteError));
          }
        },
      },
    ]);
  }

  async function handleMarkAllRead() {
    try {
      await notificationService.markAllRead();
      setItems((prev) => prev.map((entry) => ({ ...entry, isRead: true })));
      setUnread(0);
    } catch (markError) {
      Alert.alert("Update failed", getErrorMessage(markError));
    }
  }

  async function handleEnableAlerts() {
    try {
      const granted = await registerForNotifications();

      if (!granted) {
        Alert.alert(
          "Notifications disabled",
          "Enable notifications for this app in your device settings to receive campus alerts.",
        );
        return;
      }

      await scheduleLocalNotification(
        "Campus alerts enabled",
        "You will receive important campus announcements.",
      );
      Alert.alert("Enabled", "Device notifications are now enabled.");
    } catch (notificationError) {
      Alert.alert(
        "Could not enable notifications",
        getErrorMessage(notificationError),
      );
    }
  }

  return (
    <SafeAreaView style={styles.safe}>
      <Header
        title="Notifications"
        subtitle={unread > 0 ? `${unread} unread` : "All caught up"}
        showBack
        right={
          <Pressable onPress={handleMarkAllRead} hitSlop={10}>
            <Ionicons
              name="checkmark-done-outline"
              size={26}
              color={colors.primary}
            />
          </Pressable>
        }
      />

      {loading ? (
        <Loader message="Loading notifications..." />
      ) : error && items.length === 0 ? (
        <ErrorState message={error} onRetry={() => void load()} />
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <NotificationItem
              item={item}
              onPress={handlePress}
              onDelete={handleDelete}
            />
          )}
          contentContainerStyle={styles.list}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => void load("refresh")}
              colors={[colors.primary]}
            />
          }
          ListHeaderComponent={
            <View style={styles.headerBlock}>
              <Button
                title="Enable device alerts"
                onPress={() => void handleEnableAlerts()}
                variant="secondary"
                icon="notifications-outline"
              />
              <Text style={styles.note}>
                Push alerts keep you informed about announcements and events.
              </Text>
            </View>
          }
          ListEmptyComponent={
            <EmptyState
              title="No notifications"
              message="Campus updates and alerts will appear here."
              icon="notifications-outline"
            />
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  list: {
    paddingTop: spacing.md,
    paddingBottom: spacing.xxl,
    flexGrow: 1,
  },
  headerBlock: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  note: {
    marginTop: spacing.xs,
    fontSize: fontSizes.xs,
    color: colors.textMuted,
  },
});
