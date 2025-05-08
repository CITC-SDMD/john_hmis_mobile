import {
  Text,
  SafeAreaView,
  ActivityIndicator,
  useColorScheme,
} from "react-native";
import { Colors } from "../../constants/Colors";
import React from "react";

// type ThemedLoadingProps = {
//   isLoading?: boolean;
// };

const ThemedLoading = (props: boolean) => {
//   const { isLoading = false } = props;
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme] ?? Colors.light;

//   if (!isLoading) return null;

 if(props) {
     return (
    <SafeAreaView
      style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
    >
      <ActivityIndicator size="large" color={theme.primary} />
      <Text style={{ color: theme.textLight }}>Loading...</Text>
    </SafeAreaView>
  );
 }
};

export default ThemedLoading;
