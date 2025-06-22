import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
  RefreshControl,
} from 'react-native';
import { useColorScheme } from 'react-native';
import { useEffect, useState, useRef, useCallback } from 'react';
import NetInfo from '@react-native-community/netinfo';
import { Toast, ALERT_TYPE } from 'react-native-alert-notification';

import { Colors } from '../../../../constants/Colors';
import ThemedView from '../../../../components/ThemedForm/ThemedView';
import ApplicantList from '../../../../components/ThemendList/ThemedApplicantList';
import { useFormsDatabase } from '../../../../components/Hooks/useCensusFormDatabase';
import { useApplicantsDatabase } from '../../../../components/Hooks/useApplicantsList';
import { useApplicantResidencesDatabase } from '../../../../components/Hooks/useApplicantResidencesDatabase';
import { useApplicantRemarksDatabase } from '../../../../components/Hooks/useRemarksDatabase';


const IndividualScreen = () => {
  const { loadApplicants } = useApplicantsDatabase();

  const { isFormsDbInitialized,
    syncOfflineData,
    getPendingForms
  } = useFormsDatabase();

  const { isResidencesDbInitialized,
    syncOfflineApplicantResidences,
    getPendingApplicantResidences
  } = useApplicantResidencesDatabase();

  const {
    isRemarksDbInitialized,
    getPendingApplicantRemarks,
    syncOfflineApplicantRemarks,
  } = useApplicantRemarksDatabase();

  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme] ?? Colors.light;

  const [activeTab, setActiveTab] = useState('new');
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

  const [pagination, setPagination] = useState({
    new: { currentPage: 1, totalPages: 1 },
    schedule: { currentPage: 1, totalPages: 1 },
    approved: { currentPage: 1, totalPages: 1 },
    disapproved: { currentPage: 1, totalPages: 1 },
  });

  const [isConnected, setIsConnected] = useState(true);
  const [localFormsCount, setLocalFormsCount] = useState(0);
  const [localResidencesCount, setLocalResidencesCount] = useState(0);
  const [localRemarksCount, setLocalRemarksCount] = useState(0);

  const [isSyncing, setIsSyncing] = useState(false);

  const activeTabApplicants = applicants[activeTab];
  const activeTabPagination = pagination[activeTab];

  const pendingRequests = useRef(new Set());
  const isMountedRef = useRef(true);

  const tabs = [
    { id: 'new', label: 'New' },
    { id: 'schedule', label: 'Schedule' },
    { id: 'approved', label: 'Approved' },
    { id: 'disapproved', label: 'Disapproved' },
  ];

  const updateLocalRemarksCount = useCallback(async () => {
    if (!isRemarksDbInitialized) return;
    try {
      const pendingRemarks = await getPendingApplicantRemarks();
      setLocalRemarksCount(pendingRemarks.length);
    } catch (error) {
      console.error('Error fetching local Remarks count:', error);
    }
  }, [isRemarksDbInitialized, getPendingApplicantRemarks]);

  const updateLocalFormsCount = useCallback(async () => {
    if (!isFormsDbInitialized) return;
    try {
      const pendingForms = await getPendingForms();
      setLocalFormsCount(pendingForms.length);
    } catch (error) {
      console.error('Error fetching local forms count:', error);
    }
  }, [isFormsDbInitialized, getPendingForms]);

  const updateLocalResidencesCount = useCallback(async () => {
    if (!isResidencesDbInitialized) return;
    try {
      const pendingResidences = await getPendingApplicantResidences();
      setLocalResidencesCount(pendingResidences.length);
    } catch (error) {
      console.error('Error fetching local residences count:', error);
    }
  }, [isResidencesDbInitialized, getPendingApplicantResidences]);

  const fetchData = useCallback(
    async (tabType, page = 1, isRefresh = false) => {
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

        const { data: fetchedApplicants, meta: fetchedMeta } = await loadApplicants(tabType, page);
        const networkState = await NetInfo.fetch();
        const connected = networkState.isConnected && networkState.isInternetReachable;

        if (isMountedRef.current && Array.isArray(fetchedApplicants)) {
          setApplicants((prev) => {
            const currentData = page === 1 || isRefresh ? [] : prev[tabType];
            const uniqueNewItems = fetchedApplicants.filter(
              (newItem) =>
                !currentData.some((existingItem) => existingItem.uuid === newItem.uuid)
            );
            return {
              ...prev,
              [tabType]: [...currentData, ...uniqueNewItems],
            };
          });

          setPagination((prev) => ({
            ...prev,
            [tabType]: {
              currentPage: fetchedMeta.current_page,
              totalPages: fetchedMeta.last_page,
            },
          }));
        }
        setIsConnected(connected);

      } catch (err) {
        if (err.name === 'AbortError') {
          console.log('Fetch aborted for tab:', tabType);
          return;
        }
        console.error('Failed to fetch applicants:', err);
        setErrors(err);
        const networkState = await NetInfo.fetch();
        setIsConnected(networkState.isConnected && networkState.isInternetReachable);
        if (!networkState.isConnected || !networkState.isInternetReachable) {
          Toast.show({
            title: "Offline",
            textBody: "You are currently offline. Displaying cached data.",
            type: ALERT_TYPE.INFO,
          });
        } else {
          Toast.show({
            title: "Error",
            textBody: "Failed to load applicants.",
            type: ALERT_TYPE.DANGER,
          });
        }
      } finally {
        if (isMountedRef.current) {
          setIsLoading(false);
          setIsRefreshing(false);
          setIsLoadingMore(false);
          pendingRequests.current.delete(requestId);
        }
      }
    },
    [loadApplicants]
  );

  useEffect(() => {
    isMountedRef.current = true;
    fetchData('new', 1);

    NetInfo.fetch().then(state => {
      setIsConnected(state.isConnected && state.isInternetReachable);
    });

    const unsubscribeNetInfo = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected && state.isInternetReachable);
    });

    return () => {
      isMountedRef.current = false;
      pendingRequests.current.forEach((request) => request.controller.abort());
      pendingRequests.current.clear();
      unsubscribeNetInfo();
    };
  }, []);

  useEffect(() => {
    if (isFormsDbInitialized) {
      updateLocalFormsCount();
      updateLocalRemarksCount();
      updateLocalResidencesCount();
    }
  }, [isFormsDbInitialized, updateLocalFormsCount]);

  const handleTabChange = useCallback(
    (tabId) => {
      setActiveTab(tabId);
      setErrors(null);
      if (applicants[tabId].length === 0 || isRefreshing) {
        fetchData(tabId, 1);
      }
    },
    [applicants, fetchData, isRefreshing]
  );

  const handleRefresh = useCallback(() => {
    fetchData(activeTab, 1, true);
  }, [activeTab, fetchData]);

  const handleEndReached = useCallback(() => {
    const { currentPage, totalPages } = activeTabPagination;
    const nextPage = currentPage + 1;
    if (!isLoadingMore && !isLoading && nextPage <= totalPages) {
      fetchData(activeTab, nextPage);
    }
  }, [activeTabPagination, isLoadingMore, isLoading, activeTab, fetchData]);

  const handleDataChanged = useCallback((actionType) => {
    fetchData(activeTab, 1);
    if (actionType === 'scheduled') {
      fetchData('schedule', 1);
    } else if (actionType === 'approved') {
      fetchData('approved', 1);
    } else if (actionType === 'disapproved') {
      fetchData('disapproved', 1);
    }
    fetchData('new', 1);
  }, [activeTab, fetchData]);

  const handleSyncPress = useCallback(async () => {
    setIsSyncing(true);
    try {
      console.log("Starting sync for all offline data...");
      // Sync Forms data
      const formsSyncResult = await syncOfflineData(true);
      // Sync Applicant Residences data
      const residencesSyncResult = await syncOfflineApplicantResidences(true);

      const remarksSyncResult = await syncOfflineApplicantRemarks(true);

      console.log("Forms Sync Result:", formsSyncResult);
      console.log("Residences Sync Result:", residencesSyncResult);
      console.log("Remarks Sync Result:", remarksSyncResult);

      // Update counts after sync
      await updateLocalFormsCount();
      await updateLocalResidencesCount();
      await updateLocalRemarksCount();

      // You might want to combine the toast messages or show a summary
      if (formsSyncResult.syncedCount > 0 || residencesSyncResult.syncedCount > 0 || remarksSyncResult.syncedCount > 0) {
        Toast.show({ title: "Sync Complete", textBody: `Forms: ${formsSyncResult.syncedCount} synced, Residences: ${residencesSyncResult.syncedCount} synced. Remarks: ${remarksSyncResult.syncedCount} synced.`, type: ALERT_TYPE.SUCCESS });
      } else if (formsSyncResult.failedCount > 0 || residencesSyncResult.failedCount > 0) {
        Toast.show({ title: "Sync Issues", textBody: `Forms: ${formsSyncResult.failedCount} failed, Residences: ${residencesSyncResult.failedCount} failed. Remarks: ${remarksSyncResult.syncedCount} failed.`, type: ALERT_TYPE.WARNING });
      } else {
        Toast.show({ title: "Sync Info", textBody: "No pending data found to synchronize.", type: ALERT_TYPE.INFO });
      }

    } catch (error) {
      console.error("Error during overall sync:", error);
      Toast.show({ title: "Sync Error", textBody: "An error occurred during synchronization.", type: ALERT_TYPE.DANGER });
    } finally {
      setIsSyncing(false);
      // Optionally refetch online data after sync if connected
      const networkState = await NetInfo.fetch();
      if (networkState.isConnected && networkState.isInternetReachable) {
        fetchData(activeTab, 1, true); // Refresh current tab data
      }
    }
  }, [syncOfflineData, syncOfflineApplicantResidences, syncOfflineApplicantRemarks, updateLocalFormsCount, updateLocalResidencesCount, updateLocalRemarksCount, fetchData, activeTab]);

  const showInitialLoading = isLoading && activeTabApplicants.length === 0 && !errors;
  const hasNoData = !isLoading && activeTabApplicants.length === 0 && !errors;

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
      <View style={styles.syncButtonContainer}>
        <Text style={[styles.title, { color: theme.textLight }]}>
          Individual List
        </Text>

        {(isConnected && (localFormsCount > 0 || localRemarksCount > 0 || localResidencesCount > 0)) && (
          <Text style={[styles.title, { color: theme.textLight }]}>
            Pending Sync: {localFormsCount}
          </Text>
        )}

      </View>
      {(isConnected && (localFormsCount > 0 || localRemarksCount > 0 || localResidencesCount > 0)) && (
        <View style={{ justifyContent: 'space-between', alignItems: 'flex-end', marginVertical: 10 }}>
          <TouchableOpacity
            onPress={handleSyncPress}
            style={[
              styles.syncButton,
              {
                backgroundColor:
                  isConnected && (localFormsCount > 0 || localRemarksCount > 0 || localResidencesCount > 0) && !isSyncing
                    ? theme.blue
                    : '#cccccc',
              },
            ]}
            disabled={
              !isConnected ||
              (localFormsCount === 0 && localRemarksCount === 0 && localResidencesCount === 0) ||
              isSyncing
            }
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
      )}

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

      {activeTabApplicants.length > 0 && (
        <ApplicantList
          data={activeTabApplicants}
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
  },
  title: {
    fontSize: 17,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    borderRadius: 8,
    overflow: 'hidden',
  },
  tab: {
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 3,
    flex: 1,
    paddingHorizontal: 5,
  },
  tabText: {
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  activeTabText: {
    fontWeight: '700',
    fontSize: 14,
  },
  errorContainer: {
    padding: 15,
    marginBottom: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  errorText: {
    fontSize: 14,
    textAlign: 'center',
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
    fontWeight: '500',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
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
    fontWeight: '500',
  },
  syncButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    // marginBottom: 15,
    // paddingVertical: 5,
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
    // fontSize: 14,
    // fontWeight: '500',

    fontSize: 12,
    fontWeight: 'bold',
    marginVertical: 10,
  },
});

export default IndividualScreen;
