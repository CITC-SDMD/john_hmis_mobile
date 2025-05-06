import { StatusBar } from "react-native";
import { AlertNotificationRoot} from 'react-native-alert-notification';
import { Stack } from "expo-router";
import React from "react";

const RootLayout = () => {
  return (
    <AlertNotificationRoot theme="light">
      <StatusBar styles="auto" />
      <Stack>
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="dashboard" options={{ headerShown: false }} />
        <Stack.Screen 
          name="index" 
          options={{ 
            headerShown: false, 
            title: "Home", 
            animation: "none" 
          }}
        />
      </Stack>
    </AlertNotificationRoot>
  );
};

export default RootLayout;
