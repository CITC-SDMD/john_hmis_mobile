import { StyleSheet, Text } from "react-native";
import ThemedView from "../../../../../components/ThemedForm/ThemedView";
import ThemedCard from "../../../../../components/ThemedForm/ThemedCard";
import React from "react";

const createForm = () => {
  return (
    <ThemedView style={styles.container}>
      <Text>sample forssm</Text>
    </ThemedView>
  );
};

export default createForm;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 30,
  },
});
