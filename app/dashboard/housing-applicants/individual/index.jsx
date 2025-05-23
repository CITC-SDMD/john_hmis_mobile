import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  ActivityIndicator,
  SafeAreaView,
} from "react-native";
import { useRouter } from "expo-router";
import { useColorScheme } from "react-native";
import { Colors } from "../../../../constants/Colors";
import { applicantService } from "../../../../components/API/ApplicantService";
import ThemedView from "../../../../components/ThemedForm/ThemedView";
import ApplicantList from "../../../../components/ThemendList/ThemedApplicantList";
import React, { useEffect, useState, useRef } from "react";

const IndividualScreen = () => {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme] ?? Colors.light;
  const widthTab = Dimensions.get("window").width / 4.4;
  const [activeTab, setActiveTab] = useState("new");
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
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

  const tabs = [
    { id: "new", label: "New" },
    { id: "schedule", label: "Schedule" },
    { id: "approved", label: "Approved" },
    { id: "disapproved", label: "Disapproved" },
  ];

  useEffect(() => {
    fetchData("new", 1);
    return () => {
      pendingRequests.current.forEach((controller) => controller.abort());
      pendingRequests.current.clear();
    };
  }, []);

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    if (applicants[tabId].length === 0) {
      fetchData(tabId, 1);
    }
  };

  const fetchData = async (tabType, page = 1) => {
    setExpandedId(null);
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
      page === 1 ? setIsLoading(true) : setIsLoadingMore(true);
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

      if (response.data) {
        setApplicants((prev) => ({
          ...prev,
          [tabType]:
            page === 1 ? response.data : [...prev[tabType], ...response.data],
        }));
        setTotalPages((prev) => ({
          ...prev,
          [tabType]: response.meta?.last_page || 1,
        }));
        setCurrentPage((prev) => ({ ...prev, [tabType]: page }));
      }
    } catch (error) {
      if (error.name !== "AbortError") {
      }
      setErrors(error);
    } finally {
      pendingRequests.current.delete(requestId);
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  };

  if (isLoading && applicants[activeTab].length === 0) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.primary} />
        <Text style={{ color: theme.textLight }}>Loading...</Text>
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
                width: widthTab,
              },
            ]}
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

      <ApplicantList
        data={applicants[activeTab]}
        theme={theme}
        expandedId={expandedId}
        onEndReached={() => {
          const nextPage = currentPage[activeTab] + 1;
          if (!isLoadingMore && nextPage <= totalPages[activeTab]) {
            fetchData(activeTab, nextPage);
          }
        }}
        isLoadingMore={isLoadingMore}
        onToggleExpand={(id) => setExpandedId(expandedId === id ? null : id)}
        onDataChanged={() => fetchData(activeTab, 1)}
        setIsLoading={setIsLoading}
        isLoading={isLoading}
      />
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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
});

export default IndividualScreen;
