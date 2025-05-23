import { StyleSheet, Text } from "react-native";
import ThemedView from "../../../../../components/ThemedForm/ThemedView";
import ThemedCard from "../../../../../components/ThemedForm/ThemedCard";
import { useLocalSearchParams } from "expo-router";
import React from "react";

const createForm = () => {
  const { uuid } = useLocalSearchParams();

  return (
    <ThemedView style={styles.container}>
      <Text>sample forssm</Text>
      <Text>User UUID: {uuid}</Text>
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
