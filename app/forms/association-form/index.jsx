import { StyleSheet, Text, View, ScrollView, Button, TouchableWithoutFeedback } from 'react-native'
import React from 'react'
import ThemedView from '../../../components/ThemedForm/ThemedView'
import ThemedInputField from '../../../components/ThemedForm/ThemedInputField'
import ThemedRadioBtn from '../../../components/ThemedForm/ThemedRadioBtn'
import { useState } from 'react'
import ThemedPlaceModal from '../../../components/ThemedForm/ThemedPlaceModal'
import { modalVisible } from '../../../components/ThemedForm/ThemedPlaceModal'
import ThemedButton from '../../../components/ThemedForm/ThemedButton'
import { Ionicons } from "@expo/vector-icons";
import { Link } from 'expo-router'
import ThemedTableForm from '../../../components/ThemedTable/ThemedTableForm'
import ThemedFormMenu from '../../../components/ThemedMenu/ThemedFormMenu'


const index = () => {

    const [birthdate, setBirthdate] = useState('');
    const [error, setError] = useState('');
    const [numFamilies, setNumFamilies] = useState('');
    const [yearConstructed, setYearConstructed] = useState('');
    const [resided, setresided] = useState('');
    const [storeys, setstoreys] = useState('');
    const [structureType, setStructureType] = useState('');
    const [otherStructure, setOtherStructure] = useState('');
    const [location, setLocation] = useState('');
    const [otherLocation, setOtherLocation] = useState('');
    const [dangerZone, setDangerZone] = useState(null);
    const [hazard, setHazard] = useState(null);
    const [otherHazard, setOtherHazard] = useState('');
    const [governmentProject, setGovernmentProject] = useState(null);
    const [projectName, setProjectName] = useState('');
    const [voterStatus, setVoterStatus] = useState('');
    const [specificLocation, setSpecificLocation] = useState('');
    const headers = ['Place', 'Inclusive Date', 'Action'];
    const handleRadioChange = (value) => {
        console.log('Selected:', value);
    };
    const closeModal = () => modalVisible(false);
    const validateDate = (text) => {
        const onlyNumbers = text.replace(/\D/g, '');
        setBirthdate(onlyNumbers);

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
                        onRemarks={() => console.log("Remarks tapped")}
                    />
                </View>

                <View style={styles.row}>
                    <ThemedInputField label="Census Control #" style={styles.inputHalf} />
                    <ThemedInputField label="Purok" style={styles.inputHalf} />
                </View>
                <View style={styles.row}>
                    <ThemedInputField label="Barangay" style={styles.inputHalf} />
                    <ThemedInputField label="Admin. district" style={styles.inputHalf} />
                </View>

                <Text >I. BASIC INFORMATION</Text>
                <Text style={{ fontSize: 12 }}>Household Head:</Text>


                <View style={styles.row}>
                    <ThemedInputField required={true} label="Surname" style={styles.inputHalf} />
                    <ThemedInputField label="Middle name" style={styles.inputHalf} />
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
                                value={birthdate}
                                onChangeText={validateDate}
                                placeholder="YYYYMMDD"
                                keyboardType="number-pad"
                                maxLength={8}
                            />
                            {error ? (
                                <Text style={{ color: 'red', fontSize: 12, marginTop: 2, marginLeft: 4 }}>
                                    {error}
                                </Text>
                            ) : null}
                        </View>
                    </View>
                </View>

                <View>
                    <Text>Sex</Text>
                    <ThemedRadioBtn
                        options={[
                            { label: 'Male', value: 'male' },
                            { label: 'Female', value: 'female' },
                        ]}
                        onChange={handleRadioChange}
                        selected=""
                    />
                </View>
                <View>
                    <Text style={styles.Text2}>Civil status</Text>
                    <ThemedRadioBtn
                        options={[
                            { label: 'Single', value: 'single' },
                            { label: 'Married', value: 'married' },
                            { label: 'Separated', value: 'separated' },
                            { label: 'Live-in', value: 'live_in' },
                            { label: 'Widowed', value: 'widowed' },
                        ]}
                        onChange={handleRadioChange}
                        selected=""
                    />
                </View>
                <View>
                    <ThemedInputField label="Present address" style={styles.Text2} />
                </View>
                <View>
                    <Text style={styles.Text2}>Housing Occupancy</Text>
                    <ThemedRadioBtn
                        options={[
                            { label: 'Owned', value: 'owned' },
                            { label: 'Shared', value: 'shared' },
                            { label: 'Rented', value: 'rented' },
                            { label: 'Mortgaged', value: 'mortgaged' },
                            { label: 'Rent free with owners consent', value: 'rentfree_with_consent' },
                            { label: 'Rent free without owners consent', value: 'rentfree_without_consent' },
                        ]}
                        onChange={handleRadioChange}
                        selected=""
                    />
                </View>
                <View>
                    <Text style={styles.Text2}>Lot Occupancy</Text>
                    <ThemedRadioBtn
                        options={[
                            { label: 'Owned', value: 'owned' },
                            { label: 'Shared', value: 'shared' },
                            { label: 'Rented', value: 'rented' },
                            { label: 'Mortgaged', value: 'mortgaged' },
                            { label: 'Rent free with owners consent', value: 'lot_rentfree_with_consent' },
                            { label: 'Rent free without owners consent', value: 'lot_rentfree_without_consent' },
                        ]}
                        onChange={handleRadioChange}
                        selected=""
                    />
                </View>
                <View style={styles.row}>
                    <ThemedInputField
                        label="No. of families occupying the same structure"
                        style={[styles.inputHalf, { marginVertical: 10 }]}
                        keyboardType="numeric"
                        value={numFamilies}
                        onChangeText={(text) => {
                            const numericText = text.replace(/[^0-9]/g, '');
                            setNumFamilies(numericText);
                        }}
                    />

                    <ThemedInputField
                        label="When was the structure constructed/renovated"
                        style={[styles.inputHalf, { marginVertical: 10 }]}
                        keyboardType="numeric"
                        value={yearConstructed}
                        onChangeText={(text) => {
                            const numericText = text.replace(/[^0-9]/g, '');
                            setYearConstructed(numericText);
                        }}
                    />
                </View>
                <View>
                    <ThemedInputField
                        label="When did you reside in this structure"
                        style={styles.inputHalf}
                        keyboardType="numeric"
                        value={resided}
                        onChangeText={(text) => {
                            const numericText = text.replace(/[^0-9]/g, '');
                            setresided(numericText);
                        }}
                    />
                </View>
                <View>
                    <Text style={styles.Text2}>Type of structure</Text>
                    <ThemedRadioBtn
                        options={[
                            { label: 'Concrete', value: 'concrete' },
                            { label: 'Semi concrete', value: 'semi-concrete' },
                            { label: 'Wooden', value: 'wooden' },
                            { label: 'Others', value: 'others' },
                        ]}
                        onChange={setStructureType}
                        selected={structureType}
                    />
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
                        style={styles.inputHalf}
                        keyboardType="numeric"
                        value={storeys}
                        onChangeText={(text) => {
                            const numericText = text.replace(/[^0-9]/g, '');
                            setstoreys(numericText);
                        }}
                    />
                </View>
                <View style={styles.row}>
                    <ThemedInputField label="if structure is rent/rent free, specify name of the owner" style={styles.inputHalf} />
                    <ThemedInputField label="if lot is rent/rent free, specify name of the owner" style={styles.inputHalf} />
                </View>
                <View>
                    <Text style={styles.Text2}>if lot is rent free w/out owner's consent, specify location</Text>
                    <ThemedRadioBtn
                        options={[
                            { label: 'Road Right of Way', value: 'road_way' },
                            { label: 'Coastline/Shoreline', value: 'shoreline' },
                            { label: 'Riverbanks/Creeks', value: 'creeks' },
                            { label: 'Sidewalk', value: 'sidewalk' },
                            { label: 'Canal/Drainage', value: 'canal' },
                            { label: 'Private property', value: 'private_property' },
                            { label: 'Parks & Playground', value: 'playground' },
                            { label: 'Under the Bridge', value: 'under_bridge' },
                            { label: 'Others', value: 'others' },
                        ]}
                        onChange={setLocation}
                        selected={location}
                    />
                    {location === 'others' && (
                        <ThemedInputField label="Rent without consent location others"
                            style={{ marginVertical: 10 }}
                            value={otherLocation}
                            onChangeText={setOtherLocation} />
                    )}
                </View>
                <View>
                    <Text style={styles.Text2}>Is the structure located in a danger zone area</Text>
                    <ThemedRadioBtn
                        options={[
                            { label: 'Yes', value: 'yes' },
                            { label: 'No', value: 'no' },
                        ]}
                        onChange={(val) => {
                            setDangerZone(val);
                            setHazard(null);
                        }}
                        selected={dangerZone}
                    />
                    {dangerZone === 'yes' && (
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
                                onChange={setHazard}
                                selected={hazard}
                            />
                            {hazard === 'Others' && (
                                <ThemedInputField
                                    style={styles.input}
                                    label="Specify hazard"
                                    value={otherHazard}
                                    onChangeText={setOtherHazard}
                                />
                            )}
                        </>
                    )}
                </View>

                <View>
                    <Text style={styles.Text2}>Will the structure be affected by a government project</Text>
                    <ThemedRadioBtn
                        options={[
                            { label: 'Yes', value: 'yes' },
                            { label: 'No', value: 'no' },
                        ]}
                        onChange={setGovernmentProject}
                        selected={governmentProject}
                    />

                    {governmentProject === 'yes' && (
                        <ThemedInputField
                            style={styles.input}
                            label="If yes, specify the government project"
                            value={projectName}
                            onChangeText={setProjectName}
                        />
                    )}
                </View>
                <View>
                    <Text style={styles.Text2}>Will the structure be affected by court order</Text>
                    <ThemedRadioBtn
                        options={[
                            { label: 'Yes', value: 'yes' },
                            { label: 'No', value: 'no' }, ,
                        ]}
                        onChange={handleRadioChange}
                        selected=""
                    />
                </View>
                <View>
                    <Text style={styles.Text2}>Are you a resident voter in Davao City</Text>
                    <ThemedRadioBtn
                        options={[
                            { label: 'Yes', value: 'yes' },
                            { label: 'No', value: 'no' },
                        ]}
                        onChange={setVoterStatus}
                        selected={voterStatus}
                    />

                    {voterStatus === 'no' && (
                        <ThemedInputField
                            style={styles.input}
                            label="If no, where?"
                            value={specificLocation}
                            onChangeText={setSpecificLocation}
                        />
                    )}
                </View>
                <ThemedPlaceModal
                    visible={modalVisible}
                    animationType="slide"
                    transparent={true}
                    onRequestClose={closeModal}
                >
                </ThemedPlaceModal>

                <ThemedTableForm headers={headers} />

                <Link href='/forms/association-form/household' asChild>
                    <ThemedButton
                        title="Next"
                        style={{ width: '100%', marginVertical: 10 }}
                    />
                </Link>
            </ThemedView>
        </ScrollView>
    )
}

export default index

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