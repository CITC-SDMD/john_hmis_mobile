import { StyleSheet, Text, View } from 'react-native'
import { useLocalSearchParams, router } from "expo-router";
import ThemedView from "../../../../../../components/ThemedForm/ThemedView";
import ThemedHousehold from "../../../../../../components/ThemedCensus/ThemedHousehold";
import { applicantHouseholdMemberService } from "../../../../../../components/API/ApplicantHouseholdMemberService";
import { ALERT_TYPE, Toast } from "react-native-alert-notification";
import { useState, useEffect } from 'react';

const updateHousehold = () => {
    const {
        household,
        uuid
    } = useLocalSearchParams();

    // useEffect(() => {
    //     console.log('Applicantuuid', uuid)
    //     console.log('household', household)
    // }, [])
    const [errors, setErrors] = useState({});

    const handleSubmit = async (form) => {
        try {
            const params = {
                applicant_uuid: uuid,
                firstname: form.firstname,
                middlename: form.middlename,
                lastname: form.lastname,
                relationship_id: form.relationship_id,
                birthdate: form.birthdate ? new Date(form.birthdate) : null,
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
                monthly_income: form.monthly_income ? form.monthly_income.replace(/[^0-9]/g, '') : "",
                sss: form.sss ?? false,
                gsis: form.gsis ?? false,
                philhealth: form.philhealth ?? false,
                fourPs: form.fourPs ?? false,
                others: form.others ?? false,
                pension_source: form.pension_source,
                monthly_pension: form.monthly_pension
            }
            console.log("Simplified params:", params);
            const response = await applicantHouseholdMemberService.updateApplicantHousehold(uuid, params)
            if (response.data) {
                console.log(response.data)
                // successAlert(
                //     "Successful",
                //     "You have been successfully updated household member",
                //     ALERT_TYPE.SUCCESS
                // );
                // router.back();
            }
        } catch (error) {
            setErrors(error)
            console.log(error)

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