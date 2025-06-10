import { StyleSheet, Text, View, TextInput } from 'react-native'
import { format } from "date-fns";
import * as DocumentPicker from 'expo-document-picker';
import ThemedError from "../ThemedForm/ThemedError";
import ThemedInputField from "../ThemedForm/ThemedInputField"
import ThemedSubmit from '../ThemedForm/ThemedSubmit'
import ThemedButton from "../ThemedForm/ThemedButton";
import ThemedDate from "../ThemedForm/ThemedDate";
import ThemedRadioBtn from "../ThemedForm/ThemedRadioBtn";
import ThemedPlace from "./ThemedPlace"
import ThemedRemarks from "./ThemedRemarks";
import ThemedDocuments from "./ThemedDocuments";
import { relationService } from "../../components/API/RelationshipService";
import ThemedDropdown from "../ThemedForm/ThemedDropdown";
import { FontAwesome6 } from "@expo/vector-icons";
import { useState, useEffect } from 'react'

const ThemedHousehold = () => {

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

    const [refreshing, setRefreshing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState(null)

    const showBirthDate = () => setBirthdatePicker(true);

    useEffect(() => {
        fetchBarangay()
    }, [])

    const fetchBarangay = async () => {
        try {
            const response = await relationService.getRelations()
            if (response.data) {
                const formattedData = response.data.map(item => ({
                    value: item.id,
                    label: item.status,
                }));
                setRelation(formattedData);
                console.log(response.data)
            }
        } catch (error) {
            setErrors(error)
        }
    }

    const handleDateChange = (selectDate: any) => {
        setForm(value => ({ ...value, birthdate: selectDate }));
        close();
    };

    const close = () => {
        setBirthdatePicker(false);
    };

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

    const sss = [
        { value: true, label: 'Yes' },
        { value: false, label: 'No' },
    ]
    const gsis = [
        { value: true, label: 'Yes' },
        { value: false, label: 'No' },
    ]
    const philhealth = [
        { value: true, label: 'Yes' },
        { value: false, label: 'No' },
    ]
    const fourPs = [
        { value: true, label: 'Yes' },
        { value: false, label: 'No' },
    ]
    const others = [
        { value: true, label: 'Yes' },
        { value: false, label: 'No' },
    ]

    return (
        <View>
            {/* <Text>household form</Text> */}
            <View style={[styles.row, { padding: 5, marginTop: 20 }]}>
                <View style={{ flex: 1 }}>
                    <ThemedInputField
                        required={true}
                        label="Last name"
                        value={form.lastname}
                        onChangeText={(value) => {
                            setForm(prev => ({ ...prev, lastname: value }))
                            // if (errors?.['awarded']) {
                            //     setErrors(prev => ({ ...prev, awarded: undefined }));
                            // }
                        }}
                    />
                </View>

                <View style={{ flex: 1 }}>
                    <ThemedInputField
                        required={true}
                        label="First name"
                        value={form.firstname}
                        onChangeText={(value) => {
                            setForm(prev => ({ ...prev, firstname: value }))
                            // if (errors?.['awarded']) {
                            //     setErrors(prev => ({ ...prev, awarded: undefined }));
                            // }
                        }}
                    />
                </View>
            </View>
            <View style={[styles.row, { padding: 5 }]}>
                <View style={{ flex: 1 }}>
                    <ThemedInputField
                        required={true}
                        label="Middle name"
                        value={form.middlename}
                        onChangeText={(value) => {
                            setForm(prev => ({ ...prev, middlename: value }))
                            // if (errors?.['awarded']) {
                            //     setErrors(prev => ({ ...prev, awarded: undefined }));
                            // }
                        }}
                    />
                </View>
                <View style={{ flex: 1 }}>
                    <ThemedDropdown
                        required={true}
                        label="Relation to the Household Head "
                        value={form.relationship_id}
                        onChangeText={(value) => {
                            setForm({ ...form, relationship_id: value });
                            // if (errors?.['barangay']) {
                            //     setErrors(prev => ({ ...prev, barangay: undefined }));
                            // }
                        }}
                        items={relation}
                        icon={() => <FontAwesome6 name="chevron-down" size={14} color="#2680eb" />}
                    />
                </View>

            </View>

            <View style={[styles.row, { padding: 5 }]}>
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
                        value={form.age}
                        onChangeText={(value) => {
                            setForm(prev => ({ ...prev, age: value }))
                            // if (errors?.['awarded']) {
                            //     setErrors(prev => ({ ...prev, awarded: undefined }));
                            // }
                        }}
                    />
                </View>
            </View>

            <View style={[styles.row, { padding: 5 }]}>
                <View style={[styles.inputWrapper, { flex: 1, padding: 5 }]}>
                    <ThemedRadioBtn
                        required={true}
                        label="Sex"
                        onChangeText={(value) => {
                            setForm(prev => ({ ...prev, sex: value }))
                            // if (errors?.['lot_occupancy']) {
                            //     setErrors(prev => ({ ...prev, lot_occupancy: undefined }));
                            // }
                        }}
                        options={[
                            { label: 'Male', value: 'male' },
                            { label: 'Female', value: 'female' },
                        ]}
                        selected={form.sex}
                    />
                </View>
                <View style={[styles.inputWrapper, { flex: 1, padding: 5 }]}>
                    <ThemedRadioBtn
                        required={true}
                        label="Civil Status"
                        onChangeText={(value) => {
                            setForm(prev => ({ ...prev, sex: value }));
                        }}
                        options={[
                            { label: 'Single', value: 'single' },
                            { label: 'Married', value: 'married' },
                            { label: 'Separated', value: 'separated' },
                            { label: 'Widow/er', value: 'widow' },
                        ]}
                        selected={form.sex}
                    />
                </View>
                <View style={[styles.inputWrapper, { flex: 1, padding: 5 }]}>
                    <ThemedRadioBtn
                        required={true}
                        label="PWD"
                        onChangeText={(value) => {
                            setForm(prev => ({ ...prev, sex: value }))
                            // if (errors?.['lot_occupancy']) {
                            //     setErrors(prev => ({ ...prev, lot_occupancy: undefined }));
                            // }
                        }}
                        options={[
                            { label: 'Yes', value: true },
                            { label: 'No', value: false },
                        ]}
                        selected={form.sex}
                    />
                </View>
            </View>

            <View style={[styles.row, { padding: 5 }]}>
                <View style={{ flex: 1 }}>
                    <ThemedDropdown
                        required={true}
                        label="Ethnicity "
                        value={form.ethnicity}
                        onChangeText={(value) => {
                            setForm({ ...form, ethnicity: value });
                            // if (errors?.['barangay']) {
                            //     setErrors(prev => ({ ...prev, barangay: undefined }));
                            // }
                        }}
                        items={ethnicity}
                        icon={() => <FontAwesome6 name="chevron-down" size={14} color="#2680eb" />}
                    />
                </View>

                <View style={{ flex: 1 }}>
                    <ThemedDropdown
                        required={true}
                        label="Religion "
                        value={form.religion}
                        onChangeText={(value) => {
                            setForm({ ...form, religion: value });
                            // if (errors?.['barangay']) {
                            //     setErrors(prev => ({ ...prev, barangay: undefined }));
                            // }
                        }}
                        items={religion}
                        icon={() => <FontAwesome6 name="chevron-down" size={14} color="#2680eb" />}
                    />
                </View>
            </View>

            <View style={[styles.row, { padding: 5 }]}>
                <View style={{ flex: 1 }}>
                    <ThemedDropdown
                        required={true}
                        label="Educational Attainment "
                        value={form.educational_attainment}
                        onChangeText={(value) => {
                            setForm({ ...form, educational_attainment: value });
                            // if (errors?.['barangay']) {
                            //     setErrors(prev => ({ ...prev, barangay: undefined }));
                            // }
                        }}
                        items={educational_attainment}
                        icon={() => <FontAwesome6 name="chevron-down" size={14} color="#2680eb" />}
                    />
                </View>
                <View style={{ flex: 1 }}>
                    <ThemedDropdown
                        required={true}
                        label="Employable Skills "
                        value={form.skills}
                        onChangeText={(value) => {
                            setForm({ ...form, skills: value });
                            // if (errors?.['barangay']) {
                            //     setErrors(prev => ({ ...prev, barangay: undefined }));
                            // }
                        }}
                        items={skills}
                        icon={() => <FontAwesome6 name="chevron-down" size={14} color="#2680eb" />}
                    />
                </View>
            </View>


            <View style={[styles.row, { padding: 5 }]}>
                <View style={{ flex: 1 }}>
                    <ThemedDropdown
                        required={true}
                        label="Occupation "
                        value={form.occupation}
                        onChangeText={(value) => {
                            setForm({ ...form, occupation: value });
                            // if (errors?.['barangay']) {
                            //     setErrors(prev => ({ ...prev, barangay: undefined }));
                            // }
                        }}
                        items={occupation}
                        icon={() => <FontAwesome6 name="chevron-down" size={14} color="#2680eb" />}
                    />
                </View>

                <View style={{ flex: 1 }}>
                    <ThemedInputField
                        required={true}
                        keyboardType="numeric"
                        label="Monthly Income"
                        value={form.monthly_income}
                        onChangeText={(value) => {
                            setForm(prev => ({ ...prev, monthly_income: value }))
                            // if (errors?.['awarded']) {
                            //     setErrors(prev => ({ ...prev, awarded: undefined }));
                            // }
                        }}
                    />
                </View>
            </View>

            <View style={[styles.row, { padding: 5 }]}>
                <View style={[styles.inputWrapper, { flex: 1, padding: 5 }]}>
                    <ThemedRadioBtn
                        required={true}
                        label="SSS"
                        onChangeText={(value) => {
                            setForm(prev => ({ ...prev, sss: value }))
                            // if (errors?.['lot_occupancy']) {
                            //     setErrors(prev => ({ ...prev, lot_occupancy: undefined }));
                            // }
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
                        required={true}
                        label="GSIS"
                        onChangeText={(value) => {
                            setForm(prev => ({ ...prev, gsis: value }))
                            // if (errors?.['lot_occupancy']) {
                            //     setErrors(prev => ({ ...prev, lot_occupancy: undefined }));
                            // }
                        }}
                        options={[
                            { label: 'Yes', value: true },
                            { label: 'No', value: false },
                        ]}
                        selected={form.gsis}
                    />
                </View>
            </View>

            <View style={[styles.row, { padding: 5, marginTop: 10 }]}>
                <View style={[styles.inputWrapper, { flex: 1, padding: 5 }]}>
                    <ThemedRadioBtn
                        required={true}
                        label="PHILHEALTH"
                        onChangeText={(value) => {
                            setForm(prev => ({ ...prev, philhealth: value }))
                            // if (errors?.['lot_occupancy']) {
                            //     setErrors(prev => ({ ...prev, lot_occupancy: undefined }));
                            // }
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
                        required={true}
                        label="4Ps"
                        onChangeText={(value) => {
                            setForm(prev => ({ ...prev, fourPs: value }))
                            // if (errors?.['lot_occupancy']) {
                            //     setErrors(prev => ({ ...prev, lot_occupancy: undefined }));
                            // }
                        }}
                        options={[
                            { label: 'Yes', value: true },
                            { label: 'No', value: false },
                        ]}
                        selected={form.fourPs}
                    />
                </View>
            </View>

            <View style={styles.inputWrapper}>
                <View style={{ flex: 1, padding: 5 }}>
                    <ThemedRadioBtn
                        required={true}
                        label="Others"
                        onChangeText={(value) => {
                            setForm(prev => ({ ...prev, others: value }))
                            // if (errors?.['lot_occupancy']) {
                            //     setErrors(prev => ({ ...prev, lot_occupancy: undefined }));
                            // }
                        }}
                        options={[
                            { label: 'Yes', value: true },
                            { label: 'No', value: false },
                        ]}
                        selected={form.others}
                    />
                </View>
            </View>
        </View>
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
})