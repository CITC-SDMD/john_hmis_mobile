import { StyleSheet, Text, View, SafeAreaView, ActivityIndicator, useColorScheme } from "react-native";
import { DrawerContentScrollView, DrawerItemList } from "@react-navigation/drawer";
import { router } from "expo-router";
import { Drawer } from "expo-router/drawer";
import { Colors } from "../../constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { useUserStore } from "../../store/userStore";
import { authService } from "../../components/API/AuthService";
import { ALERT_TYPE, Toast } from "react-native-alert-notification";
import { useAuthDatabase } from "../../components/Hooks/useAuthDatabase";
import { useBarangayDatabase } from "../../components/Hooks/useBarangaysList";
import { useApplicantsDatabase } from "../../components/Hooks/useApplicantsList";
import React, { useEffect, useState } from "react";

import ThemedSubmit from "../../components/ThemedForm/ThemedSubmit";
import AsyncStorage from "@react-native-async-storage/async-storage";

const CustomDrawerContent = (props) => {
  const { clearToken } = useAuthDatabase();
  const [errors, setErrors] = useState({})
  const resetUser = useUserStore((state) => state.resetUser);

  async function handleLogout() {
    try {
      try {
        const response = await authService.logout();
        if (response) {
          successAlert(
            "Logout Successful",
            "You have been successfully logged out",
            ALERT_TYPE.SUCCESS
          );
        }
      } catch (error) {
        setErrors(error)
      }

      await AsyncStorage.removeItem("_token");
      await clearToken();
      resetUser();
      router.replace("/login");
    } catch (error) {
      setErrors(error)
    }
  }

  function successAlert(title, message, type) {
    Toast.show({
      title: title,
      textBody: message,
      type: type,
    });
  }

  return (
    <View style={{ flex: 1 }}>
      <DrawerContentScrollView {...props} contentContainerStyle={{ flex: 1 }}>
        <DrawerItemList {...props} />
      </DrawerContentScrollView>

      <View style={styles.logoutContainer}>
        <ThemedSubmit
          style={{ width: "100%" }}
          title="Logout"
          onPress={handleLogout}
        />
      </View>
    </View>
  );
};

const DashboardLayout = () => {
  const { loadBarangays } = useBarangayDatabase();
  const { loadApplicants } = useApplicantsDatabase();

  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme] ?? Colors.light;
  const [isLoadingInitialData, setIsLoadingInitialData] = useState(true);
  const [initialDataError, setInitialDataError] = useState(null);
  const applicantTypesToSync = ['new', 'schedule', 'approved', 'disapproved'];

  useEffect(() => {
    const syncAllInitialData = async () => {
      setIsLoadingInitialData(true);
      setInitialDataError(null);

      try {
        try {
          const barangaysResponse = await loadBarangays();
          console.log("Barangays loaded successfully.");
        } catch (error) {
          console.error("Error loading barangays:", error);
        }

        const applicantPromises = applicantTypesToSync.map(async (type) => {
          try {
            const response = await loadApplicants(type);
            console.log(`Applicants (${type}) loaded successfully.`);
          } catch (error) {
            console.error(`Error loading applicants (${type}):`, error);
          }
        });

        await Promise.all(applicantPromises);

      } catch (overallError) {
        console.error("Overall initial data sync failed:", overallError);
        setInitialDataError(overallError);
      } finally {
        setIsLoadingInitialData(false);
      }
    };

    syncAllInitialData();
  }, []);

  if (isLoadingInitialData) {
    return (
      <SafeAreaView style={[styles.loadingContainer, { backgroundColor: theme.background }]}>
        <ActivityIndicator size="large" color={theme.primary} />
        <Text style={{ color: theme.text, marginTop: 10 }}>Loading data...</Text>
        {initialDataError && (
          <Text style={{ color: theme.error, marginTop: 20, textAlign: 'center' }}>
            {initialDataError || "An error occurred while loading data."}
          </Text>
        )}
      </SafeAreaView>
    );
  }

  return (
    <Drawer
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.blue,
        },
        headerTintColor: "#fff",
        drawerActiveTintColor: theme.blue,
      }}
    >
      <Drawer.Screen
        name="index"
        options={{
          title: "Dashboard",
          drawerLabel: "Home",
          drawerIcon: ({ color }) => (
            <Ionicons name="home" size={24} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="housing-applicants"
        options={{
          title: "Applicants",
          drawerLabel: "Applicants",
          drawerIcon: ({ color }) => (
            <Ionicons name="people" size={24} color={color} />
          ),
        }}
      />

    </Drawer>
  );
};

export default DashboardLayout;

const styles = StyleSheet.create({
  logoutContainer: {
    padding: 20,
    borderTopWidth: 1,
    borderColor: "#ccc",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});