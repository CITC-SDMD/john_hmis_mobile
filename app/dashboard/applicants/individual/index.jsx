import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  ActivityIndicator,
  SafeAreaView,
  FlatList,
} from "react-native";
import { useColorScheme } from "react-native";
import { Colors } from "../../../../constants/Colors";
import { applicantService } from "../../../../components/API/ApplicantService";
import ThemedView from "../../../../components/ThemedForm/ThemedView";
import ThemedCard from "../../../../components/ThemedForm/ThemedCard";
import React, { useEffect, useState, useCallback } from "react";

const IndividualScreen = () => {
  const colorScheme = useColorScheme();
  const widthTab = Dimensions.get("window").width / 4.4;
  const theme = Colors[colorScheme] ?? Colors.light;
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [applicants, setApplicants] = useState([]);
  const [activeTab, setActiveTab] = useState("new");
  const [currentPage, setCurrentPage] = useState({
    new: 1,
    schedule: 1,
    approved: 1,
    disapproved: 1
  });

  const [totalPages, setTotalPages] = useState({
    new: 1,
    schedule: 1,
    approved: 1,
    disapproved: 1
  });

  const tabs = [
    { id: "new", label: "New" },
    { id: "schedule", label: "Schedule" },
    { id: "approved", label: "Approved" },
    { id: "disapproved", label: "Disapproved" },
  ];

  useEffect(() => {
    // fetchData(activeTab);
    fetchData("new", 1);
  }, []);


  const fetchData = async (tabType, page = currentPage[tabType]) => {
    try {
      setIsLoading(true);
      let response;
      const params = { page };

      switch (tabType) {
        case "new":
          response = await applicantService.getApplicants(params);
          break;
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
        setApplicants(response.data);
        setTotalPages(prev => ({
          ...prev,
          [tabType]: response.meta?.last_page || 1
        }));
      }
    } catch (error) {
      console.log("Error fetching data:", error);
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  };

  const loadMoreData = useCallback(() => {
    const nextPage = currentPage[activeTab] + 1;
    if (nextPage <= totalPages[activeTab] && !isLoadingMore) {
      setIsLoadingMore(true);
      setCurrentPage(prev => ({
        ...prev,
        [activeTab]: nextPage
      }));
      fetchMoreData(activeTab, nextPage);
    }
  }, [currentPage, totalPages, activeTab, isLoadingMore]);

  const fetchMoreData = async (tabType, page) => {
    try {
      let response;
      const params = { page };

      switch (tabType) {
        case "new":
          response = await applicantService.getApplicants(params);
          break;
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
        setApplicants(prevApplicants => [...prevApplicants, ...response.data]);
      }
    } catch (error) {
      console.log("Error loading more data:", error);
    } finally {
      setIsLoadingMore(false);
    }
  };

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setApplicants([]);
    setCurrentPage(prev => ({
      ...prev,
      [tabId]: 1
    }));
    fetchData(tabId, 1);
  };

  const renderFooter = () => {
    if (!isLoadingMore) return null;

    return (
      <View style={styles.footer}>
        <ActivityIndicator size="small" color={theme.primary} />
        <Text style={[styles.footerText, { color: theme.textLight }]}>
          Loading more...
        </Text>
      </View>
    );
  };

  if (isLoading && applicants.length === 0) {
    return (
      <SafeAreaView
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      >
        <ActivityIndicator size="large" color={theme.primary} />
        <Text style={{ color: theme.textLight }}>Loading...</Text>
      </SafeAreaView>
    );
  }

  return (
    <ThemedView style={styles.container} safe={true}>
      <Text style={[styles.title, { color: theme.textLight }]}>
        Individual List
      </Text>
      <View style={styles.tabContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {tabs.map((tab) => (
            <TouchableOpacity
              key={tab.id}
              onPress={() => handleTabChange(tab.id)}
              style={[
                styles.tab,
                activeTab === tab.id && styles.activeTab,
                {
                  borderBottomColor:
                    activeTab === tab.id ? theme.blue : theme.border,
                },
                {
                  backgroundColor:
                    activeTab === tab.id ? theme.white : theme.backgroundColor,
                },
                { width: widthTab },
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
        </ScrollView>
      </View>

      <View style={styles.containerBody}>
        <FlatList
          data={applicants}
          keyExtractor={(item, index) => `${item.id}-${index}`}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <TouchableOpacity>
              <ThemedCard style={[styles.card, { backgroundColor: "#FBFDFF" }]}>
                <Text style={styles.header}>
                  {item.firstname} {item.middlename} {item.lastname}
                </Text>
              </ThemedCard>
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No applicants found</Text>
          }
          onEndReached={loadMoreData}
          onEndReachedThreshold={0.5}
          ListFooterComponent={renderFooter}
        />
      </View>
    </ThemedView>
  );
};

export default IndividualScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  containerBody: {
    flex: 1,
    padding: 15,
  },
  title: {
    fontSize: 17,
    fontWeight: "bold",
    marginVertical: 20,
  },
  tabContainer: {
    alignItems: "center",
    marginBottom: 15,
  },
  tab: {
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 2,
  },
  tabText: {
    fontSize: 15,
    padding: 5,
  },
  activeTabText: {
    fontWeight: "bold",
  },
  card: {
    width: "100%",
    marginVertical: 10,
    padding: 20,
    paddingLeft: 14,
    borderLeftColor: "#2680eb",
    borderLeftWidth: 4,
    borderRadius: 3,
  },
  emptyText: {
    textAlign: "center",
    padding: 20,
    fontSize: 16,
    color: "#8A94A6",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
  },
  footerText: {
    marginLeft: 10,
  }
});