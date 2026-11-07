import { useCallback } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AnnouncementCard } from "../../src/components/cards/AnnouncementCard";
import { EmptyState } from "../../src/components/common/EmptyState";
import { ErrorState } from "../../src/components/common/ErrorState";
import { FilterChips } from "../../src/components/common/FilterChips";
import { Header } from "../../src/components/common/Header";
import { Loader } from "../../src/components/common/Loader";
import { SearchBar } from "../../src/components/common/SearchBar";
import { usePagedList } from "../../src/hooks/usePagedList";
import { announcementService } from "../../src/services/announcementService";
import { colors } from "../../src/theme/colors";
import { spacing } from "../../src/theme/spacing";
import { Announcement, ListParams } from "../../src/types";
import { ANNOUNCEMENT_CATEGORIES } from "../../src/utils/constants";

export default function AnnouncementsScreen() {
  const fetcher = useCallback(
    (params: ListParams) => announcementService.list(params),
    [],
  );
  const list = usePagedList<Announcement>(fetcher, { limit: 10 });

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <Header title="Announcements" subtitle="Campus news and updates" />
      <SearchBar
        value={list.search}
        onChangeText={list.setSearch}
        placeholder="Search announcements..."
      />
      <FilterChips
        options={ANNOUNCEMENT_CATEGORIES}
        selected={list.category}
        onSelect={list.setCategory}
      />

      {list.isLoading ? (
        <Loader message="Loading announcements..." />
      ) : list.error && list.items.length === 0 ? (
        <ErrorState message={list.error} onRetry={list.retry} />
      ) : (
        <FlatList
          data={list.items}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <AnnouncementCard item={item} />}
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
              title="No announcements"
              message="Check back later for campus updates."
              icon="megaphone-outline"
            />
          }
          ListFooterComponent={
            list.isLoadingMore ? (
              <ActivityIndicator
                color={colors.primary}
                style={styles.footer}
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
  footer: {
    paddingVertical: spacing.lg,
  },
});
