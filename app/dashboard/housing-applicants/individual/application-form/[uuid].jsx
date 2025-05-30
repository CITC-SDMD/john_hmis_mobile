import { StyleSheet, SafeAreaView, Text, ActivityIndicator } from "react-native";
import ThemedApplicationForm from "../../../../../components/ThemedCensus/ThemedApplicationForm"
import ThemedView from "../../../../../components/ThemedForm/ThemedView";
import { applicationService } from "../../../../../components/API/ApplicationService";
import { ALERT_TYPE, Toast } from "react-native-alert-notification";
import { Colors } from "../../../../../constants/Colors";
import { useLocalSearchParams } from "expo-router";
import { useColorScheme } from "react-native";
import { useState } from 'react'

const createForm = () => {
  const { uuid } = useLocalSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme] ?? Colors.light;

  const handleSubmit = async (form, houseHold) => {
    try {
      // setIsLoading(true)
      const params = {
        applicant_uuid: uuid,
        ...form,
        ...houseHold
      }
      const response = await applicationService.saveApplication(params)
      if (response.data) {
        setErrors({});
        successAlert(
          "Successful",
          "You have been successfully created application",
          ALERT_TYPE.SUCCESS
        );
      }
    } catch (error) {
      console.log('Full error:', error);
      // console.log('number_of_families', error)
      setErrors(error);
    } finally {
      // setIsLoading(false)
    }
  }


  function successAlert(title, message, type) {
    Toast.show({
      title: title,
      textBody: message,
      type: type,
    });
  }

  if (isLoading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.primary} />
        <Text style={{ color: theme.textLight }}>Loading...</Text>
      </SafeAreaView>
    );
  }

  return (
    <ThemedView style={[styles.container, { paddingHorizontal: 10 }]} safe={true}>
      <ThemedApplicationForm uuid={uuid} onSubmit={handleSubmit} isLoading={isLoading} errors={errors} removeErrors={() => setErrors({})} />
    </ThemedView >
  );
};

export default createForm;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 30,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});