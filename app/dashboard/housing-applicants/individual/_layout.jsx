import { Stack, router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function IndividualLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        headerLeft: () => (
          <Ionicons
            name="arrow-back"
            size={28}
            color="#2680eb"
            style={{ marginRight: 10 }}
            onPress={() => router.back()}
          />
        ),
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          headerShown: false,
        }}
      />
      {/* <Stack.Screen
        name="application-form/[uuid]"
        options={{
          headerShown: true,
          title: "Application Form",
          headerTitleStyle: {
            fontSize: 12,
            fontWeight: "500",
            color: "#2680eb",
          },
        }}
      /> */}
    </Stack>
  );
}
