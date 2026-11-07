import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { EmptyState } from "../../src/components/common/EmptyState";
import { ErrorState } from "../../src/components/common/ErrorState";
import { Header } from "../../src/components/common/Header";
import { Loader } from "../../src/components/common/Loader";
import { useAuth } from "../../src/context/AuthContext";
import { announcementService } from "../../src/services/announcementService";
import { getErrorMessage } from "../../src/services/apiClient";
import { eventService } from "../../src/services/eventService";
import { feedbackService } from "../../src/services/feedbackService";
import { requestService } from "../../src/services/requestService";
import { colors } from "../../src/theme/colors";
import { fontSizes, fontWeights } from "../../src/theme/fonts";
import { radius, spacing } from "../../src/theme/spacing";

interface Stats {
  announcements: number;
  events: number;
  requests: number;
  pendingRequests: number;
  feedback: number;
  pendingFeedback: number;
}

const quickActions = [
  {
    label: "Manage service requests",
    icon: "construct-outline" as const,
    href: "/requests",
  },
  {
    label: "Review feedback",
    icon: "chatbubble-ellipses-outline" as const,
    href: "/feedback",
  },
  {
    label: "New announcement",
    icon: "megaphone-outline" as const,
    href: "/admin/create?type=announcement",
  },
  {
    label: "New event",
    icon: "calendar-outline" as const,
    href: "/admin/create?type=event",
  },
  {
    label: "Emergency contacts",
    icon: "call-outline" as const,
    href: "/emergency-contacts",
  },
];

export default function AdminDashboardScreen() {
  const { user } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const [
        announcements,
        events,
        requests,
        pendingRequests,
        feedback,
        pendingFeedback,
      ] = await Promise.all([
        announcementService.list({ limit: 1 }),
        eventService.list({ limit: 1 }),
        requestService.list({ limit: 1 }),
        requestService.list({ limit: 1, status: "pending" }),
        feedbackService.list({ limit: 1 }),
        feedbackService.list({ limit: 1, status: "pending" }),
      ]);

      setStats({
        announcements: announcements.meta.total,
        events: events.meta.total,
        requests: requests.meta.total,
        pendingRequests: pendingRequests.meta.total,
        feedback: feedback.meta.total,
        pendingFeedback: pendingFeedback.meta.total,
      });
    } catch (loadError) {
      setError(getErrorMessage(loadError));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user?.role === "admin") {
      void load();
    }
  }, [load, user?.role]);

  if (user?.role !== "admin") {
    return (
      <SafeAreaView style={styles.safe}>
        <Header title="Admin dashboard" showBack />
        <EmptyState
          title="Admin access required"
          message="Sign in with an administrator account to manage campus content."
          icon="lock-closed-outline"
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <Header
        title="Admin dashboard"
        subtitle={`Welcome, ${user.fullName}`}
        showBack
      />
      {loading ? (
        <Loader message="Loading dashboard..." />
      ) : error || !stats ? (
        <ErrorState message={error ?? "Could not load dashboard"} onRetry={load} />
      ) : (
        <ScrollView contentContainerStyle={styles.content}>
          <Text style={styles.sectionTitle}>Overview</Text>
          <View style={styles.grid}>
            <StatCard
              label="Announcements"
              value={stats.announcements}
              icon="megaphone-outline"
              color={colors.primary}
            />
            <StatCard
              label="Events"
              value={stats.events}
              icon="calendar-outline"
              color={colors.accent}
            />
            <StatCard
              label="Service requests"
              value={stats.requests}
              hint={`${stats.pendingRequests} pending`}
              icon="construct-outline"
              color={colors.info}
            />
            <StatCard
              label="Feedback"
              value={stats.feedback}
              hint={`${stats.pendingFeedback} pending`}
              icon="chatbubble-ellipses-outline"
              color={colors.success}
            />
          </View>

          <Text style={styles.sectionTitle}>Management</Text>
          <View style={styles.actions}>
            {quickActions.map((action) => (
              <Pressable
                key={action.label}
                onPress={() => router.push(action.href as never)}
                style={({ pressed }) => [
                  styles.action,
                  pressed && styles.pressed,
                ]}
              >
                <View style={styles.actionIcon}>
                  <Ionicons
                    name={action.icon}
                    size={20}
                    color={colors.primary}
                  />
                </View>
                <Text style={styles.actionLabel}>{action.label}</Text>
                <Ionicons
                  name="chevron-forward"
                  size={18}
                  color={colors.textMuted}
                />
              </Pressable>
            ))}
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

function StatCard({
  label,
  value,
  hint,
  icon,
  color,
}: {
  label: string;
  value: number;
  hint?: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
}) {
  return (
    <View style={styles.statCard}>
      <View style={[styles.statIcon, { backgroundColor: color }]}>
        <Ionicons name={icon} size={18} color={colors.white} />
      </View>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
      {hint ? <Text style={styles.statHint}>{hint}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  sectionTitle: {
    fontSize: fontSizes.md,
    fontWeight: fontWeights.bold,
    color: colors.text,
    marginBottom: spacing.md,
    marginTop: spacing.sm,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: spacing.lg,
  },
  statCard: {
    width: "48%",
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.lg,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  statIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.sm,
  },
  statValue: {
    fontSize: fontSizes.xxl,
    fontWeight: fontWeights.bold,
    color: colors.text,
  },
  statLabel: {
    fontSize: fontSizes.sm,
    color: colors.textMuted,
  },
  statHint: {
    marginTop: 2,
    fontSize: fontSizes.xs,
    color: colors.accent,
    fontWeight: fontWeights.medium,
  },
  actions: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: "hidden",
  },
  action: {
    flexDirection: "row",
    alignItems: "center",
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  pressed: {
    backgroundColor: colors.surfaceAlt,
  },
  actionIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primaryLight,
    alignItems: "center",
    justifyContent: "center",
    marginRight: spacing.md,
  },
  actionLabel: {
    flex: 1,
    fontSize: fontSizes.md,
    color: colors.text,
  },
});
