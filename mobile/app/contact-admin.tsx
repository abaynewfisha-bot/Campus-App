import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert, ScrollView, StyleSheet, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "../src/components/common/Button";
import { EmptyState } from "../src/components/common/EmptyState";
import { Header } from "../src/components/common/Header";
import { Input } from "../src/components/common/Input";
import { useAuth } from "../src/context/AuthContext";
import { getErrorMessage } from "../src/services/apiClient";
import { notificationService } from "../src/services/notificationService";
import { colors } from "../src/theme/colors";
import { fontSizes } from "../src/theme/fonts";
import { spacing } from "../src/theme/spacing";

export default function ContactAdminScreen() {
  const { user } = useAuth();
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  if (user?.role !== "student" && user?.role !== "staff") {
    return (
      <SafeAreaView style={styles.safe}>
        <Header title="Message admin" showBack />
        <EmptyState
          title="Student or staff access required"
          message="Only students and staff can send messages to the admin team."
          icon="lock-closed-outline"
        />
      </SafeAreaView>
    );
  }

  async function handleSend() {
    if (title.trim().length < 2 || message.trim().length < 2) {
      Alert.alert("Complete your message", "Enter a subject and message.");
      return;
    }

    setSending(true);
    try {
      const result = await notificationService.messageAdmins({
        title: title.trim(),
        message: message.trim(),
      });
      Alert.alert(
        "Message sent",
        `Your message was sent to ${result.sentTo === 1 ? "the admin" : `${result.sentTo} admins`}.`,
        [{ text: "OK", onPress: () => router.back() }],
      );
    } catch (error) {
      Alert.alert("Could not send message", getErrorMessage(error));
    } finally {
      setSending(false);
    }
  }

  return (
    <SafeAreaView style={styles.safe}>
      <Header title="Message admin" showBack />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.note}>
          Your message will appear in the admin notification inbox. Replies are
          not supported.
        </Text>
        <Input
          label="Subject"
          value={title}
          onChangeText={setTitle}
          placeholder="What is your message about?"
        />
        <Input
          label="Message"
          value={message}
          onChangeText={setMessage}
          placeholder="Write your message to the admin team"
          multiline
        />
        <Button
          title="Send message"
          onPress={() => void handleSend()}
          loading={sending}
          icon="send-outline"
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
    padding: spacing.lg,
    paddingTop: spacing.xl,
  },
  note: {
    marginBottom: spacing.lg,
    fontSize: fontSizes.sm,
    color: colors.textMuted,
  },
});
