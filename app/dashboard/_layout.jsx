import { router } from "expo-router";
import { Drawer } from "expo-router/drawer";
import { Colors } from "../../constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { useColorScheme, View, StyleSheet } from "react-native";
import { DrawerContentScrollView, DrawerItemList } from "@react-navigation/drawer";
import { authService } from "../../components/API/AuthService";
import { useUserStore } from "../../store/userStore";
import { ALERT_TYPE, Toast } from "react-native-alert-notification";
import ThemedCustomButton from "../../components/ThemedForm/ThemedButtom";
import AsyncStorage from "@react-native-async-storage/async-storage";

const CustomDrawerContent = (props) => {
  const resetUser = useUserStore((state) => state.resetUser);
  async function handleLogout() {
    try {
      const response = await authService.logout();
      if (response) {
        AsyncStorage.removeItem("_token");
        resetUser();
        successAlert(
          "Logout Successful",
          "You have been successfully logged out",
          ALERT_TYPE.SUCCESS
        );
        router.replace("/(auth)/login");
      }
    } catch (error) {
      console.log("Logout error:", error);
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
          backgroundColor: theme.primary,
        },
        headerTintColor: "#fff",
        drawerActiveTintColor: theme.primary,
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
        name="applicants"
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
