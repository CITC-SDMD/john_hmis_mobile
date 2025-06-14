import {
  StyleSheet,
  Text,
  View,
  Image,
  useColorScheme,
  TouchableWithoutFeedback,
  Keyboard,
  Dimensions,
} from "react-native";
import { ALERT_TYPE, Toast } from "react-native-alert-notification";
import { Colors } from "../../constants/Colors";
import { authService } from "../../components/API/AuthService";
import { useUserStore } from "../../store/userStore";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ThemedView from "../../components/ThemedForm/ThemedView";
import ThemedInputField from "../../components/ThemedForm/ThemedInputField";
import ThemedCustomButton from "../../components/ThemedForm/ThemedSubmit";
import ThemedError from "../../components/ThemedForm/ThemedError";
import logo from "../../assets/davao_logo.png";
import dcho from "../../assets/dcho.png";
import React, { useState } from "react";
import { useAuthDatabase } from "../../components/hooks/useAuthDatabase";


export default function Login() {
  const { saveTokenToDB } = useAuthDatabase();
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme] ?? Colors.light;
  const windowWidth = Dimensions.get("window").width;
  const router = useRouter();

  const setUser = useUserStore((state) => state.setUser);
  const [form, setForm] = useState({
    email: "citc@admin.com",
    password: "password",
  });
  const [errors, setErrors] = useState([]);

  const submitLogin = async () => {
    try {
      const params = {
        email: 'citc@admin.com',
        password: 'password',
      };
      const response = await authService.login(params);
      if (response.data) {

        const token = response.data.token
        await AsyncStorage.setItem("_token", token);
        await saveTokenToDB(token);
        setUser(response.data.user);
        setErrors({});

        router.replace("/dashboard");
        successAlert(
          "Login Successful",
          "You have been successfully logged in",
          ALERT_TYPE.SUCCESS
        );

      }

    } catch (error) {
      const serverErrors = error.response?.data ?? {};
      setErrors(serverErrors);
    }
  };

  function successAlert(title, message, type) {
    Toast.show({
      title: title,
      textBody: message,
      type: type,
    });
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ThemedView style={styles.container} safe={true}>
        <Image source={dcho} style={styles.dcho} />
        <Text style={styles.title}>Housing Management</Text>
        <Text style={styles.title}>Information System</Text>
        <Text style={[styles.sm_text, { color: theme.text }]}>
          Davao City Housing Office
        </Text>
        <Text style={[styles.sm_sign, { color: theme.text }]}>
          Sign in to your account
        </Text>

        <View style={styles.inputContainer}>
          <ThemedInputField
            style={{ width: windowWidth - 40 }}
            value={form.email}
            onChangeText={(text) => setForm({ ...form, email: text })}
            label="Email address"
          />
          <ThemedError error={errors?.errors?.email?.[0]} />
        </View>

        <View style={styles.inputContainer}>
          <ThemedInputField
            style={{ width: windowWidth - 40 }}
            value={form.password}
            onChangeText={(text) => setForm({ ...form, password: text })}
            secureTextEntry={true}
            label="Password"
          />
          <ThemedError error={errors?.errors?.password?.[0]} />
        </View>

        <View>
          <ThemedCustomButton
            style={{ width: windowWidth - 40 }}
            title="Sign in"
            onPress={submitLogin}
          />
        </View>
        <View style={[styles.reserved, { marginTop: 10 }]}>
          <Image source={logo} style={styles.logo} resizeMode="contain" />
          <Text style={[styles.city, { color: theme.text }]}>
            © 2024 City Government of Davao City.
          </Text>
          <Text style={[styles.city, { color: theme.text }]}>
            All rights reserved.
          </Text>
        </View>
      </ThemedView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  dcho: {
    width: 100,
    height: 100,
    marginVertical: 10,
  },
  logo: {
    width: 120,
    height: undefined,
    aspectRatio: 2,
    marginTop: 10,
  },
  sm_text: {
    fontSize: 14,
    fontWeight: "400",
    marginBottom: 10,
  },
  sm_sign: {
    fontSize: 14,
    fontWeight: "bold",
    marginVertical: 20,
    alignSelf: "flex-start",
    marginLeft: 20,
  },
  reserved: {
    alignItems: "center",
    marginTop: 20,
  },
  city: {
    fontSize: 10,
    fontWeight: "400",
    marginBottom: 2,
  },
  inputContainer: {
    marginBottom: 20,
    paddingHorizontal: 1,
  },
});
