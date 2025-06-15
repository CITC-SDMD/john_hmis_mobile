import { StyleSheet, Text, View, ScrollView, Button, TouchableWithoutFeedback } from 'react-native'
import React from 'react'
import { ALERT_TYPE, Toast } from "react-native-alert-notification";
import ThemedView from '../../../../../components/ThemedForm/ThemedView'
import ThemedInputField from '../../../../../components/ThemedForm/ThemedInputField'
import ThemedRadioBtn from '../../../../../components/ThemedForm/ThemedRadioBtn'
import { useState } from 'react'
import ThemedPlaceModal from '../../../../../components/ThemedForm/ThemedPlaceModal'
import { modalVisible } from '../../../../../components/ThemedForm/ThemedPlaceModal'
import ThemedButton from '../../../../../components/ThemedForm/ThemedSubmit'
import ThemedTableForm from '../../../../../components/ThemedTable/ThemedTableForm'
import ThemedFormMenu from '../../../../../components/ThemedMenu/ThemedFormMenu'
import ThemedError from '../../../../../components/ThemedForm/ThemedError'
import { applicationService } from '../../../../../components/API/ApplicationService';


const AssocationForm = () => {

    const [form, setForm] = useState({
        tag_number: '',
        surname: '',
        middlename: '',
        firstname: '',
        birthdate: '',
        sex: '',
        purok: '',
        civilStatus: '',
        present_address: '',
        housing_occupancy: '',
        lot_occupancy: '',
        structureType: '',
        otherStructure: '',
        number_of_families: '',
        year_renovated: '',
        year_resided: '',
        storeys: '',
        structure_owner_name: '',
        lot_owner_name: '',
        location: '',
        otherLocation: '',
        dangerZone: '',
        hazard: '',
        otherHazard: '',
        governmentProject: '',
        projectName: '',
        voterStatus: '',
        specificLocation: '',
        court_Order: '',
    });

    const [errors, setErrors] = useState({});
    const [error, setError] = useState('');
    const [location, setLocation] = useState('');
    const [otherLocation, setOtherLocation] = useState('');
    const [structureType, setStructureType] = useState('');
    const [typeOfStructureError, settypeOfStructureError] = useState('');
    const [otherStructure, setOtherStructure] = useState('');
    const [dangerZone, setDangerZone] = useState('');
    const [hazard, setHazard] = useState('');
    const [governmentProject, setGovernmentProject] = useState('');
    const [projectName, setProjectName] = useState('');
    const [voterStatus, setVoterStatus] = useState('');
    const [birthdate, setBirthdate] = useState('');
    const headers = ['Place', 'Inclusive Date', 'Action'];
    const closeModal = () => modalVisible(false);

    const Next = async () => {
        try {
            const params = {
                tag_number: form.tag_number,
                purok: form.purok,
                surname: form.surname,
                middlename: form.middlename,
                firstname: form.firstname,
                birthdate: form.birthdate,
                sex: form.sex,
                civilStatus: form.civilStatus,
                liveInDate: form.liveInDate,
                marriageDate: form.marriageDate,
                present_address: form.present_address,
                housing_occupancy: form.housing_occupancy,
                lot_occupancy: form.lot_occupancy,
                number_of_families: form.number_of_families,
                year_renovated: form.year_renovated,
                year_resided: form.year_resided,
                structureType: form.structureType,
                storeys: form.storeys,
                lot_owner_name: form.lot_owner_name,
                structure_owner_name: form.structure_owner_name,
                location: form.location,
                dangerZone: form.dangerZone,
                hazard: form.hazard,
                governmentProject: form.governmentProject,
                projectName: form.projectName,
                voterStatus: form.voterStatus,
                specificLocation: form.specificLocation,
                otherLocation: form.otherLocation,
                court_Order: form.court_Order,
            };
            const response = await applicationService.saveApplication(params);
            if (response.data) {
                setErrors({});
                router.push("/forms/association-form/household-member");
            }

        } catch (error) {
            setErrors(error);
            Toast.show({
                title: 'Validation Error',
                type: ALERT_TYPE.DANGER,
            });
        }
    };
    const validateDate = (text) => {
        const onlyNumbers = text.replace(/\D/g, '');

        setBirthdate(onlyNumbers);
        setForm(prevForm => ({ ...prevForm, birthdate: onlyNumbers }));

        if (onlyNumbers.length === 8) {
            const year = parseInt(onlyNumbers.slice(0, 4), 10);
            const month = parseInt(onlyNumbers.slice(4, 6), 10);
            const day = parseInt(onlyNumbers.slice(6, 8), 10);

            const isValidDate =
                !isNaN(new Date(`${year}-${month}-${day}`).getTime()) &&
                month >= 1 && month <= 12 &&
                day >= 1 && day <= 31;

            setError(isValidDate ? '' : 'Invalid date');
        } else {
            setError('Date must be YYYYMMDD');
        }
    };


    // const [residedError, setResidedError] = useState('');
    // const [storeysError, setStoreysError] = useState('');
    // const [structureTypeError, setStructureTypeError] = useState('');
    // const [dangerZoneError, setDangerZoneError] = useState('');
    // const [voterStatusError, setVoterStatusError] = useState('');
    // const [sex, setSex] = useState('');
    // const [sexError, setSexError] = useState('');
    // const [civilStatus, setcivilStatus] = useState('');
    // const [civilStatusError, setcivilStatusError] = useState('');
    // const [structureType, setStructureType] = useState('');
    // const [typeOfStructureError, settypeOfStructureError] = useState('');
    // const [otherStructure, setOtherStructure] = useState('');

    // const [birthdate, setBirthdate] = useState('');
    // const [surname, setSurname] = useState('');
    // const [surnameError, setSurnameError] = useState('');
    // const [middlename, setMiddlename] = useState('');
    // const [middlenameError, setMiddlenameError] = useState('');
    // const [error, setError] = useState('');
    // const [numFamilies, setNumFamilies] = useState('');
    // const [yearConstructed, setYearConstructed] = useState('');
    // const [resided, setresided] = useState('');
    // const [storeys, setstoreys] = useState('');
    // const [location, setLocation] = useState('');
    // const [otherLocation, setOtherLocation] = useState('');
    // const [dangerZone, setDangerZone] = useState(null);
    // const [hazard, setHazard] = useState(null);
    // const [otherHazard, setOtherHazard] = useState('');
    // const [governmentProject, setGovernmentProject] = useState(null);
    // const [projectName, setProjectName] = useState('');
    // const [voterStatus, setVoterStatus] = useState('');
    // const [specificLocation, setSpecificLocation] = useState('');
    // const headers = ['Place', 'Inclusive Date', 'Action'];
    // const handleRadioChange = (value) => {
    // };
    // const closeModal = () => modalVisible(false);
    // const validateDate = (text) => {
    //     const onlyNumbers = text.replace(/\D/g, '');
    //     setBirthdate(onlyNumbers);

    //     if (onlyNumbers.length === 8) {
    //         const year = parseInt(onlyNumbers.slice(0, 4), 10);
    //         const month = parseInt(onlyNumbers.slice(4, 6), 10);
    //         const day = parseInt(onlyNumbers.slice(6, 8), 10);

    //         const isValidDate =
    //             !isNaN(new Date(`${year}-${month}-${day}`).getTime()) &&
    //             month >= 1 && month <= 12 &&
    //             day >= 1 && day <= 31;

    //         setError(isValidDate ? '' : 'Invalid date');
    //     } else {
    //         setError('Date must be YYYYMMDD');
    //     }
    // };


    return (
        <ScrollView style={styles.container}>
            <ThemedView style={[styles.container, { paddingHorizontal: 20 }]} safe={true}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: 8 }}>
                    <View style={{ flex: 1 }}>
                        <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Census Form</Text>
                        <Text style={{ fontSize: 10 }}>
                            This information will be displayed publicly so be careful what you share.
                        </Text>
                    </View>

                    <ThemedFormMenu
                        style={{ marginVertical: 10 }}
                        label="Options"
                        theme={{ blue: "#2680eb", white: "#ffffff" }}
                    />
                </View>

                <View style={styles.row}>
                    <View style={styles.inputHalf}>
                        <ThemedInputField
                            label="Census Control #"
                            value={form.tag_number}
                            onChangeText={(text) => setForm({ ...form, tag_number: text })}
                        />
                        <ThemedError error={errors?.errors?.tag_number?.[0]} />
                    </View>

                    <View style={styles.inputHalf}>
                        <ThemedInputField
                            label="Purok"
                            value={form.purok}
                            onChangeText={(text) => setForm({ ...form, purok: text })}
                        />
                        <ThemedError error={errors?.errors?.purok?.[0]} />
                    </View>
                </View>
                <View style={styles.row}>
                    <ThemedInputField required={true} label="Barangay" style={styles.inputHalf} />
                    <ThemedInputField required={true} label="Admin. district" style={styles.inputHalf} />
                </View>

                <Text >I. BASIC INFORMATION</Text>
                <Text style={{ fontSize: 12 }}>Household Head:</Text>


                <View style={styles.row}>
                    <View style={styles.inputHalf}>
                        <ThemedInputField
                            label="Surname"
                            value={form.surname}
                            onChangeText={(text) => setForm({ ...form, surname: text })}
                        />
                        <ThemedError error={errors?.errors?.surname?.[0]} />
                    </View>

                    <View style={styles.inputHalf}>
                        <ThemedInputField
                            label="Middlename"
                            value={form.middlename}
                            onChangeText={(text) => setForm({ ...form, middlename: text })}
                        />
                        <ThemedError error={errors?.errors?.middlename?.[0]} />
                    </View>
                </View>
                <View>
                    <View style={styles.row}>
                        <ThemedInputField
                            label="First name and suffix (Jr, Sr, I, II, etc.)"
                            style={styles.inputHalf}
                        />
                        <View style={{ flex: 1 }}>
                            <ThemedInputField
                                label="Birthdate"
                                style={[styles.inputHalf, { marginTop: 0 }]}
                                value={form.birthdate}
                                onChangeText={validateDate}
                                placeholder="YYYYMMDD"
                                keyboardType="number-pad"
                                maxLength={8}
                            />
                            <ThemedError error={errors?.errors?.birthdate?.[0]} />
                        </View>
                    </View>
                </View>

                <View>
                    <ThemedRadioBtn
                        label={'Sex'}
                        required={true}
                        options={[
                            { label: 'Male', value: 'male' },
                            { label: 'Female', value: 'female' },
                        ]}
                        selected={form.sex}
                        onChange={(val) => setForm({ ...form, sex: val })}
                    />
                    <ThemedError error={errors?.errors?.sex?.[0]} />
                </View>
                <View>
                    <ThemedRadioBtn
                        label={'Civil status'}
                        required={true}
                        options={[
                            { label: 'Single', value: 'single' },
                            { label: 'Married', value: 'married' },
                            { label: 'Separated', value: 'separated' },
                            { label: 'Live-in', value: 'live_in' },
                            { label: 'Widowed', value: 'widowed' },
                        ]}
                        selected={form.civilStatus}
                        onChange={(val) => setForm({ ...form, civilStatus: val })}
                    />
                    <ThemedError error={errors?.errors?.civilStatus?.[0]} />
                </View>

                {form.civilStatus === 'married' && (
                    <View style={{ marginTop: 10 }}>
                        <ThemedInputField
                            label="Date of Marriage"
                            placeholder="YYYY-MM-DD"
                            value={form.marriageDate}
                            onChangeText={(val) => setForm({ ...form, marriageDate: val })}
                            keyboardType="number-pad"
                        />
                        <ThemedError error={errors?.errors?.marriageDate?.[0]} />
                    </View>
                )}

                {form.civilStatus === 'live_in' && (
                    <View style={{ marginTop: 10 }}>
                        <ThemedInputField
                            label="Date of Live-in"
                            placeholder="YYYY-MM-DD"
                            value={form.liveInDate}
                            onChangeText={(val) => setForm({ ...form, liveInDate: val })}
                            keyboardType="number-pad"
                        />
                        <ThemedError error={errors?.errors?.liveInDate?.[0]} />
                    </View>
                )}
                {/* <View>
                    <ThemedRadioBtn label={'Civil status'}
                        required={true}
                        options={[
                            { label: 'Single', value: 'single' },
                            { label: 'Married', value: 'married' },
                            { label: 'Separated', value: 'separated' },
                            { label: 'Live-in', value: 'live_in' },
                            { label: 'Widowed', value: 'widowed' },
                        ]}
                        selected={form.civilStatus}
                        onChange={(val) => setForm({ ...form, civilStatus: val })}
                    />
                    <ThemedError error={errors?.errors?.civilStatus?.[0]} />
                </View> */}
                <View>
                    <ThemedInputField label="Present address" value={form.present_address} style={styles.Text2}
                        onChangeText={(text) => setForm({ ...form, present_address: text })} />
                    <ThemedError error={errors?.errors?.present_address?.[0]} />
                </View>
                <View>
                    <ThemedRadioBtn
                        label={'Housing Occupancy'}
                        required={true}
                        options={[
                            { label: 'Owned', value: 'owned' },
                            { label: 'Shared', value: 'shared' },
                            { label: 'Rented', value: 'rented' },
                            { label: 'Mortgaged', value: 'mortgaged' },
                            { label: 'Rent free with owners consent', value: 'rentfree_with_consent' },
                            { label: 'Rent free without owners consent', value: 'rentfree_without_consent' },
                        ]}
                        selected={form.housing_occupancy}
                        onChange={(val) => setForm({ ...form, housing_occupancy: val })}
                    />
                    <ThemedError error={errors?.errors?.housing_occupancy?.[0]} />
                </View>
                <View>
                    <ThemedRadioBtn
                        label={'Lot Occupancy'}
                        required={true}
                        options={[
                            { label: 'Owned', value: 'owned' },
                            { label: 'Shared', value: 'shared' },
                            { label: 'Rented', value: 'rented' },
                            { label: 'Mortgaged', value: 'mortgaged' },
                            { label: 'Rent free with owners consent', value: 'lot_rentfree_with_consent' },
                            { label: 'Rent free without owners consent', value: 'lot_rentfree_without_consent' },
                        ]}
                        selected={form.lot_occupancy}
                        onChange={(val) => setForm({ ...form, lot_occupancy: val })}
                    />
                    <ThemedError error={errors?.errors?.lot_occupancy?.[0]} />
                </View>
                <View style={styles.row}>
                    <View style={styles.inputHalf}>
                        <ThemedInputField
                            label="No. of families occupying the same structure"
                            required={true}
                            keyboardType="numeric"
                            value={form.number_of_families}
                            onChangeText={(text) => {
                                const numericText = text.replace(/[^0-9]/g, '');
                                setForm({ ...form, number_of_families: numericText });
                                setErrors((prev) => ({ ...prev, number_of_families: '' }));
                            }}
                        />
                        <ThemedError error={errors?.errors?.number_of_families?.[0]} />
                    </View>

                    <View style={styles.inputHalf}>
                        <ThemedInputField
                            label="When was the structure constructed/renovated"
                            required={true}
                            keyboardType="numeric"
                            value={form.year_renovated}
                            onChangeText={(text) => {
                                const numericText = text.replace(/[^0-9]/g, '');
                                setForm((prevForm) => ({
                                    ...prevForm,
                                    year_renovated: numericText,
                                }));
                                setErrors((prevErrors) => ({
                                    ...prevErrors,
                                    year_renovated: '',
                                }));
                            }}
                        />
                        <ThemedError error={errors?.errors?.year_renovated?.[0]} />
                    </View>
                </View>
                <View>
                    <ThemedInputField
                        label="When did you reside in this structure"
                        required={true}
                        style={styles.inputHalf}
                        keyboardType="numeric"
                        value={form.year_resided}
                        onChangeText={(text) => {
                            const numericText = text.replace(/[^0-9]/g, '');
                            setForm((prevForm) => ({
                                ...prevForm,
                                year_resided: numericText,
                            }));
                            setErrors((prevErrors) => ({
                                ...prevErrors,
                                year_resided: '',
                            }));
                        }}
                    />
                    <ThemedError error={errors?.errors?.year_resided?.[0]} />
                </View>
                <View>
                    <ThemedRadioBtn label={'Type of structure'}
                        required={true}
                        options={[
                            { label: 'Concrete', value: 'concrete' },
                            { label: 'Semi concrete', value: 'semi-concrete' },
                            { label: 'Wooden', value: 'wooden' },
                            { label: 'Others', value: 'others' },
                        ]}
                        selected={structureType}
                        onChange={(val) => {
                            setStructureType(val);
                            settypeOfStructureError('');
                        }}
                    />
                    <ThemedError error={errors?.errors?.structureType?.[0]} />

                    {structureType === 'others' && (
                        <ThemedInputField label="Please specify"
                            style={{ marginVertical: 10 }}
                            value={otherStructure}
                            onChangeText={setOtherStructure} />
                    )}
                </View>
                <View>
                    <ThemedInputField
                        label="No. of storeys"
                        required={true}
                        style={styles.inputHalf}
                        keyboardType="numeric"
                        value={form.storeys}
                        onChangeText={(text) => {
                            const numericText = text.replace(/[^0-9]/g, '');
                            setForm((prevForm) => ({ ...prevForm, storeys: numericText }));
                            setErrors((prevErrors) => ({ ...prevErrors, storeys: '' }));
                        }}
                    />
                    <ThemedError error={errors?.errors?.storeys?.[0]} />
                </View>

                <View style={styles.row}>
                    <View style={styles.inputHalf}>
                        <ThemedInputField
                            label="If structure is rent/rent free, specify name of the owner"
                            value={form.structure_owner_name}
                            onChangeText={(text) =>
                                setForm((prevForm) => ({ ...prevForm, structure_owner_name: text }))
                            }
                        />
                        <ThemedError error={errors?.errors?.structure_owner_name?.[0]} />
                    </View>

                    <View style={styles.inputHalf}>
                        <ThemedInputField
                            label="If lot is rent/rent free, specify name of the owner"
                            value={form.lot_owner_name}
                            onChangeText={(text) =>
                                setForm((prevForm) => ({ ...prevForm, lot_owner_name: text }))
                            }
                        />
                        <ThemedError error={errors?.errors?.lot_owner_name?.[0]} />
                    </View>
                </View>
                <View>
                    <Text style={styles.Text2}>
                        If lot is rent free w/out owner's consent, specify location
                    </Text>

                    <ThemedRadioBtn
                        options={[
                            { label: 'Road Right of Way', value: 'road_right_of_way' },
                            { label: 'Coastline/Shoreline', value: 'shoreline' },
                            { label: 'Riverbanks/Creeks', value: 'riverbanks_creeks' },
                            { label: 'Sidewalk', value: 'sidewalk' },
                            { label: 'Canal/Drainage', value: 'canal_drainage' },
                            { label: 'Private property', value: 'private_property' },
                            { label: 'Parks & Playground', value: 'parks_playground' },
                            { label: 'Under the Bridge', value: 'under_the_bridge' },
                            { label: 'Others', value: 'others' },
                        ]}
                        onChange={(val) =>
                            setForm({
                                ...form,
                                location: val,
                                otherLocation: val === 'others' ? form.otherLocation : '',
                            })
                        }
                        selected={form.location}
                    />

                    {form.location === 'others' && (
                        <ThemedInputField
                            label="Rent without consent location - others"
                            style={{ marginVertical: 10 }}
                            value={form.otherLocation}
                            onChangeText={(text) =>
                                setForm({ ...form, otherLocation: text })
                            }
                        />
                    )}

                    <ThemedError error={errors?.location?.[0]} />
                </View>
                <View>
                    <ThemedRadioBtn
                        label={'Is the structure located in a danger zone area'}
                        required={true}
                        options={[
                            { label: 'Yes', value: 'yes' },
                            { label: 'No', value: 'no' },
                        ]}
                        onChange={(val) => {
                            setForm({
                                ...form,
                                dangerZone: val,
                                hazard: '', // reset hazard
                                otherHazard: '', // reset if changing answer
                            });
                        }}
                        selected={form.dangerZone}
                    />
                    <ThemedError error={errors?.errors?.dangerZone?.[0]} />

                    {form.dangerZone === 'yes' && (
                        <>
                            <Text style={styles.Text2}>If yes, which hazard/s is it susceptible to:</Text>
                            <ThemedRadioBtn
                                options={[
                                    { label: 'Flood', value: 'Flood' },
                                    { label: 'LandSlide', value: 'LandSlide' },
                                    { label: 'Sea Level Rise', value: 'Sea Level Rise' },
                                    { label: 'Storm Surge', value: 'Storm Surge' },
                                    { label: 'Faultline', value: 'Faultline' },
                                    { label: 'Fire', value: 'Fire' },
                                    { label: 'Others', value: 'Others' },
                                ]}
                                onChange={(val) => {
                                    setForm({
                                        ...form,
                                        hazard: val,
                                        otherHazard: val === 'Others' ? form.otherHazard : '',
                                    });
                                }}
                                selected={form.hazard}
                            />
                            <ThemedError error={errors?.errors?.hazard?.[0]} />

                            {form.hazard === 'Others' && (
                                <ThemedInputField
                                    style={styles.input}
                                    label="Specify hazard"
                                    value={form.otherHazard}
                                    onChangeText={(text) =>
                                        setForm({ ...form, otherHazard: text })
                                    }
                                />
                            )}
                            <ThemedError error={errors?.errors?.otherHazard?.[0]} />
                        </>
                    )}
                </View>

                <View>
                    <ThemedRadioBtn
                        label={'Will the structure be affected by a government project'}
                        required={true}
                        options={[
                            { label: 'Yes', value: 'yes' },
                            { label: 'No', value: 'no' },
                        ]}
                        onChange={(val) => {
                            setForm({
                                ...form,
                                governmentProject: val,
                                projectName: val === 'yes' ? form.projectName : '',
                            });
                        }}
                        selected={form.governmentProject}
                    />
                    <ThemedError error={errors?.errors?.governmentProject?.[0]} />

                    {form.governmentProject === 'yes' && (
                        <ThemedInputField
                            style={styles.input}
                            label="If yes, specify the government project"
                            value={form.projectName}
                            onChangeText={(text) =>
                                setForm({ ...form, projectName: text })
                            }
                        />
                    )}
                    {form.governmentProject === 'yes' && (
                        <ThemedError error={errors?.errors?.projectName?.[0]} />
                    )}
                </View>

                <View>
                    <ThemedRadioBtn
                        label={'Will the structure be affected by court order'}
                        required={true}
                        options={[
                            { label: 'Yes', value: 'yes' },
                            { label: 'No', value: 'no' },
                        ]}
                        selected={form.court_Order}
                        onChange={(val) => setForm({ ...form, court_Order: val })}
                    />
                    <ThemedError error={errors?.errors?.court_Order?.[0]} />
                </View>
                {/* <View>
                    <Text style={styles.Text2}>Will the structure be affected by court order</Text>
                    <ThemedRadioBtn
                        options={[
                            { label: 'Yes', value: 'yes' },
                            { label: 'No', value: 'no' }, ,
                        ]}
                        onChange={handleRadioChange}
                        selected={form.court_Order}
                    />
                </View> */}
                <View>
                    <ThemedRadioBtn
                        label={'Are you a resident voter in Davao City'}
                        required={true}
                        options={[
                            { label: 'Yes', value: 'yes' },
                            { label: 'No', value: 'no' },
                        ]}
                        onChange={(val) => {
                            setForm({
                                ...form,
                                voterStatus: val,
                                specificLocation: val === 'no' ? form.specificLocation : '',
                            });
                        }}
                        selected={form.voterStatus}
                    />

                    {form.voterStatus === 'no' && (
                        <ThemedInputField
                            style={styles.input}
                            label="If no, where?"
                            value={form.specificLocation}
                            onChangeText={(text) => setForm({ ...form, specificLocation: text })}
                        />
                    )}
                    <ThemedError error={errors?.errors?.voterStatus?.[0]} />
                </View>
                <ThemedPlaceModal
                    visible={modalVisible}
                    animationType="slide"
                    transparent={true}
                    onRequestClose={closeModal}
                />

                <ThemedTableForm headers={headers} />

                <ThemedButton
                    title="Next"
                    onPress={Next}
                    style={{ width: '100%', marginVertical: 10 }}
                />

                {/* <Link href='/forms/association-form/household-member' asChild>
                    <ThemedButton
                        title="Next"
                        style={{ width: '100%', marginVertical: 10 }}
                    />
                </Link> */}
            </ThemedView>
        </ScrollView>
    )
}

export default AssocationForm

const styles = StyleSheet.create({

    container: {
        flex: 1,
        paddingHorizontal: 0,
        // justifyContent: 'center',
    },
    row: {
        flexDirection: 'row',
        columnGap: 8,
    },
    inputHalf: {
        flex: 1,
    },
    Text: {
        textAlign: 'center',
        color: 'white',
    },
    Text2: {
        // marginBottom: 8,
        marginTop: 12
    }
})




// import { StyleSheet, Text, View } from 'react-native'
// import React from 'react'

// const AssocationForm = () => {
//     return (
//         <View>
//             <Text>AssocationForm</Text>
//         </View>
//     )
// }

// export default AssocationForm

// const styles = StyleSheet.create({})