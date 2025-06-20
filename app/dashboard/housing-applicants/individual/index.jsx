import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
  RefreshControl,
} from "react-native";
import { useColorScheme } from "react-native";
import { Colors } from "../../../../constants/Colors";
import { useEffect, useState, useRef, useCallback } from "react";
import ThemedView from "../../../../components/ThemedForm/ThemedView";
import ApplicantList from "../../../../components/ThemendList/ThemedApplicantList";

import NetInfo from '@react-native-community/netinfo';
import { Toast, ALERT_TYPE } from "react-native-alert-notification";
import { useFormsDatabase } from "../../../../components/Hooks/useCensusFormDatabase";
import { useApplicantsDatabase } from "../../../../components/Hooks/useApplicantsList";

const IndividualScreen = () => {
  const { loadApplicants } = useApplicantsDatabase();
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme] ?? Colors.light;

  const [activeTab, setActiveTab] = useState("new");
  const [errors, setErrors] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [expandedId, setExpandedId] = useState(null);

  const [applicants, setApplicants] = useState({
    new: [],
    schedule: [],
    approved: [],
    disapproved: [],
  });

  const [currentPage, setCurrentPage] = useState({
    new: 1,
    schedule: 1,
    approved: 1,
    disapproved: 1,
  });
  const [totalPages, setTotalPages] = useState({
    new: 1,
    schedule: 1,
    approved: 1,
    disapproved: 1,
  });

  const [isConnected, setIsConnected] = useState(true);
  const [localFormsCount, setLocalFormsCount] = useState(0);
  const [isSyncing, setIsSyncing] = useState(false);

  const pendingRequests = useRef(new Set());
  const isMountedRef = useRef(true);

  const {
    isFormsDbInitialized,
    syncOfflineData,
    getPendingForms,
  } = useFormsDatabase();

  const tabs = [
    { id: "new", label: "New" },
    { id: "schedule", label: "Schedule" },
    { id: "approved", label: "Approved" },
    { id: "disapproved", label: "Disapproved" },
  ];

  useEffect(() => {
    isMountedRef.current = true;
    fetchData("new", 1);

    NetInfo.fetch().then(state => {
      setIsConnected(state.isConnected && state.isInternetReachable);
    });

    const unsubscribeNetInfo = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected && state.isInternetReachable);
    });

    if (isFormsDbInitialized) {
      updateLocalFormsCount();
    }

    return () => {
      isMountedRef.current = false;
      pendingRequests.current.forEach((request) => {
        if (request.controller) {
          request.controller.abort();
        }
      });
      pendingRequests.current.clear();
      unsubscribeNetInfo();
    };
  }, [updateLocalFormsCount, fetchData, isFormsDbInitialized]);

  const updateLocalFormsCount = useCallback(async () => {
    if (isFormsDbInitialized) {
      try {
        const pendingForms = await getPendingForms();
        setLocalFormsCount(pendingForms.length);
      } catch (error) {
        console.error("Error fetching local forms count:", error);
      }
    }
  }, [isFormsDbInitialized, getPendingForms]);

  const handleTabChange = useCallback((tabId) => {
    setActiveTab(tabId);
    setErrors(null);

    if (applicants[tabId].length === 0 || isRefreshing) {
      fetchData(tabId, 1);
    }
  }, [applicants, fetchData, isRefreshing]);

  const fetchData = useCallback(async (tabType, page = 1, isRefresh = false) => {
    if (!isMountedRef.current) return;

    setExpandedId(null);
    setErrors(null);

    const existingRequest = Array.from(pendingRequests.current).find(
      (req) => req.tabType === tabType
    );
    if (existingRequest) {
      existingRequest.controller.abort();
      pendingRequests.current.delete(existingRequest);
    }

    const controller = new AbortController();
    const requestId = { tabType, controller };
    pendingRequests.current.add(requestId);

    try {
      if (isRefresh) {
        setIsRefreshing(true);
      } else if (page === 1) {
        setIsLoading(true);
      } else {
        setIsLoadingMore(true);
      }

      const { data: responseData, meta: responseMeta } = await loadApplicants(tabType, page);

      const networkState = await NetInfo.fetch();

      if (isMountedRef.current && responseData) {

        console.log(responseData)

        setApplicants((prev) => {
          const currentData = prev[tabType] || [];

          let updatedData;
          if (networkState.isConnected && networkState.isInternetReachable) {
            const existingUuids = new Set(currentData.map((item) => item.uuid));
            const newItems = responseData.filter(
              (item) => !existingUuids.has(item.uuid)
            );
            updatedData = page === 1 || isRefresh ? responseData : [...currentData, ...newItems];
          } else {
            updatedData = responseData;
          }

          return {
            ...prev,
            [tabType]: updatedData,
          };
        });

        setTotalPages((prev) => ({
          ...prev,
          [tabType]: responseMeta?.last_page || 1,
        }));

        setCurrentPage((prev) => ({
          ...prev,
          [tabType]: responseMeta?.current_page || 1
        }));

        if (!networkState.isConnected || !networkState.isInternetReachable) {
          setErrors({
            message: "You are offline. Displaying cached data.",
            retry: () => fetchData(tabType, page, isRefresh)
          });
          Toast.show({ title: "Offline", textBody: "Displaying cached applicant list.", type: ALERT_TYPE.INFO });
        } else {
          setErrors(null);
        }
      } else if (!responseData || responseData.length === 0) {
        const networkStatus = await NetInfo.fetch();
        if (!networkStatus.isConnected || !networkStatus.isInternetReachable) {
          setErrors({
            message: "You are offline. No cached data available.",
            retry: () => fetchData(tabType, page, isRefresh)
          });
          Toast.show({ title: "Offline", textBody: "No cached applicant data found.", type: ALERT_TYPE.WARNING });
        } else {
          setErrors({
            message: "No data found. Please try again.",
            retry: () => fetchData(tabType, page, isRefresh)
          });
          Toast.show({ title: "No Data", textBody: "No applicant data found online.", type: ALERT_TYPE.INFO });
        }
      }

    } catch (error) {
      if (error.name !== "AbortError" && isMountedRef.current) {
        console.error("Fetch error:", error);

        const { data: offlineDataOnError } = await loadApplicants(tabType, 1);
        if (offlineDataOnError && offlineDataOnError.length > 0) {
          setApplicants((prev) => ({
            ...prev,
            [tabType]: offlineDataOnError,
          }));
          setTotalPages((prev) => ({ ...prev, [tabType]: 1 }));
          setCurrentPage((prev) => ({ ...prev, [tabType]: 1 }));
          setErrors({
            message: "Failed to fetch online data. Displaying cached data.",
            retry: () => fetchData(tabType, page, isRefresh)
          });
          Toast.show({ title: "Error", textBody: "Failed to fetch online data. Displaying cached data.", type: ALERT_TYPE.WARNING });
        } else {
          setErrors({
            message: "Failed to load data. Please try again.",
            retry: () => fetchData(tabType, page, isRefresh)
          });
          Toast.show({ title: "Error", textBody: "Failed to load applicant list.", type: ALERT_TYPE.DANGER });
        }
      }
    } finally {
      if (isMountedRef.current) {
        pendingRequests.current.delete(requestId);
        setIsLoading(false);
        setIsLoadingMore(false);
        setIsRefreshing(false);
      }
    }
  }, [
    isMountedRef,
    pendingRequests,
    setExpandedId,
    setErrors,
    setIsLoading,
    setIsLoadingMore,
    setIsRefreshing,
    setApplicants,
    setTotalPages,
    setCurrentPage,
    loadApplicants,
  ]);

  const handleRefresh = useCallback(() => {
    fetchData(activeTab, 1, true);
  }, [activeTab, fetchData]);

  const handleEndReached = useCallback(() => {
    const nextPage = currentPage[activeTab] + 1;
    if (!isLoadingMore && !isLoading && nextPage <= totalPages[activeTab]) {
      fetchData(activeTab, nextPage);
    }
  }, [currentPage, activeTab, totalPages, isLoadingMore, isLoading, fetchData]);

  const handleDataChanged = useCallback((actionType) => {
    fetchData(activeTab, 1);
    if (actionType === 'scheduled') {
      fetchData('schedule', 1);
    } else if (actionType === 'approved') {
      fetchData('approved', 1);
    } else if (actionType === 'disapproved') {
      fetchData('disapproved', 1);
    }
  }, [activeTab, fetchData]);

  const handleSyncPress = useCallback(async () => {
    if (isSyncing) {
      Toast.show({
        title: "Syncing",
        textBody: "Sync in progress, please wait...",
        type: ALERT_TYPE.INFO,
      });
      return;
    }

    setIsSyncing(true);

    try {
      const { syncedCount } = await syncOfflineData(true);
      if (syncedCount > 0) {
        Toast.show({
          title: "Success",
          textBody: `${syncedCount} forms synced successfully!`,
          type: ALERT_TYPE.SUCCESS,
        });
        fetchData(activeTab, 1, true);
        fetchData('new', 1, true);
        fetchData('schedule', 1, true);
        fetchData('approved', 1, true);
        fetchData('disapproved', 1, true);
      } else {
        Toast.show({
          title: "No Data",
          textBody: "No pending forms to sync.",
          type: ALERT_TYPE.INFO,
        });
      }
    } catch (error) {
      console.error("Sync process error:", error);
      Toast.show({
        title: "Sync Error",
        textBody: `An error occurred during sync: ${error.message || 'Unknown error'}`,
        type: ALERT_TYPE.DANGER,
      });
    } finally {
      setIsSyncing(false);
      await updateLocalFormsCount();
    }
  }, [isSyncing, syncOfflineData, updateLocalFormsCount, activeTab, fetchData]);

  const showInitialLoading = isLoading && applicants[activeTab].length === 0 && !errors;
  const hasNoData = !isLoading && applicants[activeTab].length === 0 && !errors;

  if (showInitialLoading) {
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
        Individual List
      </Text>

      <View style={styles.syncButtonContainer}>
        <Text style={[styles.localCountText, { color: theme.text }]}>
          Pending Sync: {localFormsCount}
        </Text>
        <TouchableOpacity
          onPress={handleSyncPress}
          style={[
            styles.syncButton,
            {
              backgroundColor: isConnected && localFormsCount > 0 && !isSyncing
                ? theme.blue
                : '#cccccc',
            },
          ]}
          disabled={!isConnected || localFormsCount === 0 || isSyncing}
          accessibilityLabel="Sync pending forms"
          accessibilityHint="Uploads locally saved forms when online"
        >
          {isSyncing ? (
            <ActivityIndicator color={theme.white} />
          ) : (
            <Text style={styles.syncButtonText}>Sync All</Text>
          )}
        </TouchableOpacity>
      </View>

      <View style={[styles.tabContainer, { backgroundColor: theme.background }]}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.id}
            onPress={() => handleTabChange(tab.id)}
            style={[
              styles.tab,
              {
                borderBottomColor:
                  activeTab === tab.id ? theme.blue : theme.border,
              },
            ]}
            accessibilityLabel={`${tab.label} tab`}
            accessibilityRole="tab"
            accessibilityState={{ selected: activeTab === tab.id }}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === tab.id && styles.activeTabText,
                { color: activeTab === tab.id ? theme.blue : theme.text },
              ]}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

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

      {hasNoData && (
        <View style={styles.emptyContainer}>
          <Text style={[styles.emptyText, { color: theme.textLight }]}>
            No {activeTab} applicants found
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

      {applicants[activeTab].length > 0 && (
        <ApplicantList
          data={applicants[activeTab]}
          theme={theme}
          expandedId={expandedId}
          onEndReached={handleEndReached}
          isLoadingMore={isLoadingMore}
          onToggleExpand={(id) => setExpandedId(expandedId === id ? null : id)}
          onDataChanged={handleDataChanged}
          autoSwitchTab={(tabId) => {
            if (tabId !== activeTab) {
              setActiveTab(tabId);
            }
          }}
          setIsLoading={setIsLoading}
          isLoading={isLoading}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={handleRefresh}
              colors={[theme.primary]}
              tintColor={theme.primary}
            />
          }
        />
      )}
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
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
  title: {
    fontSize: 17,
    fontWeight: "bold",
    marginVertical: 10,
  },
  tabContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
    borderRadius: 8,
    overflow: 'hidden',
  },
  tab: {
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 3,
    flex: 1,
    paddingHorizontal: 5,
  },
  tabText: {
    fontSize: 12,
    fontWeight: "bold",
    textAlign: 'center',
  },
  activeTabText: {
    fontWeight: "700",
    fontSize: 14,
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
  syncButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    paddingVertical: 5,
  },
  syncButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 100,
    flexDirection: 'row',
  },
  syncButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  localCountText: {
    fontSize: 14,
    fontWeight: '500',
  },
});

export default IndividualScreen;