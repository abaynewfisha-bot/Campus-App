import { Ionicons } from "@expo/vector-icons";
import { useCallback, useEffect, useState } from "react";
import {
  FlatList,
  Linking,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { EmptyState } from "../src/components/common/EmptyState";
import { ErrorState } from "../src/components/common/ErrorState";
import { Header } from "../src/components/common/Header";
import { Loader } from "../src/components/common/Loader";
import { getErrorMessage } from "../src/services/apiClient";
import { emergencyContactService } from "../src/services/emergencyContactService";
import { colors } from "../src/theme/colors";
import { fontSizes, fontWeights } from "../src/theme/fonts";
import { radius, spacing } from "../src/theme/spacing";
import { EmergencyContact } from "../src/types";

export default function EmergencyContactsScreen() {
  const [contacts, setContacts] = useState<EmergencyContact[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async (mode: "initial" | "refresh" = "initial") => {
    if (mode === "initial") setLoading(true);
    if (mode === "refresh") setRefreshing(true);
    setError(null);

    try {
      const result = await emergencyContactService.list();
      setContacts(result);
    } catch (loadError) {
      setError(getErrorMessage(loadError));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <SafeAreaView style={styles.safe}>
      <Header
        title="Emergency contacts"
        subtitle="Campus safety and support"
        showBack
      />

      {loading ? (
        <Loader message="Loading contacts..." />
      ) : error && contacts.length === 0 ? (
        <ErrorState message={error} onRetry={() => void load()} />
      ) : (
        <FlatList
          data={contacts}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={styles.iconBox}>
                <Ionicons
                  name="shield-checkmark-outline"
                  size={22}
                  color={colors.danger}
                />
              </View>
              <View style={styles.content}>
                <Text style={styles.department}>{item.department}</Text>
                {item.description ? (
                  <Text style={styles.description}>{item.description}</Text>
                ) : null}
                <Text style={styles.phone}>{item.phone}</Text>
              </View>
              <Pressable
                style={styles.callButton}
                onPress={() => void Linking.openURL(`tel:${item.phone}`)}
              >
                <Ionicons name="call" size={20} color={colors.white} />
              </Pressable>
            </View>
          )}
          contentContainerStyle={styles.list}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => void load("refresh")}
              colors={[colors.primary]}
            />
          }
          ListHeaderComponent={
            <View style={styles.banner}>
              <Ionicons
                name="warning-outline"
                size={20}
                color={colors.white}
              />
              <Text style={styles.bannerText}>
                In a life-threatening emergency, call campus security
                immediately.
              </Text>
            </View>
          }
          ListEmptyComponent={
            <EmptyState
              title="No contacts available"
              message="Emergency contact numbers will be listed here."
              icon="call-outline"
            />
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  list: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
    flexGrow: 1,
  },
  banner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.danger,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  bannerText: {
    flex: 1,
    marginLeft: spacing.sm,
    fontSize: fontSizes.sm,
    color: colors.white,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.lg,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#fee2e2",
    alignItems: "center",
    justifyContent: "center",
    marginRight: spacing.md,
  },
  content: {
    flex: 1,
  },
  department: {
    fontSize: fontSizes.md,
    fontWeight: fontWeights.bold,
    color: colors.text,
  },
  description: {
    marginTop: 2,
    fontSize: fontSizes.sm,
    color: colors.textMuted,
  },
  phone: {
    marginTop: spacing.xs,
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.medium,
    color: colors.primary,
  },
  callButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.success,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: spacing.sm,
  },
});
