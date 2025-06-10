import { StyleSheet, Text, View, TextInput, ScrollView, RefreshControl, TouchableOpacity, SafeAreaView, ActivityIndicator, FlatList } from "react-native";
import { ALERT_TYPE, Toast } from "react-native-alert-notification";
import { barangayService } from "../API/BarangayService";
import { applicantService } from "../API/ApplicantService";
import { applicantResidencesService } from "../API/applicantResidencesService";
import { FontAwesome6 } from "@expo/vector-icons";
import { useEffect, useState, useRef } from 'react'
import { format } from "date-fns";
import { useColorScheme } from "react-native";
import { Colors } from "../../constants/Colors";
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
import ThemedDropdown from "../ThemedForm/ThemedDropdown";
import ThemedValidation from "../Validation/ThemedApplicationForm"

const ThemedBasicInformation = ({ uuid, onSubmit, isLoading = false }) => {
    const previousStatusRef = useRef('');
    const colorScheme = useColorScheme();
    const theme = Colors[colorScheme] ?? Colors.light;
    const [refreshing, setRefreshing] = useState(false);
    const [showBirthDatePicker, setBirthdatePicker] = useState(false);
    const [showLivingInDate, setLiveInDatePicker] = useState(false);
    const [showMarriedDatePicker, setMarriedDatePicker] = useState(false);

    const showBirthDate = () => setBirthdatePicker(true);
    const showMarriedDate = () => setMarriedDatePicker(true);
    const showLiveInDate = () => setLiveInDatePicker(true);
    const [barangays, setBarangays] = useState([]);

    const [houseHold, setHousehold] = useState({
        houseHouldForm: {
            household_firstname: "",
            household_middlename: "",
            household_lastname: "",
            household_birthdate: null,
        },
        previous_residence: [],
    })

    const [form, setForm] = useState({
        purok: "",
        tag_number: "",
        barangay: "",
        admin_district: "",
        sex: "",
        civil_status: "",
        married_date: null,
        live_in_date: null,
        spouse_firstname: "",
        spouse_middlename: "",
        spouse_lastname: "",
        spouse_birthdate: null,
        present_address: "",
        housing_occupancy: "",
        lot_occupancy: "",
        number_of_families: "",
        year_renovated: "",
        year_resided: "",
        structure_type: "",
        structure_others: "",
        storeys: "",
        structure_owner_name: "",
        lot_owner_name: "",
        rent_without_consent_location: "",
        rent_without_consent_location_others: "",
        is_dangerzone: false,
        hazard: "",
        hazard_others: "",
        is_government_project: false,
        project_type: null,
        community_facility: "",
        other_project_type: "",
        is_davao_voter: false,
        is_court_order: "",
        not_davao_voter_place: "",
        is_remittance: "",
        have_property: "",
        is_awarded: "",
        awarded: "",
        date: "",
        structure: null,
        attested_by: '',
        attested_signature: null,
        remarks: '',
    });
    const [isLoadingComponent, setIsLoadingComponent] = useState(false);
    const [errors, setErrors] = useState('' as any);

    const onRefresh = () => {
        setRefreshing(true);
        try {
            fetchApplicant()
            fetchBarangay();
            setForm(value => ({ ...value, structure: '' }));
            setErrors({});

        } catch (error) {
            setErrors(error)
        } finally {
            setRefreshing(false);
        }
    };

    const close = () => {
        setBirthdatePicker(false);
        setMarriedDatePicker(false);
        setLiveInDatePicker(false);
    };

    const handleDateChange = (selectDate: any) => {
        setHousehold(value => ({
            ...value,
            houseHouldForm: {
                ...value.houseHouldForm,
                household_birthdate: selectDate
            }
        }));
        close();
    };

    const handleMarriedDateChange = (selectDate: any) => {
        setForm(value => ({ ...value, married_date: selectDate }))
        close();
    }

    const handleLiveInDateChange = (selectDate: any) => {
        setForm(value => ({ ...value, live_in_date: selectDate }))
        close();
    }

    const project_type = [
        { label: 'Road', value: 'Road' },
        { label: 'School Building', value: 'School Building' },
        { label: 'Government / National Offices', value: 'Government / National Offices' },
        { label: 'Housing Development', value: 'Housing Development' },
        { label: 'Public Park/Facility', value: 'Public Park/Facility' },
        { label: 'Bridge', value: 'Bridge' },
        { label: 'Flood Control Projects', value: 'Flood Control Projects' },
        { label: 'Drainage', value: 'Drainage' },
        { label: 'Slope-Protection', value: 'Slope-Protection' },
        { label: 'Community Facilities', value: 'Community Facilities' },
        { label: 'Others', value: 'Others' },
    ]

    useEffect(() => {
        const currentStatus = form.civil_status;
        const previousStatus = previousStatusRef.current;

        if (previousStatus !== currentStatus) {
            if (
                (previousStatus === 'live_in' && currentStatus === 'married') ||
                (previousStatus === 'married' && currentStatus === 'live_in')
            ) {
                setForm(prev => ({
                    ...prev,
                    spouse_firstname: '',
                    spouse_middlename: '',
                    spouse_lastname: '',
                    spouse_birthdate: '',
                }));
            }
        }

        if (['single', 'separated', 'widowed'].includes(currentStatus)) {
            setForm(prev => ({
                ...prev,
                spouse_firstname: '',
                spouse_middlename: '',
                spouse_lastname: '',
                spouse_birthdate: '',
            }));
        }

        if (currentStatus !== 'live_in') {
            setForm(prev => ({ ...prev, live_in_date: '' }));
        }
        if (currentStatus !== 'married') {
            setForm(prev => ({ ...prev, married_date: '' }));
        }

        previousStatusRef.current = currentStatus;
    }, [form.civil_status, setForm]);

    useEffect(() => {
        if (form.structure_type !== 'others') {
            setForm(value => ({ ...value, structure_others: '' }))
        }
    }, [form.structure_type])

    useEffect(() => {
        if (form.rent_without_consent_location !== "others") {
            setForm(value => ({ ...value, rent_without_consent_location_others: '' }))
        }
    }, [form.rent_without_consent_location])

    useEffect(() => {
        if (form.is_government_project === false) {
            setForm(value => ({ ...value, project_type: '' }))
        }

        if (form.project_type !== 'Community Facilities' && form.project_type !== 'Others') {
            setForm(value => ({ ...value, other_project_type: '' }))
            setForm(value => ({ ...value, community_facility: '' }))
        }
    }, [form.is_government_project])

    useEffect(() => {
        if (form.is_davao_voter === true) {
            setForm(value => ({ ...value, not_davao_voter_place: '' }))
        }
    }, [form.is_davao_voter])

    const fetchAllData = async () => {
        await fetchBarangay();
        await fetchApplicant();
    };

    useEffect(() => {
        fetchAllData();
    }, [])

    useEffect(() => {
        if (form.barangay) {
            fetchAdminDistrict(form.barangay);
        }

        if (form.barangay === undefined) {
            setForm(value => ({ ...value, admin_district: '' }))
        }
    }, [form.barangay]);

    useEffect(() => {
        if (form.admin_district) {
            if (errors?.['admin_district']) {
                setErrors(prev => ({ ...prev, admin_district: undefined }));
            }
        }
    }, [form.admin_district])

    const fetchApplicant = async () => {
        try {
            setIsLoadingComponent(true)
            const response = await applicantService.getApplicantByUuid(uuid)
            if (response.data) {
                const previous_residence = response.data.previous_residences;
                const household_firstname = response.data.firstname
                const household_middlename = response.data.middlename
                const household_lastname = response.data.lastname
                const household_birthdate = response.data.birthdate
                const present_address = response.data.address
                const sex = response.data.gender

                setHousehold(value => ({
                    ...value,

                    previous_residence: previous_residence,
                    houseHouldForm: {
                        household_lastname: household_lastname,
                        household_firstname: household_firstname,
                        household_middlename: household_middlename,
                        household_birthdate: household_birthdate ? new Date(household_birthdate) : null,
                    }
                }))

                setForm(value => ({
                    ...value,
                    sex: sex,
                    present_address: present_address,
                }))
            }

            if (response.data) {
                const datas = response.data.application;
                setForm(prev => ({
                    ...prev,
                    tag_number: datas?.tag_number,
                    purok: datas?.purok,
                    barangay: datas?.barangay_id,
                    civil_status: datas?.civil_status,
                    married_date: datas?.married_date ? new Date(datas.married_date) : null,
                    live_in_date: datas?.live_in_date ? new Date(datas.live_in_date) : null,
                    spouse_lastname: datas?.spouse_lastname,
                    spouse_middlename: datas?.spouse_middlename,
                    spouse_firstname: datas?.spouse_firstname,
                    spouse_birthdate: datas?.spouse_birthdate ? new Date(datas.spouse_birthdate) : null,
                    housing_occupancy: datas?.housing_occupancy,
                    lot_occupancy: datas?.lot_occupancy,
                    number_of_families: datas?.number_of_families,
                    year_renovated: datas?.year_renovated,
                    year_resided: datas?.year_resided,
                    structure_type: datas?.structure_type,
                    structure_others: datas?.structure_others,
                    storeys: datas?.storeys,
                    structure_owner_name: datas?.structure_owner_name,
                    lot_owner_name: datas?.lot_owner_name,
                    rent_without_consent_location: datas?.rent_without_consent_location,
                    rent_without_consent_location_others: datas?.rent_without_consent_location_others,
                    is_dangerzone: datas?.is_dangerzone,
                    hazard: datas?.hazard,
                    hazard_others: datas?.hazard_others,
                    is_government_project: datas?.is_government_project,
                    project_type: datas?.project_type,
                    other_project_type: datas?.other_project_type,
                    community_facility: datas?.community_facility,
                    is_court_order: datas?.is_court_order,
                    is_davao_voter: datas?.is_davao_voter,
                    not_davao_voter_place: datas?.not_davao_voter_place,
                    structure: datas?.structure_url,
                    remarks: datas?.remarks,
                    attested_by: datas?.attested_by,
                    attested_signature: datas?.attested_signature
                }));
            }
        } catch (error) {
            setErrors(error)
        } finally {
            setIsLoadingComponent(false)
        }
    }

    const fetchBarangay = async () => {
        try {
            const response = await barangayService.getBarangays()
            if (response.data) {
                const formattedData = response.data.map(item => ({
                    value: item.id,
                    label: item.name,
                }));
                setBarangays(formattedData);
            }
        } catch (error) {
            setErrors(error)
        }
    }

    const fetchAdminDistrict = async (barangayID: any) => {
        try {
            const response = await barangayService.getBarangay(barangayID)
            if (response) {
                const district = response.data?.district

                setForm(value => ({
                    ...value,
                    admin_district: district,
                }));
            }
        } catch (error) {
            setErrors(error)
        }
    }

    const handleSubmit = async () => {
        try {
            await ThemedValidation.validate(form, { abortEarly: false });
            setErrors({});
            if (onSubmit) {
                onSubmit(form);
            }
        } catch (validationError: any) {
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
    };

    const handlePickStructureFile = async () => {
        try {
            const res = await DocumentPicker.getDocumentAsync({
                type: 'image/*',
                copyToCacheDirectory: true,
                multiple: false,
            });

            if (res.assets && res.assets.length > 0) {
                const file = res.assets[0];
                setForm(prev => ({
                    ...prev,
                    structure: {
                        uri: file.uri,
                        name: file.name,
                        type: file.mimeType || 'image/jpeg',
                    },
                }));
            }
        } catch (err) {
            console.error('Document Error:', err);
        }
    };

    const handleDeletePlace = async (value) => {
        try {
            setIsLoadingComponent(true)
            const response = await applicantResidencesService.deleteApplicantResidences(value)
            if (response) {
                successAlert(
                    "Successful",
                    "You have been successfully deleted residence",
                    ALERT_TYPE.DANGER
                );
                await fetchApplicant();
            }
        } catch (error) {
            setErrors(error)
        } finally {
            setIsLoadingComponent(false)
        }
    }

    function successAlert(title, message, type) {
        Toast.show({
            title: title,
            textBody: message,
            type: type,
        });
    }

    if (isLoading) {
        return (
            <SafeAreaView style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={theme.primary} />
                <Text style={{ color: theme.textLight }}>Submitting...</Text>
            </SafeAreaView>
        );
    }

    if (isLoadingComponent) {
        return (
            <SafeAreaView style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={theme.primary} />
                <Text style={{ color: theme.textLight }}>Loading data...</Text>
            </SafeAreaView>
        );
    }

    const renderItem = ({ item }) => (
        <View style={styles.itemContainer}>
            <View style={styles.itemTextContainer}>
                <Text style={styles.placeText}>{item.place}</Text>
                <Text style={styles.yearText}>{item.inclusive_dates}</Text>
            </View>
            <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => {
                    handleDeletePlace(item?.uuid)
                }}
            >
                <FontAwesome6 name="trash-can" size={14} color="#fff" style={styles.deleteIcon} />
                <Text style={styles.deleteText}>Delete</Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <ScrollView
            refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }>
            <View style={styles.row}>
                <ThemedRemarks sex={form.sex} uuid={uuid} attested_by={form.attested_by} attested_signature={form.attested_signature} remarks={form.remarks} />
                <ThemedDocuments uuid={uuid} />
            </View>
            <View style={styles.row}>
                <ThemedInputField label="Census Control #"
                    style={styles.flexInput}
                    value={form.tag_number}
                    onChangeText={(value) => setForm(prev => ({ ...prev, tag_number: value }))}
                />
                <ThemedInputField label="Purok"
                    style={styles.flexInput}
                    value={form.purok}
                    onChangeText={(value) => setForm(prev => ({ ...prev, purok: value }))}
                />
            </View>
            <View style={styles.row}>
                <View style={{ flex: 1 }}>
                    <ThemedDropdown
                        required={true}
                        label="Barangay "
                        value={form.barangay}
                        onChangeText={(value) => {
                            setForm({ ...form, barangay: value });
                            if (errors?.['barangay']) {
                                setErrors(prev => ({ ...prev, barangay: undefined }));
                            }
                        }}
                        items={barangays}
                        icon={() => <FontAwesome6 name="chevron-down" size={14} color="#2680eb" />}
                    />
                    <ThemedError error={errors?.barangay || errors?.errors?.barangay?.[0]} />
                </View>

                <View style={{ flex: 1 }}>
                    <ThemedInputField
                        required={true}
                        label="Admin. district"
                        style={styles.flexInput}
                        value={form.admin_district}
                        onChangeText={(value) => {
                            setForm({ ...form, admin_district: value })
                            if (errors?.['admin_district']) {
                                setErrors(prev => ({ ...prev, admin_district: undefined }));
                            }
                        }}
                    />
                    <ThemedError error={errors?.admin_district || errors?.errors?.admin_district?.[0]} />
                </View>
            </View>

            <Text style={{ fontWeight: "500" }} >I. BASIC INFORMATION</Text>
            <Text style={{ fontSize: 12, marginVertical: 5, color: "grey" }}>Household Head:</Text>

            <View style={styles.row}>
                <ThemedInputField label="Surname"
                    style={styles.flexInput}
                    value={houseHold.houseHouldForm.household_lastname}
                    onChangeText={(value) =>
                        setHousehold(prev => ({
                            ...prev,
                            houseHoldForm: {
                                ...prev.houseHouldForm,
                                household_lastname: value,
                            },
                        }))
                    }
                />
                <ThemedInputField label="Middle name" style={styles.flexInput}
                    value={houseHold.houseHouldForm.household_middlename}
                    onChangeText={(value) =>
                        setHousehold(prev => ({
                            ...prev,
                            houseHoldForm: {
                                ...prev.houseHouldForm,
                                household_middlename: value,
                            },
                        }))
                    }
                />
            </View>

            <View style={styles.row}>
                <ThemedInputField
                    label="First name and suffix (Jr, Sr, I, II, etc.)"
                    style={styles.flexInput}
                    value={houseHold.houseHouldForm.household_firstname}
                    onChangeText={(value) =>
                        setHousehold(prev => ({
                            ...prev,
                            houseHoldForm: {
                                ...prev.houseHouldForm,
                                household_firstname: value,
                            },
                        }))
                    }
                />

                {/* Birtdate household Head */}
                <View style={{ flex: 1 }}>
                    <ThemedButton label="Birthdate" onPress={showBirthDate}
                        icon={() => <FontAwesome6 name="calendar" size={18} color="#2680eb" />}
                    >
                        <TextInput
                            style={styles.inputWithIcon}
                            value={houseHold.houseHouldForm.household_birthdate ? format(houseHold.houseHouldForm.household_birthdate, "MMMM dd, yyyy") : ""}
                            editable={false}
                            pointerEvents="none"
                            placeholder="Select date"
                            placeholderTextColor="#A0AEC0"
                        />
                    </ThemedButton>
                    <ThemedDate
                        date={houseHold.houseHouldForm.household_birthdate || new Date()}
                        handleConfirm={handleDateChange}
                        hidePicker={() => close()}
                        isPickerVisible={showBirthDatePicker}
                    />
                </View>
            </View>

            <View style={[styles.inputWrapper, styles.row, { padding: 5 }]}>
                <View style={{ flex: 1 }}>
                    <ThemedRadioBtn label={"Sex"}
                        required={true}
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

                <View style={{ flex: 1 }}>
                    <ThemedRadioBtn label={"Civil status"}
                        required={true}
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
                            { label: 'Live-in', value: 'live_in' },
                            { label: 'Widowed', value: 'widowed' },
                        ]}
                        selected={form.civil_status}
                    />
                    <ThemedError error={errors?.civil_status || errors?.errors?.civil_status?.[0]} />
                </View>

            </View>

            {/* married */}
            {form.civil_status === 'married' && (
                <View style={{ flex: 1, marginTop: 10 }}>
                    <ThemedButton label="Date of marriage" onPress={showMarriedDate}
                        required={true}
                        icon={() => <FontAwesome6 name="calendar" size={18} color="#2680eb" />}>
                        <TextInput
                            style={styles.inputWithIcon}
                            value={form.married_date ? format(form.married_date, "MMMM dd, yyyy") : null}
                            editable={false}
                            pointerEvents="none"
                            placeholder="Select date"
                            placeholderTextColor="#A0AEC0"
                        />
                    </ThemedButton>
                    <ThemedDate
                        date={form.married_date || new Date()}
                        handleConfirm={handleMarriedDateChange}
                        hidePicker={() => close()}
                        isPickerVisible={showMarriedDatePicker}
                    />
                    <ThemedError error={errors?.married_date || errors?.errors?.married_date?.[0]} />

                </View>
            )}

            {/* live_in */}
            {form.civil_status === 'live_in' && (
                <View style={{ flex: 1, marginTop: 10 }}>
                    <ThemedButton label="Date of Living in" onPress={showLiveInDate}
                        required={true}
                        icon={(props: any) => (
                            <FontAwesome6 name="calendar" size={18} color="#fff" {...props} />
                        )}>
                        <TextInput
                            style={styles.inputWithIcon}
                            value={form.live_in_date ? format(form.live_in_date, "MMMM dd, yyyy") : ""}
                            editable={false}
                            pointerEvents="none"
                            placeholder="Select date"
                            placeholderTextColor="#A0AEC0"
                        />
                    </ThemedButton>
                    <ThemedDate
                        date={form.live_in_date || new Date()}
                        handleConfirm={handleLiveInDateChange}
                        hidePicker={() => close()}
                        isPickerVisible={showLivingInDate}
                    />
                    <ThemedError error={errors?.live_in_date || errors?.errors?.live_in_date?.[0]} />
                </View>
            )}

            {(form.civil_status === 'married' || form.civil_status === 'live_in') && (
                <View style={[form.civil_status === 'married' || form.civil_status === 'live_in' ? {} : { marginTop: 10 }]}>
                    <Text style={{ color: "grey" }}>Name of Spouse:</Text>
                    <View style={[styles.row, { marginTop: 10 }]}>
                        <View style={{ flex: 1 }}>
                            <ThemedInputField
                                required={true}
                                label="Surname"
                                style={styles.flexInput}
                                value={form.spouse_lastname}
                                onChangeText={(value) => {
                                    setForm(prev => ({ ...prev, spouse_lastname: value }))
                                    if (errors?.['spouse_lastname']) {
                                        setErrors(prev => ({ ...prev, spouse_lastname: undefined }));
                                    }
                                }}
                            />
                            <ThemedError error={errors?.spouse_lastname || errors?.errors?.spouse_lastname?.[0]} />
                        </View>
                        <View style={{ flex: 1 }}>
                            <ThemedInputField
                                required={true}
                                label="Middle name"
                                style={styles.flexInput}
                                value={form.spouse_middlename}
                                onChangeText={(value) => {
                                    setForm(prev => ({ ...prev, spouse_middlename: value }))
                                    if (errors?.['spouse_middlename']) {
                                        setErrors(prev => ({ ...prev, spouse_middlename: undefined }));
                                    }
                                }}
                            />
                            <ThemedError error={errors?.spouse_middlename || errors?.errors?.spouse_middlename?.[0]} />
                        </View>
                    </View>
                    <View style={styles.row}>
                        <View style={{ flex: 1 }}>
                            <ThemedInputField
                                required={true}
                                label="First name and suffix (Jr, Sr, I, II, etc.)"
                                style={styles.flexInput}
                                value={form.spouse_firstname}
                                onChangeText={(value) => {
                                    setForm(prev => ({ ...prev, spouse_firstname: value }))
                                    if (errors?.['spouse_firstname']) {
                                        setErrors(prev => ({ ...prev, spouse_firstname: undefined }));
                                    }
                                }}
                            />
                            <ThemedError error={errors?.spouse_firstname || errors?.errors?.spouse_firstname?.[0]} />
                        </View>

                        {/* BirthDate spouse */}
                        <View style={{ flex: 1 }}>
                            <ThemedButton label="Birthdate" onPress={showBirthDate}
                                required={true}
                                icon={(props: any) => (
                                    <FontAwesome6 name="calendar" size={18} color="#fff" {...props} />
                                )}>
                                <TextInput
                                    style={styles.inputWithIcon}
                                    value={form.spouse_birthdate ? format(form.spouse_birthdate, "MMMM dd, yyyy") : ""}
                                    editable={false}
                                    pointerEvents="none"
                                    placeholder="Select date"
                                    placeholderTextColor="#A0AEC0"
                                />
                            </ThemedButton>
                            <ThemedDate
                                date={form.spouse_birthdate || new Date()}
                                handleConfirm={handleDateChange}
                                hidePicker={() => close()}
                                isPickerVisible={showBirthDatePicker}
                            />
                            <ThemedError error={errors?.spouse_birthdate || errors?.errors?.spouse_birthdate?.[0]} />
                        </View>
                    </View>
                </View>
            )}

            <View style={[form.civil_status === 'married' || form.civil_status === 'live_in' ? {} : { marginTop: 10 }]}>
                <ThemedInputField
                    required={true}
                    label="Present address"
                    value={form.present_address}
                    onChangeText={(value) => {
                        setForm(prev => ({ ...prev, present_address: value }))
                        if (errors?.['present_address']) {
                            setErrors(prev => ({ ...prev, present_address: undefined }));
                        }
                    }}
                />
                <ThemedError error={errors?.present_address || errors?.errors?.present_address?.[0]} />
            </View>

            <View style={[styles.inputWrapper, { flexDirection: 'row', justifyContent: 'space-between', gap: 20 }]}>
                <View style={{ flex: 1, padding: 5 }}>
                    <ThemedRadioBtn
                        required={true}
                        label="Housing occupancy"
                        onChangeText={(value) => {
                            setForm(prev => ({ ...prev, housing_occupancy: value }))
                            if (errors?.['housing_occupancy']) {
                                setErrors(prev => ({ ...prev, housing_occupancy: undefined }));
                            }
                        }}
                        options={[
                            { label: 'Owned', value: 'owned' },
                            { label: 'Shared', value: 'shared' },
                            { label: 'Rented', value: 'rented' },
                            { label: 'Mortgaged', value: 'mortgaged' },
                            { label: 'Rent free with owners consent', value: 'rentfree_with_consent' },
                            { label: 'Rent free without owners consent', value: 'rentfree_without_consent' },
                        ]}
                        selected={form.housing_occupancy}
                    />
                    <ThemedError error={errors?.housing_occupancy || errors?.errors?.housing_occupancy?.[0]} />
                </View>

                <View style={{ flex: 1, padding: 5 }}>
                    <ThemedRadioBtn
                        required={true}
                        label="Lot occupancy"
                        onChangeText={(value) => {
                            setForm(prev => ({ ...prev, lot_occupancy: value }))
                            if (errors?.['lot_occupancy']) {
                                setErrors(prev => ({ ...prev, lot_occupancy: undefined }));
                            }
                        }}
                        options={[
                            { label: 'Owned', value: 'owned' },
                            { label: 'Shared', value: 'shared' },
                            { label: 'Rented', value: 'rented' },
                            { label: 'Mortgaged', value: 'mortgaged' },
                            { label: 'Rent free with owners consent', value: 'rentfree_with_consent' },
                            { label: 'Rent free without owners consent', value: 'rentfree_without_consent' },
                        ]}
                        selected={form.lot_occupancy}
                    />
                    <ThemedError error={errors?.lot_occupancy || errors?.errors?.lot_occupancy?.[0]} />
                </View>
            </View>

            <View style={[styles.row, { marginTop: 10 }]}>
                <View style={{ flex: 1 }}>
                    <ThemedInputField
                        required={true}
                        label="No. of families occupying the same structure "
                        style={styles.flexInput}
                        keyboardType="numeric"
                        value={String(form.number_of_families ?? '')}
                        onChangeText={(value) => {
                            setForm(prev => ({ ...prev, number_of_families: value }))
                            if (errors?.['number_of_families']) {
                                setErrors(prev => ({ ...prev, number_of_families: undefined }));
                            }
                        }}
                    />
                    <ThemedError error={errors?.number_of_families || errors?.errors?.number_of_families?.[0]} />
                </View>
                <View style={{ flex: 1 }}>
                    <ThemedInputField
                        label="When was the structure constructed/renovated"
                        style={styles.flexInput}
                        keyboardType="numeric"
                        value={String(form.year_renovated ?? '')}
                        onChangeText={(value) => {
                            setForm(prev => ({ ...prev, year_renovated: value }))
                            if (errors?.['year_renovated']) {
                                setErrors(prev => ({ ...prev, year_renovated: undefined }));
                            }
                        }}
                    />
                    <ThemedError error={errors?.year_renovated || errors?.errors?.year_renovated?.[0]} />
                </View>
            </View>

            <View >
                <ThemedInputField
                    required={true}
                    label="When did you reside in this structure"
                    keyboardType="numeric"
                    value={String(form.year_resided ?? '')}
                    onChangeText={(value) => {
                        setForm(prev => ({ ...prev, year_resided: value }))
                        if (errors?.['year_resided']) {
                            setErrors(prev => ({ ...prev, year_resided: undefined }));
                        }
                    }}
                />
                <ThemedError error={errors?.year_resided || errors?.errors?.year_resided?.[0]} />
            </View>

            <View style={[styles.inputWrapper, styles.row]}>
                <View style={{ flex: 1, padding: 5 }}>
                    <ThemedRadioBtn label={"Type of structure "}
                        required={true}
                        onChangeText={(value) => {
                            setForm(prev => ({ ...prev, structure_type: value }));
                            if (errors?.['structure_type']) {
                                setErrors(prev => ({ ...prev, structure_type: undefined }));
                            }
                        }}
                        options={[
                            { label: 'Concrete', value: 'concrete' },
                            { label: 'Wooden', value: 'wooden' },
                            { label: 'Semi concrete', value: 'semi_concrete' },
                            { label: 'Others', value: 'others' },
                        ]}
                        selected={form.structure_type}
                    />
                    <ThemedError error={errors?.structure_type || errors?.errors?.structure_type?.[0]} />
                </View>

                <View style={{ flex: 1, padding: 5 }}>
                    <ThemedInputField
                        required={true}
                        label="No. of storeys"
                        keyboardType="numeric"
                        value={String(form.storeys ?? '')}
                        onChangeText={(value) => {
                            setForm(prev => ({ ...prev, storeys: value }));
                            if (errors?.['storeys']) {
                                setErrors(prev => ({ ...prev, storeys: undefined }));
                            }
                        }}
                    />
                    <ThemedError error={errors?.storeys || errors?.errors?.storeys?.[0]} />
                </View>
            </View>

            <View style={[styles.row, { marginTop: 10 }]}>
                {form.structure_type === "others" && (
                    <View style={{ flex: 1 }}>
                        <ThemedInputField
                            required={true}
                            label="Specify Structure"
                            style={styles.flexInput}
                            value={form.structure_others}
                            onChangeText={(value) => {
                                setForm(prev => ({ ...prev, structure_others: value }));
                                if (errors?.['structure_others']) {
                                    setErrors(prev => ({ ...prev, structure_others: undefined }));
                                }
                            }}
                        />
                        <ThemedError error={errors?.structure_others || errors?.errors?.structure_others?.[0]} />
                    </View>
                )}

                {form.structure_type && (
                    <View style={{ flex: 1 }}>
                        <ThemedButton
                            children={
                                typeof form.structure === 'object'
                                    ? form.structure?.name || 'Select file'
                                    : form.structure
                                        ? form.structure.split('/').pop()
                                        : 'Select file'
                            }
                            label={"Upload structure image"}
                            icon={() => <FontAwesome6 name="upload" size={18} color="#fff" />}
                            styleButton={[styles.uploadImage, { justifyContent: 'center' }]}
                            onPress={handlePickStructureFile}
                        />
                    </View>
                )}
            </View>

            <View>
                <ThemedInputField
                    label="if structure is rent/rent free, specify name of the owner"
                    value={form.structure_owner_name}
                    onChangeText={(value) => setForm(prev => ({ ...prev, structure_owner_name: value }))}
                />
            </View>

            <View>
                <ThemedInputField
                    label="if lot is rent/rent free, specify name of the owner"
                    value={form.lot_owner_name}
                    onChangeText={(value) => setForm(prev => ({ ...prev, lot_owner_name: value }))}
                />
            </View>

            <View style={[styles.inputWrapper, { padding: 5 }]}>
                <ThemedRadioBtn label={"if lot is rent free w/out owner's consent, specify location"}
                    onChangeText={(value) => setForm(prev => ({ ...prev, rent_without_consent_location: value }))}
                    options={[
                        { label: 'Road Right of Way', value: 'road_right_of_way' },
                        { label: 'Sidewalk', value: 'sidewalk' },
                        { label: 'Parks & Playground', value: 'parks_playground' },
                        { label: 'Coastline/Shoreline', value: 'coastline_shoreline' },
                        { label: 'Canal/Drainage', value: 'canal_drainage' },
                        { label: 'Under the Bridge', value: 'under_the_bridge' },
                        { label: 'Riverbanks/Creeks', value: 'riverbanks_creeks' },
                        { label: 'Private property', value: 'private_property' },
                        { label: 'Others', value: 'others' },
                    ]}
                    selected={form.rent_without_consent_location}
                />
            </View>

            {
                form.rent_without_consent_location === "others" && (
                    <View style={{ marginTop: 10 }}>
                        <ThemedInputField
                            label="Rent without consent location others"
                            value={form.rent_without_consent_location_others}
                            onChangeText={(value) => setForm(prev => ({ ...prev, rent_without_consent_location_others: value }))}
                        />
                    </View>
                )
            }

            <View style={[styles.row, styles.inputWrapper,
            form.rent_without_consent_location === "others" ? {} : { marginTop: 10 }
            ]}>
                <View style={{ padding: 5 }}>
                    <ThemedRadioBtn label={"Is the structure located in a danger zone area"}
                        required={true}
                        onChangeText={(value) => {
                            setForm(prev => ({ ...prev, is_dangerzone: value }));
                            if (errors?.['is_dangerzone']) {
                                setErrors(prev => ({ ...prev, is_dangerzone: undefined }));
                            }
                        }}
                        options={[
                            { label: 'Yes', value: true },
                            { label: 'No', value: false },
                        ]}
                        selected={form.is_dangerzone}
                    />
                    <ThemedError error={errors?.is_dangerzone || errors?.errors?.is_dangerzone?.[0]} />
                </View>

                {form.is_dangerzone === true && (
                    <View style={{ flex: 1, padding: 5 }}>
                        <ThemedRadioBtn label={"If yes, which hazard/s is it susceptible to:"}
                            required={true}
                            onChangeText={(value) => {
                                setForm(prev => ({ ...prev, hazard: value }))
                                if (errors?.['hazard']) {
                                    setErrors(prev => ({ ...prev, hazard: undefined }));
                                }
                            }}
                            options={[
                                { label: 'Flood', value: 'flood' },
                                { label: 'LandSlide', value: 'landslide' },
                                { label: 'Sea Level Rise', value: 'sea_level_rise' },
                                { label: 'Storm Surge', value: 'storm_surge' },
                                { label: 'Faultline', value: 'faultline' },
                                { label: 'Fire', value: 'fire' },
                                { label: 'Others', value: 'others' },
                            ]}
                            selected={form.hazard}
                        />
                        <ThemedError error={errors?.hazard || errors?.errors?.hazard?.[0]} />
                    </View>
                )}
            </View>

            {
                form.hazard === "others" && (
                    <View style={{ marginTop: 10 }}>
                        <ThemedInputField
                            required={true}
                            label="Specify hazard"
                            value={form.hazard_others}
                            onChangeText={(value) => {
                                setForm(prev => ({ ...prev, hazard_others: value }))
                                if (errors?.['hazard_others']) {
                                    setErrors(prev => ({ ...prev, hazard_others: undefined }));
                                }
                            }}
                        />
                        <ThemedError error={errors?.hazard_others || errors?.errors?.hazard_others?.[0]} />
                    </View>
                )
            }

            <View style={[styles.row, styles.inputWrapper,
            form.hazard === "others" ? {} : { marginTop: 10 }
            ]}>
                <View style={{ flex: 1, padding: 5, }}>
                    <ThemedRadioBtn label={"Will the structure be affected by a government project"}
                        required={true}
                        onChangeText={(value) => {
                            setForm(prev => ({ ...prev, is_government_project: value }))
                            if (errors?.['is_government_project']) {
                                setErrors(prev => ({ ...prev, is_government_project: undefined }));
                            }
                        }}
                        options={[
                            { label: 'Yes', value: true },
                            { label: 'No', value: false },
                        ]}
                        selected={form.is_government_project}
                    />
                    <ThemedError error={errors?.is_government_project || errors?.errors?.is_government_project?.[0]} />
                </View>

                {form.is_government_project && (
                    <View style={{ flex: 1, padding: 5 }}>
                        <ThemedDropdown
                            required={true}
                            label="if Yes, specify the government project "
                            value={form.project_type}
                            onChangeText={(value) => {
                                setForm(prev => ({ ...prev, project_type: value }))
                                if (errors?.['project_type']) {
                                    setErrors(prev => ({ ...prev, project_type: undefined }));
                                }
                            }}
                            items={project_type}
                            icon={() => <FontAwesome6 name="chevron-down" size={14} color="#2680eb" />}
                        />
                        <ThemedError error={errors?.project_type || errors?.errors?.project_type?.[0]} />

                    </View>
                )}
            </View>

            <View style={{ marginTop: 10 }}>
                {form.project_type === "Others" && (
                    <View>
                        <ThemedInputField
                            required={true}
                            label="Specify others"
                            value={form.other_project_type}
                            onChangeText={(value) => {
                                setForm(prev => ({ ...prev, other_project_type: value }))
                                if (errors?.['other_project_type']) {
                                    setErrors(prev => ({ ...prev, other_project_type: undefined }));
                                }
                            }}
                        />

                        <ThemedError error={errors?.other_project_type || errors?.errors?.other_project_type?.[0]} />

                    </View>
                )}

                {form.project_type === "Community Facilities" && (
                    <View>
                        <ThemedInputField
                            required={true}
                            label="Specify community facility "
                            value={form.community_facility}
                            onChangeText={(value) => {
                                setForm(prev => ({ ...prev, community_facility: value }))
                                if (errors?.['community_facility']) {
                                    setErrors(prev => ({ ...prev, community_facility: undefined }));
                                }
                            }}
                        />
                        <ThemedError error={errors?.community_facility || errors?.errors?.community_facility?.[0]} />
                    </View>
                )}
            </View>

            <View style={[styles.inputWrapper, { padding: 5, }]}>
                <ThemedRadioBtn label={"Will the structure be affected by court order"}
                    onChangeText={(value) => setForm(prev => ({ ...prev, is_court_order: value }))}
                    options={[
                        { label: 'Yes', value: true },
                        { label: 'No', value: false },
                    ]}
                    selected={form.is_court_order}
                />
            </View>

            <View style={[styles.row, styles.inputWrapper, { marginTop: 10 }]}>
                <View style={{ flex: 1, padding: 5 }}>
                    <ThemedRadioBtn label={"Are you a resident voter in Davao City "}
                        required={true}
                        onChangeText={(value) => {
                            setForm(prev => ({ ...prev, is_davao_voter: value }))
                            if (errors?.['is_davao_voter']) {
                                setErrors(prev => ({ ...prev, is_davao_voter: undefined }));
                            }
                        }}
                        options={[
                            { label: 'Yes', value: true },
                            { label: 'No', value: false },
                        ]}
                        selected={form.is_davao_voter}
                    />
                    <ThemedError error={errors?.is_davao_voter || errors?.errors?.is_davao_voter?.[0]} />
                </View>

                <View style={{ flex: 1, padding: 5 }}>
                    {form.is_davao_voter === false && (
                        <View>
                            <ThemedInputField
                                required={true}
                                label="if No, where"
                                value={form.not_davao_voter_place}
                                onChangeText={(value) => {
                                    setForm(prev => ({ ...prev, not_davao_voter_place: value }))
                                    if (errors?.['not_davao_voter_place']) {
                                        setErrors(prev => ({ ...prev, not_davao_voter_place: undefined }));
                                    }
                                }}
                            />
                            <ThemedError error={errors?.not_davao_voter_place || errors?.errors?.not_davao_voter_place?.[0]} />
                        </View>
                    )}
                </View>
            </View>
            <View>
                <ThemedPlace uuid={uuid} fetchApplicant={fetchAllData} onSubmit={handleSubmit} />
                <FlatList
                    data={houseHold.previous_residence}
                    renderItem={renderItem}
                    keyExtractor={(item, index) => index.toString()}
                    scrollEnabled={false}
                />
            </View>

            <ThemedSubmit title={"Next"} style={[styles.submitButton, { marginTop: 10 }]} onPress={handleSubmit} />
        </ScrollView >
    )
}

export default ThemedBasicInformation

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        columnGap: 8,
    },
    flexInput: {
        flex: 1,
    },
    inputWithIcon: {
        flex: 1,
        padding: 0,
        color: "#2D3748",
    },
    inputWrapper: {
        borderWidth: 1,
        borderColor: "#2680eb",
        borderRadius: 8,
        backgroundColor: "#fff",
    },
    button: {
        width: 120,
        height: 60,
    },
    submitButton: {
        width: "100%"
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    uploadImage: {
        backgroundColor: "#2680eb",
    },
    itemContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 10,
        marginVertical: 5,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#e2e8f0',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    itemTextContainer: {
        flex: 1,
    },
    placeText: {
        fontSize: 16,
        fontWeight: '500',
        color: '#2d3748',
    },
    yearText: {
        fontSize: 14,
        color: '#718096',
        marginTop: 4,
    },
    deleteButton: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: '#f56565',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 4,
    },
    deleteText: {
        color: '#fff',
        fontWeight: '500',
    },
    deleteIcon: {
        marginRight: 6,
    },
})