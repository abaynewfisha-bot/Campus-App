import { Ionicons } from "@expo/vector-icons";
import { type Href, useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AnnouncementCard } from "../../src/components/cards/AnnouncementCard";
import { EventCard } from "../../src/components/cards/EventCard";
import { Loader } from "../../src/components/common/Loader";
import { useAuth } from "../../src/context/AuthContext";
import { useNetwork } from "../../src/context/NetworkContext";
import { announcementService } from "../../src/services/announcementService";
import { eventService } from "../../src/services/eventService";
import { colors } from "../../src/theme/colors";
import { fontSizes, fontWeights } from "../../src/theme/fonts";
import { radius, spacing } from "../../src/theme/spacing";
import { Announcement, EventItem } from "../../src/types";

interface QuickAction {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  route: Href;
  adminOnly?: boolean;
  studentStaffOnly?: boolean;
}

const actions: QuickAction[] = [
  { label: "News", icon: "megaphone", route: "/announcements" },
  { label: "Events", icon: "calendar", route: "/events" },
  { label: "Clubs", icon: "people", route: "/clubs" },
  { label: "Facilities", icon: "business", route: "/facilities" },
  { label: "Campus Map", icon: "map", route: "/map" },
  { label: "Requests", icon: "construct", route: "/requests" },
  { label: "Feedback", icon: "chatbubble-ellipses", route: "/feedback" },
  { label: "Message admin", icon: "mail", route: "/contact-admin", studentStaffOnly: true },
  { label: "Emergency", icon: "call", route: "/emergency-contacts" },
  { label: "Alerts", icon: "notifications", route: "/notifications" },
  { label: "Admin", icon: "shield-checkmark", route: "/admin/dashboard", adminOnly: true },
];

export default function HomeScreen() {
  const { user } = useAuth();
  const { isConnected } = useNetwork();
  const router = useRouter();
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      const [announcementResult, eventResult] = await Promise.all([
        announcementService.list({ limit: 3 }),
        eventService.list({ limit: 3, upcoming: true }),
      ]);
      setAnnouncements(announcementResult.data);
      setEvents(eventResult.data);
    } catch {
      setAnnouncements([]);
      setEvents([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const firstName = user?.fullName.split(" ")[0] ?? "there";
  const visibleActions = actions.filter(
    (action) =>
      (!action.adminOnly || user?.role === "admin") &&
      (!action.studentStaffOnly ||
        user?.role === "student" ||
        user?.role === "staff"),
  );

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <View style={styles.header}>
        <View style={styles.headerTexts}>
          <Text style={styles.greeting}>Hello, {firstName}</Text>
          <Text style={styles.subtitle}>
            {user?.role === "admin"
              ? "Campus administrator"
              : user?.role === "staff"
                ? "University staff"
                : "Welcome to your campus"}
          </Text>
        </View>
        <Pressable
          onPress={() => router.push("/notifications")}
          style={styles.bell}
        >
          <Ionicons
            name="notifications-outline"
            size={24}
            color={colors.text}
          />
        </Pressable>
      </View>

      {!isConnected ? (
        <View style={styles.offline}>
          <Ionicons name="cloud-offline-outline" size={16} color={colors.white} />
          <Text style={styles.offlineText}>
            You are offline. Showing limited information.
          </Text>
        </View>
      ) : null}

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.sectionTitle}>Quick access</Text>
        <View style={styles.grid}>
          {visibleActions.map((action) => (
            <Pressable
              key={action.label}
              onPress={() => router.push(action.route)}
              style={({ pressed }) => [styles.action, pressed && styles.pressed]}
            >
              <View style={styles.actionIcon}>
                <Ionicons
                  name={action.icon}
                  size={22}
                  color={colors.primaryDark}
                />
              </View>
              <Text style={styles.actionLabel}>{action.label}</Text>
            </Pressable>
          ))}
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Latest announcements</Text>
          <Pressable onPress={() => router.push("/announcements")}>
            <Text style={styles.seeAll}>See all</Text>
          </Pressable>
        </View>

        {loading ? (
          <Loader message="Loading campus updates..." />
        ) : announcements.length === 0 ? (
          <Text style={styles.emptyText}>No announcements yet.</Text>
        ) : (
          announcements.map((item) => (
            <AnnouncementCard key={item.id} item={item} />
          ))
        )}

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Upcoming events</Text>
          <Pressable onPress={() => router.push("/events")}>
            <Text style={styles.seeAll}>See all</Text>
          </Pressable>
        </View>

        {loading ? null : events.length === 0 ? (
          <Text style={styles.emptyText}>No upcoming events.</Text>
        ) : (
          events.map((item) => <EventCard key={item.id} item={item} />)
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTexts: {
    flex: 1,
  },
  greeting: {
    fontSize: fontSizes.xl,
    fontWeight: fontWeights.bold,
    color: colors.text,
  },
  subtitle: {
    marginTop: 2,
    fontSize: fontSizes.sm,
    color: colors.textMuted,
  },
  bell: {
    padding: spacing.sm,
  },
  offline: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.danger,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  offlineText: {
    marginLeft: spacing.sm,
    color: colors.white,
    fontSize: fontSizes.xs,
    flex: 1,
  },
  content: {
    paddingBottom: spacing.xxl,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.lg,
    marginTop: spacing.lg,
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.bold,
    color: colors.text,
    paddingHorizontal: spacing.lg,
    marginTop: spacing.lg,
    marginBottom: spacing.md,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
  },
  action: {
    width: "30%",
    alignItems: "center",
    paddingVertical: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  pressed: {
    opacity: 0.7,
  },
  actionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primaryLight,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.xs,
  },
  actionLabel: {
    fontSize: fontSizes.xs,
    fontWeight: fontWeights.medium,
    color: colors.text,
    textAlign: "center",
  },
  seeAll: {
    fontSize: fontSizes.sm,
    color: colors.primary,
    fontWeight: fontWeights.medium,
  },
  emptyText: {
    paddingHorizontal: spacing.lg,
    color: colors.textMuted,
    fontSize: fontSizes.sm,
  },
});
