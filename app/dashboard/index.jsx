import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  SafeAreaView,
} from "react-native";
import { useColorScheme } from "react-native";
import { Colors } from "../../constants/Colors";
import { agencyService } from "../../components/API/AgencyService";
import { applicantService } from "../../components/API/ApplicantService";
import { beneficiaryService } from "../../components/API/BeneficiaryService";
import ThemedAppointmentList from "../../components/ThemendList/ThemedAppointmentList";
import ThemedView from "../../components/ThemedForm/ThemedView";
import Icon from "react-native-vector-icons/FontAwesome5";

const index = () => {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme] ?? Colors.light;
  const [isLoading, setIsLoading] = useState(false);
  const [fetchData, setFetchData] = useState({
    beneficiaryCount: 0,
    unScheduledCount: 0,
    individualCount: 0,
    associationCount: 0,
    currentScheduledCount: 0,
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      const [
        beneficiaryCount,
        unScheduledCount,
        individualCount,
        associationCount,
        currentScheduledCount,
      ] = await Promise.all([
        beneficiaryService.getCountBeneficiaries(),
        applicantService.countUnScheduled(),
        applicantService.getApplicantsList(),
        applicantService.getCurrentScheduled(),
        agencyService.getAgenciesList(),
      ]);

      const newData = {
        beneficiaryCount: beneficiaryCount || 0,
        unScheduledCount: unScheduledCount.count || 0,
        individualCount: individualCount.data?.length || 0,
        associationCount: associationCount.data?.count || 0,
        currentScheduledCount: currentScheduledCount.data?.length || 0,
      };
      setFetchData(newData);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const infoBoxes = [
    {
      label: "Total beneficiaries",
      value: fetchData.beneficiaryCount,
      icon: "users",
    },
    {
      label: "Total Individual",
      value: fetchData.individualCount,
      icon: "user",
    },
    {
      label: "Total association",
      value: fetchData.associationCount,
      icon: "users",
    },
    {
      label: "Total unscheduled",
      value: fetchData.unScheduledCount,
      icon: "file-alt",
    },
    {
      label: "Total current scheduled",
      value: fetchData.currentScheduledCount,
      icon: "file",
    },
  ];

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
      <View style={styles.body}>
        {infoBoxes.map((item, index) => (
          <View
            key={index}
            style={[styles.card, { backgroundColor: theme.backgroundColor }]}
          >
            <View style={styles.cardContent}>
              <Icon
                name={item.icon}
                size={20}
                color={theme.white}
                padding={10}
                backgroundColor={"#007bff"}
                borderRadius={5}
              />
              <View style={styles.textContainer}>
                <Text style={[styles.label, { color: theme.text }]}>
                  {item.label}
                </Text>
                <Text style={styles.value}>{item.value}</Text>
              </View>
            </View>
          </View>
        ))}
      </View>
      <View style={{ marginTop: 20 }}>
        <Text style={styles.detailText}>List of current schedule</Text>
        <ThemedAppointmentList />
      </View>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    flex: 1,
  },
  body: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  card: {
    width: "48%",
    padding: 15,
    marginVertical: 10,
    borderRadius: 10,
    elevation: 5,
  },
  detailText: {
    marginVertical: 5,
    fontSize: 15,
    fontWeight: "medium",
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  textContainer: {
    marginLeft: 15,
    flex: 1,
  },
  label: {
    marginTop: 10,
    fontWeight: "medium",
    fontSize: 14,
  },
  value: {
    marginTop: 5,
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default index;
