import {
  DrawerContentScrollView,
  DrawerItemList,
} from "@react-navigation/drawer";
import { router } from "expo-router";
import { Drawer } from "expo-router/drawer";
import { Colors } from "../../constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { useUserStore } from "../../store/userStore";
import { authService } from "../../components/API/AuthService";
import { useColorScheme, View, StyleSheet } from "react-native";
import { ALERT_TYPE, Toast } from "react-native-alert-notification";
import ThemedCustomButton from "../../components/ThemedForm/ThemedSubmit";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuthDatabase } from "../../components/hooks/useAuthDatabase";

const CustomDrawerContent = (props) => {
  const { clearToken } = useAuthDatabase();
  const resetUser = useUserStore((state) => state.resetUser);

  async function handleLogout() {
    try {
      try {
        const response = await authService.logout();
        if (response) {
          console.log(response)
        }
      } catch (error) {
        console.warn("Logout API failed:", error);
      }

      await AsyncStorage.removeItem("_token");
      await clearToken();
      resetUser();

      successAlert(
        "Logout Successful",
        "You have been successfully logged out",
        ALERT_TYPE.SUCCESS
      );
      router.replace("/login");
    } catch (error) {
      console.error("Logout error:", error);
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
        <ThemedCustomButton
          style={{ width: "100%" }}
          title="Logout"
          onPress={handleLogout}
        />
      </View>
    </View>
  );
};

const DashboardLayout = () => {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme] ?? Colors.light;

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

const styles = StyleSheet.create({
  logoutContainer: {
    padding: 20,
    borderTopWidth: 1,
    borderColor: "#ccc",
  },
});

export default DashboardLayout;
