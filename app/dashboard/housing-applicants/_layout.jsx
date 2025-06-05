import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useColorScheme } from "react-native";
import { Colors } from "../../../constants/Colors";
import { Tabs, usePathname } from "expo-router";

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const pathname = usePathname();
  const theme = Colors[colorScheme] ?? Colors.light;

  const hideTabPaths = [
    "/dashboard/housing-applicants/individual/basicInformation-form/",
    "/dashboard/housing-applicants/individual/otherInformation-form/"

  ]

  const hideTabs = hideTabPaths.some(path => pathname.startsWith(path));
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: theme.btn,
        headerShown: false,
        tabBarStyle: hideTabs ? { display: "none" } : {},
      }}
    >
      <Tabs.Screen
        name="individual"
        options={{
          title: "Individual",
          tabBarIcon: ({ color }) => (
            <FontAwesome size={24} name="user" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="association"
        options={{
          title: "Association",
          tabBarIcon: ({ color }) => (
            <FontAwesome size={24} name="users" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
