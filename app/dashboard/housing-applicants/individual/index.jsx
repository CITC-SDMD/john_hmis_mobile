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
import { applicantService } from "../../../../components/API/ApplicantService";
import { useEffect, useState, useRef, useCallback } from "react";
import ThemedView from "../../../../components/ThemedForm/ThemedView";
import ApplicantList from "../../../../components/ThemendList/ThemedApplicantList";

const IndividualScreen = () => {
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

  const pendingRequests = useRef(new Set());
  const isMountedRef = useRef(true);

  const tabs = [
    { id: "new", label: "New" },
    { id: "schedule", label: "Schedule" },
    { id: "approved", label: "Approved" },
    { id: "disapproved", label: "Disapproved" },
  ];

  useEffect(() => {
    isMountedRef.current = true;
    fetchData("new", 1);

    return () => {
      isMountedRef.current = false;
      pendingRequests.current.forEach((request) => {
        if (request.controller) {
          request.controller.abort();
        }
      });
      pendingRequests.current.clear();
    };
  }, []);

  const handleTabChange = useCallback((tabId) => {
    setActiveTab(tabId);
    setErrors(null);

    if (applicants[tabId].length === 0) {
      fetchData(tabId, 1);
    }
  }, [applicants]);

  const fetchData = async (tabType, page = 1, isRefresh = false) => {
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

      const params = { page };
      let response;

      switch (tabType) {
        case "schedule":
          response = await applicantService.getApplicantsSchedule(params);
          break;
        case "approved":
          response = await applicantService.getApproved(params);
          break;
        case "disapproved":
          response = await applicantService.getRejected(params);
          break;
        default:
          response = await applicantService.getApplicants(params);
      }

      if (isMountedRef.current && response?.data) {
        setApplicants((prev) => {
          const existingUuids = new Set(prev[tabType].map((item) => item.uuid));
          const newItems = response.data.filter(
            (item) => !existingUuids.has(item.uuid)
          );

          return {
            ...prev,
            [tabType]:
              page === 1 || isRefresh ? response.data : [...prev[tabType], ...newItems],
          };
        });

        setTotalPages((prev) => ({
          ...prev,
          [tabType]: response.meta?.last_page || 1,
        }));

        setCurrentPage((prev) => ({
          ...prev,
          [tabType]: isRefresh ? 1 : page
        }));
      }
    } catch (error) {
      if (error.name !== "AbortError" && isMountedRef.current) {
        console.error("Fetch error:", error);
        setErrors({
          message: "Failed to load data. Please try again.",
          retry: () => fetchData(tabType, page, isRefresh)
        });
      }
    } finally {
      if (isMountedRef.current) {
        pendingRequests.current.delete(requestId);
        setIsLoading(false);
        setIsLoadingMore(false);
        setIsRefreshing(false);
      }
    }
  };

  const handleRefresh = useCallback(() => {
    fetchData(activeTab, 1, true);
  }, [activeTab]);

  const handleEndReached = useCallback(() => {
    const nextPage = currentPage[activeTab] + 1;
    if (!isLoadingMore && !isLoading && nextPage <= totalPages[activeTab]) {
      fetchData(activeTab, nextPage);
    }
  }, [currentPage, activeTab, totalPages, isLoadingMore, isLoading]);

  const handleDataChanged = useCallback((actionType, applicantId) => {
    fetchData(activeTab, 1);
    if (actionType === 'scheduled') {
      fetchData('schedule', 1);
    } else if (actionType === 'approved') {
      fetchData('approved', 1);
    } else if (actionType === 'disapproved') {
      fetchData('disapproved', 1);
    }
  }, [activeTab]);

  const shouldShowInitialLoading = isLoading && applicants[activeTab].length === 0 && !errors;
  const hasNoData = !isLoading && applicants[activeTab].length === 0 && !errors;

  if (shouldShowInitialLoading) {
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

      <View style={styles.tabContainer}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.id}
            onPress={() => handleTabChange(tab.id)}
            style={[
              styles.tab,
              {
                borderBottomColor:
                  activeTab === tab.id ? theme.blue : theme.border,
                backgroundColor:
                  activeTab === tab.id ? theme.white : theme.backgroundColor,
                flex: 1,
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

      {/* Applicant List */}
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
  },
  tab: {
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 3,
  },
  tabText: {
    fontSize: 13,
    padding: 3,
    fontWeight: "500",
  },
  activeTabText: {
    fontWeight: "bold",
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
});

export default IndividualScreen;