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
import { useColorScheme } from "react-native";
import { Colors } from "../../../../constants/Colors";
import { applicantService } from "../../../../components/API/ApplicantService";
import ThemedView from "../../../../components/ThemedForm/ThemedView";
import ThemedTableIndividual from "../../../../components/ThemedTable/ThemedTableIndividual";

import React, { useEffect, useState } from "react";

const IndividualScreen = () => {
  const colorScheme = useColorScheme();
  const widthTab = Dimensions.get("window").width / 4.4;
  const theme = Colors[colorScheme] ?? Colors.light;
  const [isLoading, setIsLoading] = useState(false);
  const [applicants, setApplicants] = useState({});
  const [schedule, setSchedules] = useState({});
  const [approved, setApproveds] = useState({});
  const [disApproved, setDisApproveds] = useState({});

  const [activeTab, setActiveTab] = useState("new");

  const tabs = [
    { id: "new", label: "New" },
    { id: "schedule", label: "Schedule" },
    { id: "approved", label: "Approved" },
    { id: "disapproved", label: "Disapproved" },
  ];

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
      const response = await applicantService.getApplicants();
      if (response.data) {
        console.log(response.data);
        setApplicants(response.data);
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
      const response = await applicantService.getApplicantsSchedule();
      if (response.data) {
        console.log(response.data);
        setSchedules(response.data);
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
      const response = await applicantService.getApproved();
      if (response.data) {
        console.log(response.data);
        setApproveds(response.data);
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
      const response = await applicantService.getRejected();
      if (response.data) {
        console.log(response.data);
        setDisApproveds(response.data);
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
    </ThemedView>
  );
};

export default IndividualScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
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
});
