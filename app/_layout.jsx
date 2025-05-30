import { StatusBar, Platform, Text } from "react-native";
import { MenuProvider } from "react-native-popup-menu";
import { AlertNotificationRoot } from "react-native-alert-notification";
import { Stack } from "expo-router";
import React, { useEffect } from "react";
import { BackHandler } from "react-native";

const RootLayout = () => {

  useEffect(() => {
    const handleBackPress = () => {
      return true;
    };

    if (Platform.OS === "android") {
      BackHandler.addEventListener("hardwareBackPress", handleBackPress);
    }

    return () => {
      if (Platform.OS === "android") {
        BackHandler.addEventListener("hardwareBackPress", handleBackPress);
      }
    };
  }, []);

  return (
    <AlertNotificationRoot theme="light">
      <MenuProvider>
        <StatusBar style="auto" />
        <Stack
          screenOptions={{
            headerShown: false,
            animation: Platform.OS === "ios" ? "default" : "none",
          }}
        >
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="dashboard" />
          <Stack.Screen
            name="index"
            options={{
              title: "Home",
            }}
          />
        </Stack>
      </MenuProvider>
    </AlertNotificationRoot>
  );
};

export default RootLayout;
