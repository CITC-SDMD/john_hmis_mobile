import { StyleSheet, Text, View } from 'react-native'
import { useLocalSearchParams, router } from "expo-router";
import ThemedView from "../../../../../../components/ThemedForm/ThemedView";
import ThemedHousehold from "../../../../../../components/ThemedCensus/ThemedHousehold";
import { applicantHouseholdMemberService } from "../../../../../../components/API/ApplicantHouseholdMemberService";
import { ALERT_TYPE, Toast } from "react-native-alert-notification";
import { format } from "date-fns";
import { useState, useEffect } from 'react';

const updateHousehold = () => {
    const {
        household,
        uuid
    } = useLocalSearchParams();
    const [errors, setErrors] = useState({});

    const handleSubmit = async (form) => {
        try {
            const params = {
                applicant_uuid: uuid,
                firstname: form.firstname,
                middlename: form.middlename,
                lastname: form.lastname,
                relationship_id: form.relationship_id,
                birthdate: form.birthdate ? format(form.birthdate, 'yyyy-MM-dd') : null,
                age: form.age,
                sex: form.sex,
                civil_status: form.civil_status,
                ethnicity: form.ethnicity,
                is_pwd: form.is_pwd ?? false,
                religion: form.religion,
                other_religion: form.other_religion,
                educational_attainment: form.educational_attainment,
                skills: form.skills,
                other_skills: form.other_skills,
                occupation: form.occupation,
                other_occupation: form.other_occupation,
                monthly_income: form.monthly_income,
                sss: form.sss ?? false,
                gsis: form.gsis ?? false,
                philhealth: form.philhealth ?? false,
                fourPs: form.fourPs ?? false,
                others: form.others ?? false,
                pension_source: form.pension_source,
                monthly_pension: form.monthly_pension,
            }
            const response = await applicantHouseholdMemberService.updateApplicantHousehold(household, params)
            if (response.data) {
                successAlert(
                    "Successful",
                    "You have been successfully updated household member",
                    ALERT_TYPE.SUCCESS
                );
                router.back();
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
            <ThemedHousehold onSubmit={handleSubmit} householdUuid={household} />
        </ThemedView>
    )
}

export default updateHousehold

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 30,
    },
})