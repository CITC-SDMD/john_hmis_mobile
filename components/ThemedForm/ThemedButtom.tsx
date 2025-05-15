import React from "react";
import { TouchableOpacity, Text, StyleSheet, Dimensions } from "react-native";

const windowWidth = Dimensions.get("window").width;

const CustomButton = ({ title, onPress, style, textStyle }) => {
  return (
    <TouchableOpacity
      style={[styles.button, style]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Text style={[styles.buttonText, textStyle]}>{title}</Text>
    </TouchableOpacity>
  );
};

export default CustomButton;

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#2680eb",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
  },
});
