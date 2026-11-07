import { useCallback } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { FacilityCategoryCard } from "../../src/components/cards/FacilityCategoryCard";
import { EmptyState } from "../../src/components/common/EmptyState";
import { ErrorState } from "../../src/components/common/ErrorState";
import { FilterChips } from "../../src/components/common/FilterChips";
import { Header } from "../../src/components/common/Header";
import { Loader } from "../../src/components/common/Loader";
import { SearchBar } from "../../src/components/common/SearchBar";
import { usePagedList } from "../../src/hooks/usePagedList";
import { facilityService } from "../../src/services/facilityService";
import { colors } from "../../src/theme/colors";
import { spacing } from "../../src/theme/spacing";
import { Facility, ListParams } from "../../src/types";
import { FACILITY_CATEGORIES } from "../../src/utils/constants";

export default function FacilitiesScreen() {
  const fetcher = useCallback(
    (params: ListParams) => facilityService.list(params),
    [],
  );
  const list = usePagedList<Facility>(fetcher, { limit: 10 });

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <Header title="Facilities" subtitle="Campus services directory" />
      <SearchBar
        value={list.search}
        onChangeText={list.setSearch}
        placeholder="Search facilities..."
      />
      <FilterChips
        options={FACILITY_CATEGORIES}
        selected={list.category}
        onSelect={list.setCategory}
      />

      {list.isLoading ? (
        <Loader message="Loading facilities..." />
      ) : list.error && list.items.length === 0 ? (
        <ErrorState message={list.error} onRetry={list.retry} />
      ) : (
        <FlatList
          data={list.items}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <FacilityCategoryCard item={item} />}
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
              title="No facilities found"
              message="Try a different category or search term."
              icon="business-outline"
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
