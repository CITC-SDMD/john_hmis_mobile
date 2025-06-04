import ThemedApplicationForm from "../../../../../components/ThemedCensus/ThemedApplicationForm"
import ThemedView from "../../../../../components/ThemedForm/ThemedView";
import { applicationService } from "../../../../../components/API/ApplicationService";
import { StyleSheet } from "react-native";
import { ALERT_TYPE, Toast } from "react-native-alert-notification";
import { useLocalSearchParams } from "expo-router";
import { useState } from 'react'

const createForm = () => {
  const { uuid } = useLocalSearchParams();
  const [refreshKey, setRefreshKey] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const fetchApplicant = async () => {
    setRefreshKey(prev => prev + 1);
  };

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
        setErrors({});
        successAlert(
          "Successful",
          "You have been successfully created application",
          ALERT_TYPE.SUCCESS
        );
      }
    } catch (error) {
      setErrors(error);
    } finally {
      setIsLoading(false)
    }
  };

  // const handleSubmitRemarks = async (remarks) => {
  //   try {
  //     const formData = new FormData();
  //     formData.append('applicant_uuid', uuid);
  //     Object.entries(remarks).forEach(([key, value]) => {
  //       if (key === 'attested_signature' && value && typeof value === 'object' && value.uri) {
  //         formData.append('attested_signature', {
  //           uri: value.uri,
  //           name: value.name,
  //           type: value.type,
  //         });
  //       } else if (key !== 'attested_signature') {
  //         formData.append(key, value ?? '');
  //       }
  //     });
  //     const response = await applicationService.saveRemarks(uuid, formData)
  //     if (response.data) {
  //       successAlert(
  //         "Successful",
  //         "You have been successfully created remarks",
  //         ALERT_TYPE.SUCCESS
  //       );
  //       setErrors({});
  //     }
  //   } catch (error) {
  //     console.log(error)
  //   }
  // };

  function successAlert(title, message, type) {
    Toast.show({
      title: title,
      textBody: message,
      type: type,
    });
  }

  return (
    <ThemedView style={[styles.container, { paddingHorizontal: 10 }]} safe={true}>
      <ThemedApplicationForm uuid={uuid}
        onSubmit={handleSubmit}
        isLoading={isLoading}
        error={errors}
        // removeErrors={removeErrors}
        // onSubmitRemarks={handleSubmitRemarks}
        onRefreshApplicant={fetchApplicant}
      // refreshKey={refreshKey}
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