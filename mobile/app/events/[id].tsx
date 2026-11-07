import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ErrorState } from "../../src/components/common/ErrorState";
import { Header } from "../../src/components/common/Header";
import { Loader } from "../../src/components/common/Loader";
import { getErrorMessage } from "../../src/services/apiClient";
import { eventService } from "../../src/services/eventService";
import { colors } from "../../src/theme/colors";
import { fontSizes, fontWeights } from "../../src/theme/fonts";
import { radius, spacing } from "../../src/theme/spacing";
import { EventItem } from "../../src/types";
import { formatDateTime } from "../../src/utils/formatDate";

export default function EventDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [item, setItem] = useState<EventItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await eventService.get(String(id));
      setItem(result);
    } catch (loadError) {
      setError(getErrorMessage(loadError));
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <SafeAreaView style={styles.safe}>
      <Header title="Event" showBack />
      {loading ? (
        <Loader message="Loading event..." />
      ) : error || !item ? (
        <ErrorState message={error ?? "Event not found"} onRetry={load} />
      ) : (
        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{item.category.toUpperCase()}</Text>
          </View>
          <Text style={styles.title}>{item.title}</Text>

          <View style={styles.infoRow}>
            <Ionicons name="calendar-outline" size={18} color={colors.primary} />
            <Text style={styles.infoText}>
              {formatDateTime(item.startDate)} - {formatDateTime(item.endDate)}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Ionicons name="location-outline" size={18} color={colors.primary} />
            <Text style={styles.infoText}>{item.location}</Text>
          </View>

          <Text style={styles.body}>{item.description}</Text>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.lg,
  },
  badge: {
    alignSelf: "flex-start",
    backgroundColor: colors.primaryLight,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: 4,
  },
  badgeText: {
    fontSize: fontSizes.xs,
    fontWeight: fontWeights.bold,
    color: colors.primaryDark,
  },
  title: {
    marginTop: spacing.md,
    fontSize: fontSizes.xxl,
    fontWeight: fontWeights.bold,
    color: colors.text,
    marginBottom: spacing.md,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: spacing.sm,
  },
  infoText: {
    marginLeft: spacing.sm,
    fontSize: fontSizes.sm,
    color: colors.text,
    flex: 1,
  },
  body: {
    marginTop: spacing.lg,
    fontSize: fontSizes.md,
    lineHeight: 24,
    color: colors.text,
  },
});
