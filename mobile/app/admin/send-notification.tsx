import { Ionicons } from "@expo/vector-icons";
import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "../../src/components/common/Button";
import { EmptyState } from "../../src/components/common/EmptyState";
import { FilterChips } from "../../src/components/common/FilterChips";
import { Header } from "../../src/components/common/Header";
import { Input } from "../../src/components/common/Input";
import { Loader } from "../../src/components/common/Loader";
import { useAuth } from "../../src/context/AuthContext";
import { authService } from "../../src/services/authService";
import { getErrorMessage } from "../../src/services/apiClient";
import { notificationService } from "../../src/services/notificationService";
import { colors } from "../../src/theme/colors";
import { fontSizes, fontWeights } from "../../src/theme/fonts";
import { radius, spacing } from "../../src/theme/spacing";
import type { User } from "../../src/types";

type Audience = "all" | "student" | "staff" | "individual";

const audienceOptions = [
  { label: "All students & staff", value: "all" },
  { label: "All students", value: "student" },
  { label: "All staff", value: "staff" },
  { label: "One person", value: "individual" },
];

export default function AdminSendNotificationScreen() {
  const { user } = useAuth();
  const [audience, setAudience] = useState<Audience>("all");
  const [users, setUsers] = useState<User[]>([]);
  const [usersLoading, setUsersLoading] = useState(true);
  const [usersError, setUsersError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [recipientId, setRecipientId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (user?.role !== "admin") {
      setUsersLoading(false);
      return;
    }

    void authService
      .listUsers()
      .then(setUsers)
      .catch((error: unknown) => setUsersError(getErrorMessage(error)))
      .finally(() => setUsersLoading(false));
  }, [user?.role]);

  const recipients = useMemo(
    () =>
      users.filter((recipient) => {
        if (recipient.role === "admin") return false;
        const query = search.trim().toLowerCase();
        return (
          !query ||
          recipient.fullName.toLowerCase().includes(query) ||
          recipient.email.toLowerCase().includes(query)
        );
      }),
    [search, users],
  );
  const selectedRecipient = users.find((recipient) => recipient.id === recipientId);

  if (user?.role !== "admin") {
    return (
      <SafeAreaView style={styles.safe}>
        <Header title="Send notification" showBack />
        <EmptyState
          title="Admin access required"
          message="Only administrators can send notifications."
          icon="lock-closed-outline"
        />
      </SafeAreaView>
    );
  }

  async function handleSend() {
    if (title.trim().length < 2 || message.trim().length < 2) {
      Alert.alert("Complete the message", "Add a title and message before sending.");
      return;
    }

    if (audience === "individual" && !recipientId) {
      Alert.alert("Choose a recipient", "Select a student or staff member.");
      return;
    }

    setSending(true);

    try {
      const result = await notificationService.create({
        title: title.trim(),
        message: message.trim(),
        ...(audience === "individual"
          ? { userId: recipientId ?? undefined }
          : audience === "all"
            ? { broadcast: true }
            : { broadcastRole: audience }),
      });

      const confirmation =
        "broadcast" in result
          ? `Sent to ${result.count} students and staff.`
          : "broadcastRole" in result
          ? `Sent to ${result.count} ${result.broadcastRole === "student" ? "students" : "staff members"}.`
          : `Sent to ${selectedRecipient?.fullName ?? "the selected user"}.`;
      Alert.alert("Notification sent", confirmation);
      setTitle("");
      setMessage("");
      setRecipientId(null);
    } catch (error) {
      Alert.alert("Could not send notification", getErrorMessage(error));
    } finally {
      setSending(false);
    }
  }

  return (
    <SafeAreaView style={styles.safe}>
      <Header title="Send notification" showBack />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.label}>Recipients</Text>
        <FilterChips
          options={audienceOptions}
          selected={audience}
          onSelect={(value) => {
            setAudience(value as Audience);
            setRecipientId(null);
          }}
        />

        {audience === "individual" ? (
          <View style={styles.recipientSection}>
            <Input
              label="Find a student or staff member"
              value={search}
              onChangeText={setSearch}
              placeholder="Search by name or email"
              autoCapitalize="none"
            />
            {usersLoading ? (
              <Loader message="Loading recipients..." />
            ) : usersError ? (
              <Text style={styles.error}>{usersError}</Text>
            ) : recipients.length === 0 ? (
              <Text style={styles.hint}>No matching students or staff.</Text>
            ) : (
              <View style={styles.recipientList}>
                {recipients.slice(0, 20).map((recipient) => {
                  const selected = recipient.id === recipientId;
                  return (
                    <Pressable
                      key={recipient.id}
                      accessibilityRole="button"
                      accessibilityState={{ selected }}
                      onPress={() => setRecipientId(recipient.id)}
                      style={[
                        styles.recipient,
                        selected && styles.selectedRecipient,
                      ]}
                    >
                      <View style={styles.recipientText}>
                        <Text style={styles.recipientName}>
                          {recipient.fullName}
                        </Text>
                        <Text style={styles.recipientDetail}>
                          {recipient.email} · {recipient.role}
                        </Text>
                      </View>
                      {selected ? (
                        <Ionicons
                          name="checkmark-circle"
                          size={22}
                          color={colors.primary}
                        />
                      ) : null}
                    </Pressable>
                  );
                })}
                {recipients.length > 20 ? (
                  <Text style={styles.hint}>
                    Showing 20 matches. Refine your search to find others.
                  </Text>
                ) : null}
              </View>
            )}
          </View>
        ) : (
          <Text style={styles.hint}>
            {audience === "all"
              ? "This message will go to all students and staff accounts."
              : `This message will go to all ${audience === "student" ? "students" : "staff"} accounts.`}
          </Text>
        )}

        <Input
          label="Title"
          value={title}
          onChangeText={setTitle}
          placeholder="Notification title"
        />
        <Input
          label="Message"
          value={message}
          onChangeText={setMessage}
          placeholder="Write your message"
          multiline
        />
        <Button
          title="Send notification"
          onPress={() => void handleSend()}
          loading={sending}
          icon="paper-plane-outline"
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    paddingTop: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  label: {
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.medium,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  recipientSection: {
    marginTop: spacing.md,
  },
  recipientList: {
    marginTop: -spacing.md,
    marginBottom: spacing.lg,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    overflow: "hidden",
  },
  recipient: {
    flexDirection: "row",
    alignItems: "center",
    minHeight: 62,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  selectedRecipient: {
    backgroundColor: colors.primaryLight,
  },
  recipientText: {
    flex: 1,
  },
  recipientName: {
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.medium,
    color: colors.text,
  },
  recipientDetail: {
    marginTop: 2,
    fontSize: fontSizes.xs,
    color: colors.textMuted,
  },
  hint: {
    marginBottom: spacing.md,
    fontSize: fontSizes.xs,
    color: colors.textMuted,
  },
  error: {
    marginBottom: spacing.md,
    fontSize: fontSizes.sm,
    color: colors.danger,
  },
});
