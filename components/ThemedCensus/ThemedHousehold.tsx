import { StyleSheet, Text, View, TextInput, ScrollView, SafeAreaView, ActivityIndicator } from 'react-native'
import { format } from "date-fns";
import { useColorScheme } from "react-native";
import { Colors } from "../../constants/Colors";
import ThemedError from "../ThemedForm/ThemedError";
import ThemedHouseholdForm from "../Validation/ThemedHouseholdForm";
import ThemedInputField from "../ThemedForm/ThemedInputField"
import ThemedSubmit from '../ThemedForm/ThemedSubmit'
import ThemedButton from "../ThemedForm/ThemedButton";
import ThemedDate from "../ThemedForm/ThemedDate";
import ThemedRadioBtn from "../ThemedForm/ThemedRadioBtn";
import { relationService } from "../../components/API/RelationshipService";
import { applicantHouseholdMemberService } from "../../components/API/ApplicantHouseholdMemberService";
import ThemedDropdown from "../ThemedForm/ThemedDropdown";
import { FontAwesome6 } from "@expo/vector-icons";
import { useState, useEffect } from 'react'

const ThemedHousehold = ({ householdUuid, onSubmit }) => {
    const colorScheme = useColorScheme();
    const theme = Colors[colorScheme] ?? Colors.light;
    const [form, setForm] = useState({
        firstname: '',
        middlename: '',
        lastname: '',
        relation: '',
        birthdate: null,
        age: '',
        sex: '',
        civil_status: '',
        ethnicity: '',
        is_pwd: false,
        religion: '',
        other_religion: '',
        educational_attainment: '',
        skills: '',
        other_skills: '',
        occupation: '',
        other_occupation: '',
        monthly_income: '',
        sss: false,
        gsis: false,
        philhealth: false,
        fourPs: false,
        others: false,
        pension_source: '',
        monthly_pension: '',
        relationship_id: '',
    });

    const [relation, setRelation] = useState([]);
    const [showBirthDatePicker, setBirthdatePicker] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState(null)

    const showBirthDate = () => setBirthdatePicker(true);

    useEffect(() => {
        fetchRelation()
        fetchHousehold()
    }, [])

    const fetchHousehold = async () => {
        try {
            const response = await applicantHouseholdMemberService.getApplicantHouseholdByUuid(householdUuid)
            if (response.data) {
                const data = response.data;
                console.log(data)

                setForm(prev => ({
                    ...prev,
                    lastname: data.lastname,
                    firstname: data.firstname,
                    middlename: data.middlename,
                    relationship_id: data.relationship.id,
                    birthdate: data.birthdate ? new Date(data.birthdate) : null,
                    age: data.age,
                    sex: data.sex,
                    civil_status: data.civil_status,
                    is_pwd: data.is_pwd,
                    ethnicity: data.ethnicity,
                    religion: data.religion,
                    other_religion: data.other_religion,
                    educational_attainment: data.educational_attainment,
                    skills: data.skills,
                    other_skills: data.other_skills,
                    occupation: data.occupation,
                    other_occupation: data.other_occupation,
                    monthly_income: data.monthly_income,
                    sss: data.sss,
                    gsis: data.gsis,
                    philhealth: data.philhealth,
                    fourPs: data.fourPs,
                    others: data.others,
                    pension_source: data.pension_source,
                    monthly_pension: data.monthly_pension,
                }))
            }
        } catch (error) {
            setErrors(error)
        }
    }

    useEffect(() => {
        setForm(prev => ({
            ...prev,
            monthly_pension: !prev.pension_source ? '' : prev.monthly_pension,
            other_religion: prev.religion !== "Others" ? '' : prev.other_religion,
            other_skills: prev.skills !== "Others" ? '' : prev.other_skills,
            other_occupation: prev.occupation !== "Others" ? '' : prev.other_occupation,
        }));
    }, [form.pension_source, form.religion, form.skills, form.occupation]);

    const fetchRelation = async () => {
        try {
            setIsLoading(true)
            const response = await relationService.getRelations()
            if (response.data) {
                const formattedData = response.data.map(item => ({
                    value: item.id,
                    label: item.status,
                }));
                setRelation(formattedData);
            }
        } catch (error) {
            setErrors(error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleDateChange = (selectDate: any) => {
        setForm(value => ({ ...value, birthdate: selectDate }));
        close();
    };

    const close = () => {
        setBirthdatePicker(false);
    };

    const handleSubmit = async () => {
        try {
            if (onSubmit) {
                onSubmit(form);
                await ThemedHouseholdForm.validate(form, { abortEarly: false });
                setErrors
            }
        } catch (validationError) {
            console.log(validationError, 'validationError')
            const formattedErrors: any = {};
            if (validationError.inner) {
                validationError.inner.forEach((err: any) => {
                    formattedErrors[err.path] = err.message;
                });
            }
            setErrors((prev: any) => ({
                ...prev,
                ...formattedErrors,
            }));
        }
    }

    const ethnicity = [
        { label: 'Ata', value: 'Ata' },
        { label: 'Maguindanaon', value: 'Maguindanaon' },
        { label: 'Matigsalug', value: 'Matigsalug' },
        { label: 'Bagobo Klata', value: 'Bagobo Klata' },
        { label: 'Maranao', value: 'Maranao' },
        { label: 'Obo Manuvu', value: 'Obo Manuvu' },
        { label: 'Bagobo-Tagabawa', value: 'Bagobo-Tagabawa' },
        { label: 'Tasug', value: 'Tasug' },
        { label: 'Sama', value: 'Sama' },
        { label: 'Iranun', value: 'Iranun' },
        { label: 'Kagan', value: 'Kagan' },
        { label: 'Non IP', value: 'Non-IP' },
        { label: 'Other IP Groups', value: 'Other IP Groups' },
    ]

    const religion = [
        { label: 'Roman Catholic', value: 'Roman Catholic' },
        { label: 'Born-Again Christian/Christianity', value: 'Born-Again Christian/Christianity' },
        { label: 'Protestant', value: 'Protestant' },
        { label: 'Islam', value: 'Islam' },
        { label: 'Iglesia ni Cristo', value: 'Iglesia ni Cristo' },
        { label: 'Buddhism', value: 'Buddhism' },
        { label: 'Hinduism', value: 'Hinduism' },
        { label: 'Jehovah Witness', value: 'Jehovah Witness' },
        { label: 'Evangelical', value: 'Evangelical' },
        { label: 'Atheist', value: 'Atheist' },
        { label: 'Agnostic', value: 'Agnostic' },
        { label: 'Indigenous Religion', value: 'Indigenous Religion' },
        { label: 'Others', value: 'Others' },
    ]

    const skills = [
        { label: 'Construction Skills', value: 'Construction Skills' },
        { label: 'Agricultural Skills', value: 'Agricultural Skills' },
        { label: 'Small Business Management', value: 'Small Business Management' },
        { label: 'Carpentry', value: 'Carpentry' },
        { label: 'Driving Skills', value: 'Driving Skills' },
        { label: 'Customer Service Skills', value: 'Customer Service Skills' },
        { label: 'Food and Beverage Skills', value: 'Food and Beverage Skills' },
        { label: 'Electrical Skills', value: 'Electrical Skills' },
        { label: 'Plumbing Skills', value: 'Plumbing Skills' },
        { label: 'Welding Skills', value: 'Welding Skills' },
        { label: 'Mechanical Repair Skills', value: 'Mechanical Repair Skills' },
        { label: 'IT/Computer Skills', value: 'IT/Computer Skills' },
        { label: 'Teaching/Tutoring Skills', value: 'Teaching/Tutoring Skills' },
        { label: 'Healthcare Skills', value: 'Healthcare Skills' },
        { label: 'Sales and Marketing Skills', value: 'Sales and Marketing Skills' },
        { label: 'Security/Surveillance Skills', value: 'Security/Surveillance Skills' },
        { label: 'Project Management Skills', value: 'Project Management Skills' },
        { label: 'Artistic Skills', value: 'Artistic Skills' },
        { label: 'Others', value: 'Others' },
    ]

    const educational_attainment = [
        { label: 'No Formal Education', value: 'No Formal Education' },
        { label: 'Elementary Level', value: 'Elementary Level' },
        { label: 'Elementary Graduate', value: 'Elementary Graduate' },
        { label: 'Highschool Level', value: 'Highschool Level' },
        { label: 'Highschool Graduate', value: 'Highschool Graduate' },
        { label: 'General Education Development', value: 'General Education Development' },
        { label: 'College Level', value: 'College Level' },
        { label: 'College Graduate', value: 'College Graduate' },
        { label: 'Masteral', value: 'Masteral' },
        { label: 'Doctorate', value: 'Doctorate' },
        { label: 'Vocational', value: 'Vocational' },
        { label: 'Alternative Learning Program (ALS)', value: 'Alternative Learning Program (ALS)' },
    ]

    const occupation = [
        { label: 'Agriculture/Farming', value: 'Agriculture/Farming' },
        { label: 'Business Owner/Entrepreneur', value: 'Business Owner/Entrepreneur' },
        { label: 'Carpenter', value: 'Carpenter' },
        { label: 'Civil Servant/Government Employee', value: 'Civil Servant/Government Employee' },
        { label: 'Construction Worker', value: 'Construction Worker' },
        { label: 'Customer Service Representative', value: 'Customer Service Representative' },
        { label: 'Driver', value: 'Driver' },
        { label: 'Educator/Teacher', value: 'Educator/Teacher' },
        { label: 'Electrician', value: 'Electrician' },
        { label: 'Engineer', value: 'Engineer' },
        { label: 'Farmer', value: 'Farmer' },
        { label: 'Fisherman', value: 'Fisherman' },
        { label: 'Health Worker/Nurse/Doctor', value: 'Health Worker/Nurse/Doctor' },
        { label: 'Homemaker', value: 'Homemaker' },
        { label: 'IT Professional', value: 'IT Professional' },
        { label: 'Laborer', value: 'Laborer' },
        { label: 'Lawyer', value: 'Lawyer' },
        { label: 'Mechanic', value: 'Mechanic' },
        { label: 'Military/Police', value: 'Military/Police' },
        { label: 'Office Worker', value: 'Office Worker' },
        { label: 'Plumber', value: 'Plumber' },
        { label: 'Retail/Sales', value: 'Retail/Sales' },
        { label: 'Security Guard', value: 'Security Guard' },
        { label: 'Skilled Artisan/Craftsman', value: 'Skilled Artisan/Craftsman' },
        { label: 'Small Shop Owner', value: 'Small Shop Owner' },
        { label: 'Street Vendor', value: 'Street Vendor' },
        { label: 'Student', value: 'Student' },
        { label: 'Technician', value: 'Technician' },
        { label: 'Unemployed', value: 'Unemployed' },
        { label: 'Utility Worker', value: 'Utility Worker' },
        { label: 'Waitstaff/Food Service', value: 'Waitstaff/Food Service' },
        { label: 'Welder', value: 'Welder' },
        { label: 'Others', value: 'Others' },
    ]

    const pension_source = [
        { label: 'SSS', value: 'sss' },
        { label: 'GSIS', value: 'gsis' },
        { label: 'Social Pension', value: 'Social Pension' },
        { label: 'Others', value: 'others' },
    ]

    if (isLoading) {
        return (
            <SafeAreaView style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={theme.primary} />
                <Text style={{ color: theme.textLight }}>Loading data...</Text>
            </SafeAreaView>
        );
    }

    return (
        <ScrollView>
            <View style={[styles.row, { marginTop: 20 }]}>
                <View style={{ flex: 1 }}>
                    <ThemedInputField
                        required={true}
                        label="Last name"
                        value={form.lastname}
                        onChangeText={(value) => {
                            setForm(prev => ({ ...prev, lastname: value }))
                            if (errors?.['lastname']) {
                                setErrors(prev => ({ ...prev, lastname: undefined }));
                            }
                        }}
                    />
                    <ThemedError error={errors?.lastname || errors?.errors?.lastname?.[0]} />

                </View>

                <View style={{ flex: 1 }}>
                    <ThemedInputField
                        required={true}
                        label="First name"
                        value={form.firstname}
                        onChangeText={(value) => {
                            setForm(prev => ({ ...prev, firstname: value }))
                            if (errors?.['firstname']) {
                                setErrors(prev => ({ ...prev, firstname: undefined }));
                            }
                        }}
                    />
                    <ThemedError error={errors?.firstname || errors?.errors?.firstname?.[0]} />
                </View>
            </View>
            <View style={[styles.row]}>
                <View style={{ flex: 1 }}>
                    <ThemedInputField
                        required={true}
                        label="Middle name"
                        value={form.middlename}
                        onChangeText={(value) => {
                            setForm(prev => ({ ...prev, middlename: value }))
                            if (errors?.['middlename']) {
                                setErrors(prev => ({ ...prev, middlename: undefined }));
                            }
                        }}
                    />
                    <ThemedError error={errors?.middlename || errors?.errors?.middlename?.[0]} />
                </View>
                <View style={{ flex: 1 }}>
                    <ThemedDropdown
                        required={true}
                        label="Relation to the Household Head "
                        value={form.relationship_id}
                        onChangeText={(value) => {
                            setForm({ ...form, relationship_id: value });
                            if (errors?.['relationship_id']) {
                                setErrors(prev => ({ ...prev, relationship_id: undefined }));
                            }
                        }}
                        items={relation}
                        icon={() => <FontAwesome6 name="chevron-down" size={14} color="#2680eb" />}
                    />
                    <ThemedError error={errors?.relationship_id || errors?.errors?.relationship_id?.[0]} />
                </View>

            </View>

            <View style={[styles.row]}>
                <View style={{ flex: 1 }}>
                    <ThemedButton label="Birthdate" onPress={showBirthDate}
                        icon={() => <FontAwesome6 name="calendar" size={18} color="#2680eb" />}
                    >
                        <TextInput
                            style={styles.inputWithIcon}
                            value={form.birthdate ? format(form.birthdate, "MMMM dd, yyyy") : ""}
                            editable={false}
                            pointerEvents="none"
                            placeholder="Select date"
                            placeholderTextColor="#A0AEC0"
                        />
                    </ThemedButton>
                    <ThemedDate
                        date={form.birthdate || new Date()}
                        handleConfirm={handleDateChange}
                        hidePicker={() => close()}
                        isPickerVisible={showBirthDatePicker}
                    />
                </View>
                <View style={{ flex: 1 }}>
                    <ThemedInputField
                        required={true}
                        keyboardType="numeric"
                        label="Age"
                        value={String(form.age ?? '')}
                        onChangeText={(value) => {
                            setForm(prev => ({ ...prev, age: value }))
                            if (errors?.['age']) {
                                setErrors(prev => ({ ...prev, age: undefined }));
                            }
                        }}
                    />
                    <ThemedError error={errors?.age || errors?.errors?.age?.[0]} />
                </View>
            </View>

            <View style={[styles.row]}>
                <View style={[styles.inputWrapper, { flex: 1, padding: 5 }]}>
                    <ThemedRadioBtn
                        required={true}
                        label="Sex"
                        onChangeText={(value) => {
                            setForm(prev => ({ ...prev, sex: value }))
                            if (errors?.['sex']) {
                                setErrors(prev => ({ ...prev, sex: undefined }));
                            }
                        }}
                        options={[
                            { label: 'Male', value: 'male' },
                            { label: 'Female', value: 'female' },
                        ]}
                        selected={form.sex}
                    />
                    <ThemedError error={errors?.sex || errors?.errors?.sex?.[0]} />
                </View>
                <View style={[styles.inputWrapper, { flex: 1, padding: 5 }]}>
                    <ThemedRadioBtn
                        required={true}
                        label="Civil Status"
                        onChangeText={(value) => {
                            setForm(prev => ({ ...prev, civil_status: value }));
                            if (errors?.['civil_status']) {
                                setErrors(prev => ({ ...prev, civil_status: undefined }));
                            }
                        }}
                        options={[
                            { label: 'Single', value: 'single' },
                            { label: 'Married', value: 'married' },
                            { label: 'Separated', value: 'separated' },
                            { label: 'Widow/er', value: 'widow' },
                        ]}
                        selected={form.civil_status}
                    />
                    <ThemedError error={errors?.civil_status || errors?.errors?.civil_status?.[0]} />
                </View>
                <View style={[styles.inputWrapper, { flex: 1, padding: 5 }]}>
                    <ThemedRadioBtn
                        label="PWD"
                        onChangeText={(value) => {
                            setForm(prev => ({ ...prev, is_pwd: value }))
                        }}
                        options={[
                            { label: 'Yes', value: true },
                            { label: 'No', value: false },
                        ]}
                        selected={form.is_pwd}
                    />
                </View>
            </View>

            <View style={[styles.row, { marginTop: 10 }]}>
                <View style={{ flex: 1 }}>
                    <ThemedDropdown
                        required={true}
                        label="Ethnicity "
                        value={form.ethnicity}
                        onChangeText={(value) => {
                            setForm({ ...form, ethnicity: value });
                            if (errors?.['ethnicity']) {
                                setErrors(prev => ({ ...prev, ethnicity: undefined }));
                            }
                        }}
                        items={ethnicity}
                        icon={() => <FontAwesome6 name="chevron-down" size={14} color="#2680eb" />}
                    />
                    <ThemedError error={errors?.ethnicity || errors?.errors?.ethnicity?.[0]} />
                </View>
                <View style={{ flex: 1 }}>
                    <ThemedDropdown
                        required={true}
                        label="Religion "
                        value={form.religion}
                        onChangeText={(value) => {
                            setForm({ ...form, religion: value });
                            if (errors?.['religion']) {
                                setErrors(prev => ({ ...prev, religion: undefined }));
                            }
                        }}
                        items={religion}
                        icon={() => <FontAwesome6 name="chevron-down" size={14} color="#2680eb" />}
                    />
                    <ThemedError error={errors?.religion || errors?.errors?.religion?.[0]} />
                </View>
            </View>

            {form.religion === "Others" &&
                <View style={{ flex: 1 }}>
                    <ThemedInputField
                        required={true}
                        label="Specify religion"
                        value={form.other_religion}
                        onChangeText={(value) => {
                            setForm(prev => ({ ...prev, other_religion: value }))
                            if (errors?.['other_religion']) {
                                setErrors(prev => ({ ...prev, other_religion: undefined }));
                            }
                        }}
                    />
                    <ThemedError error={errors?.other_religion || errors?.errors?.other_religion?.[0]} />
                </View>
            }

            <View style={[styles.row]}>
                <View style={{ flex: 1 }}>
                    <ThemedDropdown
                        required={true}
                        label="Educational Attainment "
                        value={form.educational_attainment}
                        onChangeText={(value) => {
                            setForm({ ...form, educational_attainment: value });
                            if (errors?.['educational_attainment']) {
                                setErrors(prev => ({ ...prev, educational_attainment: undefined }));
                            }
                        }}
                        items={educational_attainment}
                        icon={() => <FontAwesome6 name="chevron-down" size={14} color="#2680eb" />}
                    />
                    <ThemedError error={errors?.educational_attainment || errors?.errors?.educational_attainment?.[0]} />
                </View>
                <View style={{ flex: 1 }}>
                    <ThemedDropdown
                        required={true}
                        label="Employable Skills "
                        value={form.skills}
                        onChangeText={(value) => {
                            setForm({ ...form, skills: value });
                            if (errors?.['skills']) {
                                setErrors(prev => ({ ...prev, skills: undefined }));
                            }
                        }}
                        items={skills}
                        icon={() => <FontAwesome6 name="chevron-down" size={14} color="#2680eb" />}
                    />
                    <ThemedError error={errors?.skills || errors?.errors?.skills?.[0]} />
                </View>
            </View>

            {form.skills === "Others" &&
                <View style={{ flex: 1 }}>
                    <ThemedInputField
                        required={true}
                        label="Specify skills"
                        value={form.other_skills}
                        onChangeText={(value) => {
                            setForm(prev => ({ ...prev, other_skills: value }))
                            if (errors?.['other_skills']) {
                                setErrors(prev => ({ ...prev, other_skills: undefined }));
                            }
                        }}
                    />
                    <ThemedError error={errors?.other_skills || errors?.errors?.other_skills?.[0]} />
                </View>
            }


            <View style={[styles.row]}>
                <View style={{ flex: 1 }}>
                    <ThemedDropdown
                        required={true}
                        label="Occupation "
                        value={form.occupation}
                        onChangeText={(value) => {
                            setForm({ ...form, occupation: value });
                            if (errors?.['occupation']) {
                                setErrors(prev => ({ ...prev, occupation: undefined }));
                            }
                        }}
                        items={occupation}
                        icon={() => <FontAwesome6 name="chevron-down" size={14} color="#2680eb" />}
                    />
                    <ThemedError error={errors?.occupation || errors?.errors?.occupation?.[0]} />
                </View>

                <View style={{ flex: 1 }}>
                    <ThemedInputField
                        required={true}
                        keyboardType="numeric"
                        label="Monthly Income"
                        value={form.monthly_income}
                        onChangeText={(value) => {
                            setForm(prev => ({ ...prev, monthly_income: value }))
                            if (errors?.['monthly_income']) {
                                setErrors(prev => ({ ...prev, monthly_income: undefined }));
                            }
                        }}
                    />
                    <ThemedError error={errors?.monthly_income || errors?.errors?.monthly_income?.[0]} />
                </View>
            </View>


            {form.occupation === "Others" &&
                <View style={{ flex: 1 }}>
                    <ThemedInputField
                        required={true}
                        label="Specify occupation "
                        value={form.other_occupation}
                        onChangeText={(value) => {
                            setForm(prev => ({ ...prev, other_occupation: value }))
                            if (errors?.['other_occupation']) {
                                setErrors(prev => ({ ...prev, other_occupation: undefined }));
                            }
                        }}
                    />
                    <ThemedError error={errors?.other_occupation || errors?.errors?.other_occupation?.[0]} />
                </View>
            }

            <View style={[styles.row,]}>
                <View style={[styles.inputWrapper, { flex: 1, padding: 5 }]}>
                    <ThemedRadioBtn
                        label="SSS"
                        onChangeText={(value) => {
                            setForm(prev => ({ ...prev, sss: value }))
                        }}
                        options={[
                            { label: 'Yes', value: true },
                            { label: 'No', value: false },
                        ]}
                        selected={form.sss}
                    />
                </View>
                <View style={[styles.inputWrapper, { flex: 1, padding: 5 }]}>
                    <ThemedRadioBtn
                        label="GSIS"
                        onChangeText={(value) => {
                            setForm(prev => ({ ...prev, gsis: value }))
                        }}
                        options={[
                            { label: 'Yes', value: true },
                            { label: 'No', value: false },
                        ]}
                        selected={form.gsis}
                    />
                </View>
            </View>

            <View style={[styles.row, { marginTop: 15 }]}>
                <View style={[styles.inputWrapper, { flex: 1, padding: 5 }]}>
                    <ThemedRadioBtn
                        label="PHILHEALTH"
                        onChangeText={(value) => {
                            setForm(prev => ({ ...prev, philhealth: value }))
                        }}
                        options={[
                            { label: 'Yes', value: true },
                            { label: 'No', value: false },
                        ]}
                        selected={form.philhealth}
                    />
                </View>
                <View style={[styles.inputWrapper, { flex: 1, padding: 5 }]}>
                    <ThemedRadioBtn
                        label="4Ps"
                        onChangeText={(value) => {
                            setForm(prev => ({ ...prev, fourPs: value }))
                        }}
                        options={[
                            { label: 'Yes', value: true },
                            { label: 'No', value: false },
                        ]}
                        selected={form.fourPs}
                    />
                </View>
            </View>

            <View style={[styles.row, { marginTop: 15 }]}>
                <View style={[styles.inputWrapper, { flex: 1, padding: 5 }]}>
                    <ThemedRadioBtn
                        label="Others"
                        onChangeText={(value) => {
                            setForm(prev => ({ ...prev, others: value }))
                        }}
                        options={[
                            { label: 'Yes', value: true },
                            { label: 'No', value: false },
                        ]}
                        selected={form.others}
                    />
                </View>
            </View>

            <View style={[styles.row, { marginTop: 15 }]}>
                <View style={[{ flex: 1 }]}>
                    <ThemedDropdown
                        label="Source of Pension "
                        value={form.pension_source}
                        onChangeText={(value) => {
                            setForm({ ...form, pension_source: value });
                        }}
                        items={pension_source}
                        icon={() => <FontAwesome6 name="chevron-down" size={14} color="#2680eb" />}
                    />
                </View>

                {form.pension_source &&
                    <View style={{ flex: 1 }}>
                        <ThemedInputField
                            required={true}
                            keyboardType="numeric"
                            label="Monthly Pension"
                            value={String(form.monthly_pension ?? '')}
                            onChangeText={(value) => {
                                setForm(prev => ({ ...prev, monthly_pension: value }))
                                if (errors?.['monthly_pension']) {
                                    setErrors(prev => ({ ...prev, monthly_pension: undefined }));
                                }
                            }}
                        />
                        <ThemedError error={errors?.monthly_pension || errors?.errors?.monthly_pension?.[0]} />
                    </View>
                }
            </View>
            <ThemedSubmit title={"Submit"} style={[styles.submitButton, { marginTop: 10, marginBottom: 20 }]} onPress={handleSubmit} />
        </ScrollView >
    )
}

export default ThemedHousehold

const styles = StyleSheet.create({
    inputWrapper: {
        borderWidth: 1,
        borderColor: "#2680eb",
        borderRadius: 8,
        backgroundColor: "#fff",
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 10,
    },
    inputWithIcon: {
        flex: 1,
        padding: 0,
        color: "#2D3748",
    },
    submitButton: {
        width: "100%"
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
})