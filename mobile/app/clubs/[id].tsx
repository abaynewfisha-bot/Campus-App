import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { Linking, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ErrorState } from "../../src/components/common/ErrorState";
import { Header } from "../../src/components/common/Header";
import { Loader } from "../../src/components/common/Loader";
import { getErrorMessage } from "../../src/services/apiClient";
import { clubService } from "../../src/services/clubService";
import { colors } from "../../src/theme/colors";
import { fontSizes, fontWeights } from "../../src/theme/fonts";
import { radius, spacing } from "../../src/theme/spacing";
import { Club } from "../../src/types";

export default function ClubDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [item, setItem] = useState<Club | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await clubService.get(String(id));
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
      <Header title="Club" showBack />
      {loading ? (
        <Loader message="Loading club..." />
      ) : error || !item ? (
        <ErrorState message={error ?? "Club not found"} onRetry={load} />
      ) : (
        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.avatar}>
            <Ionicons name="people" size={36} color={colors.primaryDark} />
          </View>
          <Text style={styles.title}>{item.name}</Text>
          <Text style={styles.body}>{item.description}</Text>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Activities</Text>
            <Text style={styles.sectionBody}>
              {item.activities ?? "No activities listed yet."}
            </Text>
          </View>

          <Pressable
            style={styles.contact}
            onPress={() => void Linking.openURL(`mailto:${item.contactEmail}`)}
          >
            <Ionicons name="mail" size={20} color={colors.white} />
            <Text style={styles.contactText}>{item.contactEmail}</Text>
          </Pressable>
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
    alignItems: "center",
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primaryLight,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    marginTop: spacing.md,
    fontSize: fontSizes.xxl,
    fontWeight: fontWeights.bold,
    color: colors.text,
    textAlign: "center",
  },
  body: {
    marginTop: spacing.md,
    fontSize: fontSizes.md,
    lineHeight: 24,
    color: colors.text,
    textAlign: "center",
  },
  section: {
    alignSelf: "stretch",
    marginTop: spacing.xl,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  sectionTitle: {
    fontSize: fontSizes.md,
    fontWeight: fontWeights.bold,
    color: colors.text,
  },
  sectionBody: {
    marginTop: spacing.xs,
    fontSize: fontSizes.sm,
    color: colors.textMuted,
    lineHeight: 20,
  },
  contact: {
    alignSelf: "stretch",
    marginTop: spacing.lg,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    padding: spacing.md,
  },
  contactText: {
    marginLeft: spacing.sm,
    color: colors.white,
    fontSize: fontSizes.md,
    fontWeight: fontWeights.medium,
  },
});
