import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useCallback } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { RequestCard } from "../../src/components/cards/RequestCard";
import { EmptyState } from "../../src/components/common/EmptyState";
import { ErrorState } from "../../src/components/common/ErrorState";
import { FilterChips } from "../../src/components/common/FilterChips";
import { Header } from "../../src/components/common/Header";
import { Loader } from "../../src/components/common/Loader";
import { SearchBar } from "../../src/components/common/SearchBar";
import { usePagedList } from "../../src/hooks/usePagedList";
import { requestService } from "../../src/services/requestService";
import { colors } from "../../src/theme/colors";
import { spacing } from "../../src/theme/spacing";
import { ListParams, ServiceRequest } from "../../src/types";
import { REQUEST_STATUS_OPTIONS } from "../../src/utils/constants";

const statusFilters = [{ label: "All", value: "" }, ...REQUEST_STATUS_OPTIONS];

export default function RequestsScreen() {
  const router = useRouter();
  const fetcher = useCallback(
    (params: ListParams) =>
      requestService.list({
        page: params.page,
        limit: params.limit,
        search: params.search,
        status: params.category || undefined,
      }),
    [],
  );
  const list = usePagedList<ServiceRequest>(fetcher, { limit: 10 });

  return (
    <SafeAreaView style={styles.safe}>
      <Header
        title="Service requests"
        subtitle="Track maintenance and IT issues"
        showBack
        right={
          <Pressable onPress={() => router.push("/requests/new")} hitSlop={10}>
            <Ionicons name="add-circle" size={28} color={colors.primary} />
          </Pressable>
        }
      />
      <SearchBar
        value={list.search}
        onChangeText={list.setSearch}
        placeholder="Search requests..."
      />
      <FilterChips
        options={statusFilters}
        selected={list.category}
        onSelect={list.setCategory}
      />

      {list.isLoading ? (
        <Loader message="Loading requests..." />
      ) : list.error && list.items.length === 0 ? (
        <ErrorState message={list.error} onRetry={list.retry} />
      ) : (
        <FlatList
          data={list.items}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <RequestCard item={item} />}
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
              title="No service requests"
              message="Submit a request and track its progress here."
              icon="construct-outline"
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
