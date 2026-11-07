import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useCallback } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { EmptyState } from "../../src/components/common/EmptyState";
import { ErrorState } from "../../src/components/common/ErrorState";
import { FilterChips } from "../../src/components/common/FilterChips";
import { Header } from "../../src/components/common/Header";
import { Loader } from "../../src/components/common/Loader";
import { SearchBar } from "../../src/components/common/SearchBar";
import { usePagedList } from "../../src/hooks/usePagedList";
import { feedbackService } from "../../src/services/feedbackService";
import { colors, statusColors } from "../../src/theme/colors";
import { fontSizes, fontWeights } from "../../src/theme/fonts";
import { radius, spacing } from "../../src/theme/spacing";
import { Feedback, ListParams } from "../../src/types";
import { FEEDBACK_STATUS_OPTIONS } from "../../src/utils/constants";
import { formatRelative } from "../../src/utils/formatDate";

const statusFilters = [{ label: "All", value: "" }, ...FEEDBACK_STATUS_OPTIONS];

function humanize(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

export default function FeedbackScreen() {
  const router = useRouter();
  const fetcher = useCallback(
    (params: ListParams) =>
      feedbackService.list({
        page: params.page,
        limit: params.limit,
        search: params.search,
        status: params.category || undefined,
      }),
    [],
  );
  const list = usePagedList<Feedback>(fetcher, { limit: 10 });

  return (
    <SafeAreaView style={styles.safe}>
      <Header
        title="Feedback & complaints"
        subtitle="Share your experience"
        showBack
        right={
          <Pressable onPress={() => router.push("/feedback/new")} hitSlop={10}>
            <Ionicons name="add-circle" size={28} color={colors.primary} />
          </Pressable>
        }
      />
      <SearchBar
        value={list.search}
        onChangeText={list.setSearch}
        placeholder="Search feedback..."
      />
      <FilterChips
        options={statusFilters}
        selected={list.category}
        onSelect={list.setCategory}
      />

      {list.isLoading ? (
        <Loader message="Loading feedback..." />
      ) : list.error && list.items.length === 0 ? (
        <ErrorState message={list.error} onRetry={list.retry} />
      ) : (
        <FlatList
          data={list.items}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Pressable
              onPress={() => router.push(`/feedback/${item.id}`)}
              style={({ pressed }) => [styles.card, pressed && styles.pressed]}
            >
              <View style={styles.topRow}>
                <Text style={styles.title} numberOfLines={1}>
                  {item.subject}
                </Text>
                <View
                  style={[
                    styles.badge,
                    {
                      backgroundColor:
                        statusColors[item.status] ?? colors.textMuted,
                    },
                  ]}
                >
                  <Text style={styles.badgeText}>
                    {humanize(item.status)}
                  </Text>
                </View>
              </View>
              <Text style={styles.description} numberOfLines={2}>
                {item.description}
              </Text>
              <View style={styles.footer}>
                <Text style={styles.meta}>{item.category.toUpperCase()}</Text>
                <Text style={styles.meta}>
                  {formatRelative(item.createdAt)}
                </Text>
              </View>
            </Pressable>
          )}
          contentContainerStyle={styles.list}
          refreshControl={
            <RefreshControl
              refreshing={list.isRefreshing}
              onRefresh={list.refresh}
              colors={[colors.primary]}
            />
          }
          onEndReached={() => void list.loadMore()}
          onEndReachedThreshold={0.4}
          ListEmptyComponent={
            <EmptyState
              title="No feedback yet"
              message="Your feedback and complaints will appear here."
              icon="chatbubble-ellipses-outline"
            />
          }
          ListFooterComponent={
            list.isLoadingMore ? (
              <ActivityIndicator
                color={colors.primary}
                style={styles.footerLoader}
              />
            ) : null
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
    paddingBottom: spacing.xxl,
    flexGrow: 1,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.lg,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  pressed: {
    opacity: 0.7,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.sm,
  },
  title: {
    flex: 1,
    fontSize: fontSizes.md,
    fontWeight: fontWeights.bold,
    color: colors.text,
  },
  badge: {
    borderRadius: radius.pill,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
  },
  badgeText: {
    fontSize: fontSizes.xs,
    fontWeight: fontWeights.medium,
    color: colors.white,
  },
  description: {
    marginTop: spacing.xs,
    fontSize: fontSizes.sm,
    color: colors.textMuted,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: spacing.md,
  },
  meta: {
    fontSize: fontSizes.xs,
    color: colors.textMuted,
  },
  footerLoader: {
    paddingVertical: spacing.lg,
  },
});
