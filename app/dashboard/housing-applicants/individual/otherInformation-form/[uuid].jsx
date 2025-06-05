import { StyleSheet, Text, View } from 'react-native'
import { applicationService } from "../../../../../components/API/ApplicationService";
import { useLocalSearchParams } from "expo-router";
import ThemedView from "../../../../../components/ThemedForm/ThemedView";
import ThemedOtherInformation from "../../../../../components/ThemedCensus/ThemedOtherInformation"
import React, { useState } from 'react'

const otherInformation = () => {
    const { uuid } = useLocalSearchParams();
    const [errors, setErrors] = useState({});


    const handleSubmit = async (form) => {
        try {
            // console.log(form)
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
            }
        } catch (error) {
            console.log(error)
            setErrors(error)
        }
    }

    return (
        <ThemedView style={[styles.container, { paddingHorizontal: 10 }]} safe={true}>
            <ThemedOtherInformation onSubmit={handleSubmit} errors={errors} setErrors={setErrors} />
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