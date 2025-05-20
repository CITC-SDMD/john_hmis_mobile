import { StyleSheet, Text, View } from "react-native";
import React from "react";

const ThemedLabel = ({ style, label, required = false }) => {
  return (
    <View style={styles.container}>
      <Text style={[styles.label, style]}>{label}</Text>
      {required && <Text style={{ color: "red", marginLeft: 6 }}>*</Text>}
    </View>
  );
};

export default ThemedLabel;

const styles = StyleSheet.create({
  container: {
    marginBottom: 8,
    flexDirection: "row",
    alignItems: "center",
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    color: "#2D3748",
    marginBottom: 4,
  },
});
