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
            color={"#2680eb"}
            size={28}
            style={{ marginRight: 5 }}
            onPress={() =>
              router.push("/dashboard/housing-applicants/individual")
            }
          />
        ),
      }}
    >
      <Stack.Screen
        name="application-form/[uuid]"
        options={{
          headerShown: true,
          title: "Application form",
          headerTitleStyle: {
            fontSize: 12,
            fontWeight: 500,
            color: "#2680eb",
          },
        }}
      />
      <Stack.Screen
        name="index"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
}
