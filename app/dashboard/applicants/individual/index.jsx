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
import PaginationControl from "../../../../components/ThemedForm/ThemedDotPagination";
import React, { useEffect, useState } from "react";

const IndividualScreen = () => {
  const colorScheme = useColorScheme();
  const widthTab = Dimensions.get("window").width / 4.4;
  const theme = Colors[colorScheme] ?? Colors.light;
  const [isLoading, setIsLoading] = useState(false);
  const [applicants, setApplicants] = useState([]);
  const [activeTab, setActiveTab] = useState("new");

  const [newCurrentPage, setNewCurrentPage] = useState(1);
  const [scheduleCurrentPage, setScheduleCurrentPage] = useState(1);
  const [approvedCurrentPage, setApprovedCurrentPage] = useState(1);
  const [disapprovedCurrentPage, setDisapprovedCurrentPage] = useState(1);

  const [newTotalPages, setNewTotalPages] = useState(1);
  const [scheduleTotalPages, setScheduleTotalPages] = useState(1);
  const [approvedTotalPages, setApprovedTotalPages] = useState(1);
  const [disapprovedTotalPages, setDisapprovedTotalPages] = useState(1);

  const tabs = [
    { id: "new", label: "New" },
    { id: "schedule", label: "Schedule" },
    { id: "approved", label: "Approved" },
    { id: "disapproved", label: "Disapproved" },
  ];

  useEffect(() => {
    fetchApplicants();
  }, [newCurrentPage]);

  useEffect(() => {
    fetchData(activeTab);
  }, [
    activeTab,
    scheduleCurrentPage,
    approvedCurrentPage,
    disapprovedCurrentPage,
  ]);

  const getCurrentPage = () => {
    switch (activeTab) {
      case "new":
        return newCurrentPage;
      case "schedule":
        return scheduleCurrentPage;
      case "approved":
        return approvedCurrentPage;
      case "disapproved":
        return disapprovedCurrentPage;
      default:
        return 1;
    }
  };

  const getTotalPages = () => {
    switch (activeTab) {
      case "new":
        return newTotalPages;
      case "schedule":
        return scheduleTotalPages;
      case "approved":
        return approvedTotalPages;
      case "disapproved":
        return disapprovedTotalPages;
      default:
        return 1;
    }
  };

  const handlePageChange = (newPage) => {
    switch (activeTab) {
      case "new":
        setNewCurrentPage(newPage);
        break;
      case "schedule":
        setScheduleCurrentPage(newPage);
        break;
      case "approved":
        setApprovedCurrentPage(newPage);
        break;
      case "disapproved":
        setDisapprovedCurrentPage(newPage);
        break;
    }
  };

  const fetchData = async (value) => {
    if (value === "new") {
      await fetchApplicants();
    } else if (value === "schedule") {
      await fetchIndividualSchedule();
    } else if (value === "approved") {
      await fetchApproved();
    } else if (value === "disapproved") {
      await fetchDisapproved();
    }
  };

  async function fetchApplicants() {
    try {
      setIsLoading(true);
      const params = {
        page: newCurrentPage,
      };
      const response = await applicantService.getApplicants(params);
      if (response.data) {
        console.log(response.data);
        setApplicants(response);
        setNewTotalPages(response.meta?.last_page || 1);
      }
    } catch (error) {
      console.log("Error", error);
    } finally {
      setIsLoading(false);
    }
  }

  async function fetchIndividualSchedule() {
    try {
      setIsLoading(true);
      const params = {
        page: scheduleCurrentPage,
      };
      const response = await applicantService.getApplicantsSchedule(params);
      if (response.data) {
        console.log(response.data);
        setApplicants(response);
        setScheduleTotalPages(response.meta?.last_page || 1);
      }
    } catch (error) {
      console.log("Error", error);
    } finally {
      setIsLoading(false);
    }
  }

  async function fetchApproved() {
    try {
      setIsLoading(true);
      const params = {
        page: approvedCurrentPage,
      };
      const response = await applicantService.getApproved(params);
      if (response.data) {
        console.log(response.data);
        setApplicants(response);
        setApprovedTotalPages(response.meta?.last_page || 1);
      }
    } catch (error) {
      console.log("Error", error);
    } finally {
      setIsLoading(false);
    }
  }

  async function fetchDisapproved() {
    try {
      setIsLoading(true);
      const params = {
        page: disapprovedCurrentPage,
      };
      const response = await applicantService.getRejected(params);
      if (response.data) {
        console.log(response.data);
        setApplicants(response);
        setDisapprovedTotalPages(response.meta?.last_page || 1);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }

  if (isLoading) {
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
              onPress={() => {
                setActiveTab(tab.id);
                fetchData(tab.id);
              }}
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
          data={applicants.data}
          keyExtractor={(item) => item.id.toString()}
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
        />
      </View>
      <PaginationControl
        currentPage={getCurrentPage()}
        totalPages={getTotalPages()}
        onPageChange={handlePageChange}
      />
      
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
});
