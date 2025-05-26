import { StyleSheet, Text, View, ScrollView } from 'react-native'
import React from 'react'
import ThemedView from '../../../components/ThemedForm/ThemedView'
import ThemedButton from '../../../components/ThemedForm/ThemedButton'
import ThemedRadioBtn from '../../../components/ThemedForm/ThemedRadioBtn'
import ThemedInputField from '../../../components/ThemedForm/ThemedInputField'
import { useState } from 'react'
import ThemedTableForm from '../../../components/ThemedTable/ThemedTableForm'
import ThemedUploadButton from '../../../components/ThemedForm/ThemedUploadButton'


const household = () => {

    const [contactNumber, setContactNumber] = useState('');
    const [birthdate, setBirthdate] = useState('');
    const [error, setError] = useState('');
    const headers = ['Full name', 'Civil status', 'Relation', 'View'];

    const handleRadioChange = (value) => {
        console.log('Selected:', value);
    };
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

                <View style={{ marginVertical: 12 }}>
                    <Text style={{ marginBottom: 10, marginTop: 10 }}>
                        II. INFORMATION OF HOUSEHOLD MEMBERS
                    </Text>
                    <ThemedButton
                        title="Add Household"
                        style={{ alignSelf: 'flex-start' }}
                    />
                </View>
                <View style={{ marginBottom: 10 }}>
                    <ThemedTableForm headers={headers} />
                </View>
                <View>
                    <Text>
                        III. OTHER INFORMATION
                    </Text>
                </View>
                <View style={styles.viewMargin}>
                    <Text>Does the family receive any remittances</Text>
                    <ThemedRadioBtn
                        options={[
                            { label: 'Yes', value: 'yes' },
                            { label: 'No', value: 'no' },
                        ]}
                        onChange={handleRadioChange}
                        selected=""
                    />
                </View>
                <View style={styles.viewMargin}>
                    <Text>Does the Household head/spouse own any real property in the Philippines</Text>
                    <ThemedRadioBtn
                        options={[
                            { label: 'Yes', value: 'yes' },
                            { label: 'No', value: 'no' },
                        ]}
                        onChange={handleRadioChange}
                        selected=""
                    />
                </View>
                <View style={styles.viewMargin}>
                    <Text>Has the Household head/spouse already been awarded government resettlement/housing assistance</Text>
                    <ThemedRadioBtn
                        options={[
                            { label: 'Yes', value: 'yes' },
                            { label: 'No', value: 'no' },
                        ]}
                        onChange={handleRadioChange}
                        selected=""
                    />
                </View>
                <View style={styles.viewMargin}>
                    <Text>
                        I hereby certify that the above statement and information are true and correct to the best of my knowledge. I further understand that any misrepresentation and/or deliberate omission of facts and information contained here in shall constitute ground for my disqualification.
                    </Text>
                </View>
                <View style={[styles.viewBorder, { marginBottom: 10 }]}>
                    <Text>
                        <Text style={{ fontWeight: 'bold' }}>
                            DATA PRIVACY ACT (R.A. 10173)
                        </Text>
                        : The Department needs your personal data above for data and information collection. By signing this census form, you give consent to the collection, use, processing and storage of the information you provided above.
                    </Text>
                </View>
                <View>
                    <ThemedInputField
                        label="Contact Number:"
                        style={{ marginVertical: 10 }}
                        keyboardType="numeric"
                        value={contactNumber}
                        onChangeText={(text) => {
                            const numericText = text.replace(/[^0-9]/g, '');
                            setContactNumber(numericText);
                        }}
                    />
                </View>
                <View>
                    <ThemedInputField
                        label="Date:"
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

                <ThemedUploadButton
                    label='HH Head/Registrant Signature: '
                    onFileSelect={(file) => console.log('Selected file:', file)}
                    buttonText="Upload Signature"
                    allowedTypes="application/pdf"
                />

                <ThemedButton
                    title={'Submit'}
                    style={{ width: '100%' }}
                />


            </ThemedView>
        </ScrollView>
    )
}

export default household

const styles = StyleSheet.create({

    viewMargin: {
        marginVertical: 10
    },
    viewBorder: {
        borderWidth: 1,
        borderColor: 'black',
        borderRadius: 8,
        padding: 10
    },
    row: {
        flexDirection: 'row',
        columnGap: 8,
    },
})