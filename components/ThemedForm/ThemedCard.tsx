import { View, useColorScheme, StyleSheet } from "react-native";
import { Colors } from "../../constants/Colors";
import React from "react";

const ThemedCard = ({ style, safe = false, ...props }) => {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme] ?? Colors.light;

  return (
    <View
      style={[{ backgroundColor: theme.backgroundColor }, styles.card, style]}
      {...props}
    />
  );
};

export default ThemedCard;

const styles = StyleSheet.create({
  card: {
    borderRadius: 5,
    padding: 20,
  },
});
