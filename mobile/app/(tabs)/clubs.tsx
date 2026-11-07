import { useCallback } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ClubCard } from "../../src/components/cards/ClubCard";
import { EmptyState } from "../../src/components/common/EmptyState";
import { ErrorState } from "../../src/components/common/ErrorState";
import { Header } from "../../src/components/common/Header";
import { Loader } from "../../src/components/common/Loader";
import { SearchBar } from "../../src/components/common/SearchBar";
import { usePagedList } from "../../src/hooks/usePagedList";
import { clubService } from "../../src/services/clubService";
import { colors } from "../../src/theme/colors";
import { spacing } from "../../src/theme/spacing";
import { Club, ListParams } from "../../src/types";

export default function ClubsScreen() {
  const fetcher = useCallback(
    (params: ListParams) => clubService.list(params),
    [],
  );
  const list = usePagedList<Club>(fetcher, { limit: 10 });

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <Header title="Clubs" subtitle="Student organizations" />
      <SearchBar
        value={list.search}
        onChangeText={list.setSearch}
        placeholder="Search clubs..."
      />

      {list.isLoading ? (
        <Loader message="Loading clubs..." />
      ) : list.error && list.items.length === 0 ? (
        <ErrorState message={list.error} onRetry={list.retry} />
      ) : (
        <FlatList
          data={list.items}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <ClubCard item={item} />}
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
              title="No clubs found"
              message="Try a different search term."
              icon="people-outline"
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
    paddingTop: spacing.xs,
    paddingBottom: spacing.xxl,
    flexGrow: 1,
  },
  footer: {
    paddingVertical: spacing.lg,
  },
});
