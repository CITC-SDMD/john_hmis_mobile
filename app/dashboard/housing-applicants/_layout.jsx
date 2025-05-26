import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useColorScheme } from "react-native";
import { Colors } from "../../../constants/Colors";
import { Tabs } from "expo-router";

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme] ?? Colors.light;

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: theme.btn,
        headerShown: false,
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
