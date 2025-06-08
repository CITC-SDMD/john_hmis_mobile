import { StyleSheet } from 'react-native'
import { useLocalSearchParams } from "expo-router";
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
                formData.append('applicant_signature', form.applicant_signature);
            }
            const response = await applicationService.saveOtherInformation(uuid, formData)
            if (response.data) {
                console.log(response.data, 'success')
                successAlert(
                    "Successful",
                    "You have been successfully created application",
                    ALERT_TYPE.SUCCESS
                );
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