import { Stack } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function IndividualLayout() {
  const router = useRouter();
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerLeft: () => (
          <Ionicons
            name="arrow-back"
            size={24}
            style={{ marginLeft: 10 }}
            onPress={() => router.back()}
          />
        ),
      }}
    >
      <Stack.Screen
        name="index"
        options={{
            headerShown: false,
            title: "Individual Applicants",
        }}
      />
      <Stack.Screen
        name="(create)/create"
        options={{
          presentation: "modal",
          title: "Back",
          headerLeft: () => (
            <Ionicons
              name="arrow-back"
              size={20}
              style={{  }}
              onPress={() => router.push("/dashboard/applicants/individual")}
            />
          ),
        }}
      />
    </Stack>
  );
}
