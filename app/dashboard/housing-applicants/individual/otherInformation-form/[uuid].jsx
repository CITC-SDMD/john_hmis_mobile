import { StyleSheet } from 'react-native'
import { useLocalSearchParams, router } from "expo-router";
import { applicationService } from "../../../../../components/API/ApplicationService";
import { ALERT_TYPE, Toast } from "react-native-alert-notification";
import ThemedView from "../../../../../components/ThemedForm/ThemedView";
import ThemedOtherInformation from "../../../../../components/ThemedCensus/ThemedOtherInformation"
import React, { useState } from 'react'

const otherInformation = () => {
    const { uuid } = useLocalSearchParams();
    const [errors, setErrors] = useState({});

    const handleSubmit = async (form) => {
        try {
            const formData = new FormData();
            formData.append('applicant_uuid', uuid);
            formData.append('is_remittance', form.is_remittance);
            formData.append('remittance', form.remittance ?? '');
            formData.append('have_property', form.have_property);
            formData.append('is_awarded', form.is_awarded);
            formData.append('awarded', form.awarded ?? '');
            if (form.applicant_signature) {
                if (typeof form.applicant_signature === 'string') {
                    formData.append('applicant_signature_url', form.applicant_signature);
                } else if (form.applicant_signature) {
                    formData.append('applicant_signature', form.applicant_signature);
                }
            }
            const response = await applicationService.saveOtherInformation(uuid, formData)
            if (response.data) {
                successAlert(
                    "Successful",
                    "You have been successfully created application",
                    ALERT_TYPE.SUCCESS
                );
                router.push(`/dashboard/housing-applicants/individual`)
            }
        } catch (error) {
            setErrors(error)
        }
    }

    function successAlert(title, message, type) {
        Toast.show({
            title: title,
            textBody: message,
            type: type,
        });
    }


    return (
        <ThemedView style={[styles.container, { paddingHorizontal: 10 }]} safe={true}>
            <ThemedOtherInformation onSubmit={handleSubmit} uuid={uuid} />
        </ThemedView>
    )
}

export default otherInformation

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 30,
    },
})