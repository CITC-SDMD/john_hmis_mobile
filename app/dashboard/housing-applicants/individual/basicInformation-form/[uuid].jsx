import React, { useState, useEffect, useCallback, useRef } from 'react';
import { StyleSheet, AppState, Text } from "react-native";
import { ALERT_TYPE, Toast } from "react-native-alert-notification";
import { useLocalSearchParams, router } from "expo-router";
import { format } from "date-fns";
import NetInfo from '@react-native-community/netinfo';

// Custom components and services
import ThemedBasicInformation from "../../../../../components/ThemedCensus/ThemedBasicInformation";
import ThemedView from "../../../../../components/ThemedForm/ThemedView";
import { applicationService } from "../../../../../components/API/ApplicationService";
import { useFormsDatabase } from "../../../../../components/Hooks/useCensusFormDatabase";

const CreateForm = () => {
  const { uuid } = useLocalSearchParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [isConnected, setIsConnected] = useState(true);

  const {
    saveFormDataLocal,
  } = useFormsDatabase();

  const showToast = useCallback((title, message, type) => {
    Toast.show({
      title: title,
      textBody: message,
      type: type,
    });
  }, []);

  const networkActionTimeoutRef = useRef(null);

  useEffect(() => {
    NetInfo.fetch().then(state => {
      setIsConnected(state.isConnected && state.isInternetReachable);
    });

    const unsubscribeNetInfo = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected && state.isInternetReachable);

      if (networkActionTimeoutRef.current) {
        clearTimeout(networkActionTimeoutRef.current);
        networkActionTimeoutRef.current = null;
      }
    });

    const handleAppStateChange = (nextAppState) => {
      if (nextAppState === 'active') {
        NetInfo.fetch().then(state => {
          setIsConnected(state.isConnected && state.isInternetReachable);
        });
      }
    };
    const appStateSubscription = AppState.addEventListener('change', handleAppStateChange);

    return () => {
      unsubscribeNetInfo();
      appStateSubscription.remove();
      if (networkActionTimeoutRef.current) {
        clearTimeout(networkActionTimeoutRef.current);
        networkActionTimeoutRef.current = null;
      }
    };
  }, []);

  const handleSubmit = async (form) => {
    setIsSubmitting(true);
    setErrors({});

    try {
      const networkState = await NetInfo.fetch();
      const currentlyConnected = networkState.isConnected && networkState.isInternetReachable;
      if (currentlyConnected) {
        const formData = new FormData();
        formData.append('applicant_uuid', uuid);
        Object.entries(form).forEach(([key, value]) => {
          if (value === null || value === undefined) {
            formData.append(key, '');
          } else if (value instanceof Date) {
            formData.append(key, format(value, "yyyy-MM-dd"));
          } else if (typeof value === 'boolean') {
            formData.append(key, value ? true : false);
          } else if (key !== 'structure' && key !== 'attested_signature') {
            formData.append(key, value);
          }
        });
        if (form.structure?.uri) {
          formData.append('structure', {
            uri: form.structure.uri,
            name: form.structure.name || `structure_${Date.now()}.jpg`,
            type: form.structure.type || 'image/jpeg',
          });
        }
        if (form.attested_signature?.uri) {
          formData.append('attested_signature', {
            uri: form.attested_signature.uri,
            name: form.attested_signature.name || `signature_${Date.now()}.png`,
            type: form.attested_signature.type || 'image/png',
          });
        }

        const response = await applicationService.saveApplication(formData);
        if (response.data) {
          showToast("Successful", "Application created and synced.", ALERT_TYPE.SUCCESS);
          router.push(`/dashboard/housing-applicants/individual/otherInformation-form/${uuid}`);
        } else {
          showToast("API Error", "There was an issue saving to the server.", ALERT_TYPE.WARNING);
        }
      } else {
        await saveFormDataLocal(uuid, form);
        showToast("Offline Save", "Saving to local SQLite database.", ALERT_TYPE.SUCCESS);
        router.push(`/dashboard/housing-applicants/individual/otherInformation-form/${uuid}`);
      }
    } catch (error) {
      showToast("Submission Failed", currentlyConnected ? error : "Could not save offline.", ALERT_TYPE.DANGER);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ThemedView style={[styles.container, { paddingHorizontal: 10 }]} safe={true}>
      <Text style={[styles.connectionStatus, { color: isConnected ? 'green' : 'red' }]}>
        {isConnected ? 'Online' : 'Offline Mode'}
      </Text>
      <ThemedBasicInformation
        uuid={uuid}
        onSubmit={handleSubmit}
        isLoading={isSubmitting}
        error={errors}
      />
    </ThemedView>
  );
};

export default CreateForm;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 30,
  },
  connectionStatus: {
    textAlign: 'center',
    marginBottom: 5,
    fontWeight: 'bold',
  },
  loadingText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    color: '#888',
  },
});
