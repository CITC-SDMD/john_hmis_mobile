import { StyleSheet, Text, View } from "react-native";
import React from "react";

const ThemedLabel = ({ style, label, required = false }) => {
  return (
    <View style={styles.container}>
      {label && (
        <View style={{ flexDirection: 'row' }}>
          <Text style={styles.label}>{label}</Text>
          {required && <Text style={{ color: 'red', marginLeft: 4 }}>*</Text>}
        </View>
      )}
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
    fontWeight: '600',
    color: '#4A5568',
    marginBottom: 8,
  },
});
