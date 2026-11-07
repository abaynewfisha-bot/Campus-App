import { useRouter } from "expo-router";
import { useState } from "react";
import { ScrollView, StyleSheet, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Header } from "../../src/components/common/Header";
import { ServiceRequestForm } from "../../src/components/forms/ServiceRequestForm";
import { getErrorMessage } from "../../src/services/apiClient";
import { requestService } from "../../src/services/requestService";
import { colors } from "../../src/theme/colors";
import { fontSizes } from "../../src/theme/fonts";
import { spacing } from "../../src/theme/spacing";
import { CreateRequestInput } from "../../src/types";

export default function NewRequestScreen() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(input: CreateRequestInput) {
    setSubmitting(true);
    setError(null);

    try {
      await requestService.create(input);
      router.replace("/requests");
    } catch (submitError) {
      setError(getErrorMessage(submitError));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <SafeAreaView style={styles.safe}>
      <Header title="New service request" showBack />
      <ScrollView contentContainerStyle={styles.content}>
        {error ? <Text style={styles.error}>{error}</Text> : null}
        <ServiceRequestForm onSubmit={handleSubmit} submitting={submitting} />
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
