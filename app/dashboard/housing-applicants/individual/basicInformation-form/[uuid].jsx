import ThemedBasicInformation from "../../../../../components/ThemedCensus/ThemedBasicInformation"
import ThemedView from "../../../../../components/ThemedForm/ThemedView";
import { applicationService } from "../../../../../components/API/ApplicationService";
import { StyleSheet } from "react-native";
import { ALERT_TYPE, Toast } from "react-native-alert-notification";
import { useLocalSearchParams, router } from "expo-router";
import { useState } from 'react'

const createForm = () => {
  const { uuid } = useLocalSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleSubmit = async (form) => {
    try {
      setIsLoading(true)
      const formData = new FormData();
      formData.append('applicant_uuid', uuid);
      Object.entries(form).forEach(([key, value]) => {
        if (key === 'structure' && value && typeof value === 'object' && value.uri) {
          formData.append('structure', {
            uri: value.uri,
            name: value.name,
            type: value.type,
          });
        } else if (key !== 'structure') {
          formData.append(key, value ?? '');
        }
      });
      const response = await applicationService.saveApplication(formData)
      if (response.data) {
        successAlert(
          "Successful",
          "You have been successfully created application",
          ALERT_TYPE.SUCCESS
        );
        router.push(`/dashboard/housing-applicants/individual/otherInformation-form/${uuid}`)
        setErrors({});
      }
    } catch (error) {
      setErrors(error);
    } finally {
      setIsLoading(false)
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
    <ThemedView style={[styles.container, { paddingHorizontal: 10 }]} safe={true}>
      <ThemedBasicInformation uuid={uuid}
        onSubmit={handleSubmit}
        isLoading={isLoading}
        error={errors}
      />
    </ThemedView >
  );
};

export default createForm;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 30,
  },
});