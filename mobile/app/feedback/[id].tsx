import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { Alert, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "../../src/components/common/Button";
import { ErrorState } from "../../src/components/common/ErrorState";
import { FilterChips } from "../../src/components/common/FilterChips";
import { Header } from "../../src/components/common/Header";
import { Loader } from "../../src/components/common/Loader";
import { useAuth } from "../../src/context/AuthContext";
import { getErrorMessage } from "../../src/services/apiClient";
import { feedbackService } from "../../src/services/feedbackService";
import { colors, statusColors } from "../../src/theme/colors";
import { fontSizes, fontWeights } from "../../src/theme/fonts";
import { radius, spacing } from "../../src/theme/spacing";
import { Feedback, FeedbackStatus } from "../../src/types";
import { FEEDBACK_STATUS_OPTIONS } from "../../src/utils/constants";
import { formatDateTime } from "../../src/utils/formatDate";

function humanize(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

export default function FeedbackDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user } = useAuth();
  const router = useRouter();
  const [item, setItem] = useState<Feedback | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<FeedbackStatus>("pending");
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await feedbackService.get(String(id));
      setItem(result);
      setStatus(result.status);
    } catch (loadError) {
      setError(getErrorMessage(loadError));
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    void load();
  }, [load]);

  async function handleUpdateStatus() {
    if (!item) return;

    setSaving(true);

    try {
      const updated = await feedbackService.updateStatus(item.id, status);
      setItem(updated);
      Alert.alert("Updated", "Feedback status has been updated.");
    } catch (updateError) {
      Alert.alert("Update failed", getErrorMessage(updateError));
    } finally {
      setSaving(false);
    }
  }

  function handleDelete() {
    if (!item) return;

    Alert.alert("Delete feedback", "This cannot be undone.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await feedbackService.remove(item.id);
            router.replace("/feedback");
          } catch (deleteError) {
            Alert.alert("Delete failed", getErrorMessage(deleteError));
          }
        },
      },
    ]);
  }

  const isAdmin = user?.role === "admin";
  const canDelete = isAdmin || item?.userId === user?.id;

  return (
    <SafeAreaView style={styles.safe}>
      <Header title="Feedback details" showBack />
      {loading ? (
        <Loader message="Loading feedback..." />
      ) : error || !item ? (
        <ErrorState message={error ?? "Feedback not found"} onRetry={load} />
      ) : (
        <ScrollView contentContainerStyle={styles.content}>
          <View
            style={[
              styles.statusBadge,
              {
                backgroundColor:
                  statusColors[item.status] ?? colors.textMuted,
              },
            ]}
          >
            <Text style={styles.statusText}>{humanize(item.status)}</Text>
          </View>

          <Text style={styles.title}>{item.subject}</Text>
          <Text style={styles.meta}>
            {item.category.toUpperCase()} · {formatDateTime(item.createdAt)}
          </Text>
          <Text style={styles.body}>{item.description}</Text>

          {isAdmin ? (
            <View style={styles.manage}>
              <Text style={styles.manageTitle}>Update status</Text>
              <FilterChips
                options={FEEDBACK_STATUS_OPTIONS}
                selected={status}
                onSelect={(value) => setStatus(value as FeedbackStatus)}
              />
              <Button
                title="Save status"
                onPress={handleUpdateStatus}
                loading={saving}
                icon="checkmark-circle-outline"
              />
            </View>
          ) : null}

          {canDelete ? (
            <Button
              title="Delete feedback"
              onPress={handleDelete}
              variant="danger"
              icon="trash-outline"
              style={styles.deleteButton}
            />
          ) : null}
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
    paddingBottom: spacing.xxl,
  },
  statusBadge: {
    alignSelf: "flex-start",
    borderRadius: radius.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: 4,
  },
  statusText: {
    fontSize: fontSizes.xs,
    fontWeight: fontWeights.bold,
    color: colors.white,
  },
  title: {
    marginTop: spacing.md,
    fontSize: fontSizes.xl,
    fontWeight: fontWeights.bold,
    color: colors.text,
  },
  meta: {
    marginTop: spacing.xs,
    fontSize: fontSizes.sm,
    color: colors.textMuted,
  },
  body: {
    marginTop: spacing.lg,
    fontSize: fontSizes.md,
    lineHeight: 24,
    color: colors.text,
  },
  manage: {
    marginTop: spacing.xl,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  manageTitle: {
    fontSize: fontSizes.md,
    fontWeight: fontWeights.bold,
    color: colors.text,
    marginBottom: spacing.md,
  },
  deleteButton: {
    marginTop: spacing.lg,
  },
});
