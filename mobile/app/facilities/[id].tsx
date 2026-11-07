import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "../../src/components/common/Button";
import { ErrorState } from "../../src/components/common/ErrorState";
import { Header } from "../../src/components/common/Header";
import { Loader } from "../../src/components/common/Loader";
import { getErrorMessage } from "../../src/services/apiClient";
import { facilityService } from "../../src/services/facilityService";
import { colors } from "../../src/theme/colors";
import { fontSizes, fontWeights } from "../../src/theme/fonts";
import { radius, spacing } from "../../src/theme/spacing";
import { Facility } from "../../src/types";

export default function FacilityDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [item, setItem] = useState<Facility | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await facilityService.get(String(id));
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
      <Header title="Facility" showBack />
      {loading ? (
        <Loader message="Loading facility..." />
      ) : error || !item ? (
        <ErrorState message={error ?? "Facility not found"} onRetry={load} />
      ) : (
        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{item.category.toUpperCase()}</Text>
          </View>
          <Text style={styles.title}>{item.name}</Text>
          <Text style={styles.body}>{item.description}</Text>

          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Ionicons
                name="location-outline"
                size={18}
                color={colors.primary}
              />
              <Text style={styles.infoText}>
                {Number(item.latitude).toFixed(5)},{" "}
                {Number(item.longitude).toFixed(5)}
              </Text>
            </View>
            {item.contact ? (
              <Pressable
                style={styles.infoRow}
                onPress={() => void Linking.openURL(`tel:${item.contact}`)}
              >
                <Ionicons name="call-outline" size={18} color={colors.primary} />
                <Text style={styles.linkText}>{item.contact}</Text>
              </Pressable>
            ) : null}
          </View>

          <Button
            title="View on campus map"
            onPress={() => router.push("/map")}
            icon="map-outline"
            style={styles.mapButton}
          />
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
  },
  body: {
    marginTop: spacing.md,
    fontSize: fontSizes.md,
    lineHeight: 24,
    color: colors.text,
  },
  infoCard: {
    marginTop: spacing.lg,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing.md,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  infoText: {
    marginLeft: spacing.sm,
    fontSize: fontSizes.sm,
    color: colors.text,
  },
  linkText: {
    marginLeft: spacing.sm,
    fontSize: fontSizes.sm,
    color: colors.primary,
    fontWeight: fontWeights.medium,
  },
  mapButton: {
    marginTop: spacing.lg,
  },
});
