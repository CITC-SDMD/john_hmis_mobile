import React from "react";
import { TouchableOpacity, Text, StyleSheet, Dimensions } from "react-native";

const windowWidth = Dimensions.get("window").width;

const ThemedSubmit = ({ title, onPress, style, textStyle }) => {
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

export default ThemedSubmit;

const styles = StyleSheet.create({
  button: {
    // backgroundColor: "#2680eb",
    // paddingVertical: 10,
    // paddingHorizontal: 20,
    // borderRadius: 4,
    // alignItems: "center",
    // justifyContent: "center",
    // alignSelf: "center",

    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    // borderWidth: 1,
    // borderColor: '#2680eb',
    borderRadius: 8,
    backgroundColor: '#2680eb',
    paddingHorizontal: 10,
    minHeight: 50,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
});