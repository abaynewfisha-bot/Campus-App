import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "../../src/components/common/Button";
import { ErrorState } from "../../src/components/common/ErrorState";
import { FilterChips } from "../../src/components/common/FilterChips";
import { Header } from "../../src/components/common/Header";
import { Loader } from "../../src/components/common/Loader";
import { useAuth } from "../../src/context/AuthContext";
import { getErrorMessage } from "../../src/services/apiClient";
import { requestService } from "../../src/services/requestService";
import { colors, statusColors } from "../../src/theme/colors";
import { fontSizes, fontWeights } from "../../src/theme/fonts";
import { radius, spacing } from "../../src/theme/spacing";
import { RequestStatus, ServiceRequest } from "../../src/types";
import { REQUEST_STATUS_OPTIONS } from "../../src/utils/constants";
import { formatDateTime } from "../../src/utils/formatDate";

function humanize(value: string): string {
  return value
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export default function RequestDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user } = useAuth();
  const router = useRouter();
  const [item, setItem] = useState<ServiceRequest | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<RequestStatus>("pending");
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await requestService.get(String(id));
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
      const updated = await requestService.updateStatus(item.id, status);
      setItem(updated);
      Alert.alert("Updated", "The request status has been updated.");
    } catch (updateError) {
      Alert.alert("Update failed", getErrorMessage(updateError));
    } finally {
      setSaving(false);
    }
  }

  function handleDelete() {
    if (!item) return;

    Alert.alert("Delete request", "This cannot be undone.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await requestService.remove(item.id);
            router.replace("/requests");
          } catch (deleteError) {
            Alert.alert("Delete failed", getErrorMessage(deleteError));
          }
        },
      },
    ]);
  }

  const canManage = user?.role === "staff" || user?.role === "admin";
  const canDelete = user?.role === "admin" || item?.userId === user?.id;

  return (
    <SafeAreaView style={styles.safe}>
      <Header title="Request details" showBack />
      {loading ? (
        <Loader message="Loading request..." />
      ) : error || !item ? (
        <ErrorState message={error ?? "Request not found"} onRetry={load} />
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

          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.meta}>
            {item.category.toUpperCase()} · {formatDateTime(item.createdAt)}
          </Text>
          {item.location ? (
            <Text style={styles.meta}>Location: {item.location}</Text>
          ) : null}

          <Text style={styles.body}>{item.description}</Text>

          {canManage ? (
            <View style={styles.manage}>
              <Text style={styles.manageTitle}>Update status</Text>
              <FilterChips
                options={REQUEST_STATUS_OPTIONS}
                selected={status}
                onSelect={(value) => setStatus(value as RequestStatus)}
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
              title="Delete request"
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
