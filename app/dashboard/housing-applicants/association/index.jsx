import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
  useColorScheme
} from "react-native";
import { Colors } from "../../../../constants/Colors";
import { agencyService } from "../../../../components/API/AgenciesService";
import AssociationList from "../../../../components/ThemendList/ThemedAssociationList";
import ThemedView from "../../../../components/ThemedForm/ThemedView";
import React, { useEffect, useState, useCallback } from "react";

const AssociationScreen = () => {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme] ?? Colors.light;
  const [association, setAssociation] = useState([]);
  const [errors, setErrors] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [expandedId, setExpandedId] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);


  useEffect(() => {
    fetchAssociation();
  }, [])

  const fetchAssociation = async (page = 1, append = false) => {
    try {
      if (page === 1) setIsLoading(true);
      else setIsLoadingMore(true);

      const response = await agencyService.getAgencies(page);
      if (response.data) {
        setAssociation((prev) => {
          if (!append) return response.data;

          const existingUuids = new Set(prev.map((item) => item.uuid));
          const newItems = response.data.filter(
            (item) => !existingUuids.has(item.uuid)
          );

          return [...prev, ...newItems];
        });
        setCurrentPage(page);
        setLastPage(response.meta?.last_page ?? 1);
      }
    } catch (error) {
      setErrors(error);
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  };

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      setErrors(null);
      await fetchAssociation();
    } catch (error) {
      setErrors(error);
    } finally {
      setIsRefreshing(false);
    }
  }, []);

  const handleDataChanged = useCallback(() => {
    fetchAssociation()
  }, []);

  const handleLoadMore = () => {
    if (!isLoadingMore && currentPage < lastPage) {
      fetchAssociation(currentPage + 1, true);
    }
  };

  const Loading = isLoading && association.length === 0 && !errors;
  const hasNoData = !isLoading && association.length === 0 && !errors;

  if (Loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.primary} />
        <Text style={[styles.loadingText, { color: theme.textLight }]}>
          Loading...
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <Text style={[styles.title, { color: theme.textLight }]}>
        Association List
      </Text>

      {/* Error Display */}
      {errors && (
        <View style={[styles.errorContainer, { backgroundColor: theme.errorBackground || '#ffebee' }]}>
          <Text style={[styles.errorText, { color: theme.error || '#d32f2f' }]}>
            {errors.message}
          </Text>
          {errors.retry && (
            <TouchableOpacity
              onPress={errors.retry}
              style={[styles.retryButton, { borderColor: theme.error || '#d32f2f' }]}
            >
              <Text style={[styles.retryButtonText, { color: theme.error || '#d32f2f' }]}>
                Retry
              </Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      {/* Empty State */}
      {hasNoData && (
        <View style={styles.emptyContainer}>
          <Text style={[styles.emptyText, { color: theme.textLight }]}>
            No association found
          </Text>
          <TouchableOpacity
            onPress={handleRefresh}
            style={[styles.refreshButton, { borderColor: theme.blue }]}
          >
            <Text style={[styles.refreshButtonText, { color: theme.blue }]}>
              Refresh
            </Text>
          </TouchableOpacity>
        </View>
      )}

      <AssociationList
        data={association}
        theme={theme}
        expandedId={expandedId}
        onToggleExpand={(id) => setExpandedId(expandedId === id ? null : id)}
        setIsLoading={setIsLoading}
        isLoading={isLoading}
        onDataChanged={handleDataChanged}
        handleRefresh={handleRefresh}
        onEndReached={handleLoadMore}
      />
    </ThemedView>
  )
}

export default AssociationScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
  },
  title: {
    fontSize: 17,
    fontWeight: "bold",
    marginVertical: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
  },
  errorContainer: {
    padding: 15,
    marginBottom: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  errorText: {
    fontSize: 14,
    textAlign: "center",
    marginBottom: 10,
  },
  retryButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderWidth: 1,
    borderRadius: 5,
  },
  retryButtonText: {
    fontSize: 14,
    fontWeight: "500",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 50,
  },
  emptyText: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
  },
  refreshButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderWidth: 1,
    borderRadius: 5,
  },
  refreshButtonText: {
    fontSize: 14,
    fontWeight: "500",
  },
})