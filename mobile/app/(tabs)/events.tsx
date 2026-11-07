import { useCallback } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { EventCard } from "../../src/components/cards/EventCard";
import { EmptyState } from "../../src/components/common/EmptyState";
import { ErrorState } from "../../src/components/common/ErrorState";
import { FilterChips } from "../../src/components/common/FilterChips";
import { Header } from "../../src/components/common/Header";
import { Loader } from "../../src/components/common/Loader";
import { SearchBar } from "../../src/components/common/SearchBar";
import { usePagedList } from "../../src/hooks/usePagedList";
import { eventService } from "../../src/services/eventService";
import { colors } from "../../src/theme/colors";
import { spacing } from "../../src/theme/spacing";
import { EventItem, ListParams } from "../../src/types";
import { EVENT_CATEGORIES } from "../../src/utils/constants";

export default function EventsScreen() {
  const fetcher = useCallback(
    (params: ListParams) => eventService.list({ ...params, upcoming: true }),
    [],
  );
  const list = usePagedList<EventItem>(fetcher, { limit: 10 });

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <Header title="Events" subtitle="Upcoming activities on campus" />
      <SearchBar
        value={list.search}
        onChangeText={list.setSearch}
        placeholder="Search events..."
      />
      <FilterChips
        options={EVENT_CATEGORIES}
        selected={list.category}
        onSelect={list.setCategory}
      />

      {list.isLoading ? (
        <Loader message="Loading events..." />
      ) : list.error && list.items.length === 0 ? (
        <ErrorState message={list.error} onRetry={list.retry} />
      ) : (
        <FlatList
          data={list.items}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <EventCard item={item} />}
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
              title="No upcoming events"
              message="There are no events matching your search."
              icon="calendar-outline"
            />
          }
          ListFooterComponent={
            list.isLoadingMore ? (
              <ActivityIndicator
                color={colors.primary}
                style={styles.footer}
              />
            ) : undefined
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
