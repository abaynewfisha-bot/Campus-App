import { useRouter } from "expo-router";
import { useState } from "react";
import { ScrollView, StyleSheet, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Header } from "../../src/components/common/Header";
import { FeedbackForm } from "../../src/components/forms/FeedbackForm";
import { getErrorMessage } from "../../src/services/apiClient";
import { feedbackService } from "../../src/services/feedbackService";
import { colors } from "../../src/theme/colors";
import { fontSizes } from "../../src/theme/fonts";
import { spacing } from "../../src/theme/spacing";
import { CreateFeedbackInput } from "../../src/types";

export default function NewFeedbackScreen() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(input: CreateFeedbackInput) {
    setSubmitting(true);
    setError(null);

    try {
      await feedbackService.create(input);
      router.replace("/feedback");
    } catch (submitError) {
      setError(getErrorMessage(submitError));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <SafeAreaView style={styles.safe}>
      <Header title="New feedback" showBack />
      <ScrollView contentContainerStyle={styles.content}>
        {error ? <Text style={styles.error}>{error}</Text> : null}
        <FeedbackForm onSubmit={handleSubmit} submitting={submitting} />
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
    paddingBottom: spacing.xxl,
  },
  error: {
    color: colors.danger,
    fontSize: fontSizes.sm,
    marginBottom: spacing.md,
  },
});
