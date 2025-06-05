import { StyleSheet, Text, View, ScrollView, RefreshControl } from 'react-native'
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
import ThemedOtherInformationValidation from "../Validation/ThemedOtherInformationValidation";
import { FontAwesome6 } from "@expo/vector-icons";
import * as DocumentPicker from 'expo-document-picker';
import React, { useState } from 'react'

const ThemedOtherInformation = ({ onSubmit, errors, setErrors }) => {

    const [form, setForm] = useState({
        is_remittance: false,
        remittance: '',
        have_property: false,
        is_awarded: false,
        awarded: '',
        date: '',
        phone_number: '',
        applicant_signature: null,
    });
    const [refreshing, setRefreshing] = useState(false);

    const onRefresh = () => {
        setRefreshing(true);
        try {
            setErrors({})
        } catch (error) {

        } finally {
            setRefreshing(false);
        }

    }

    const handlePickStructureFile = async () => {
        try {
            const res = await DocumentPicker.getDocumentAsync({
                type: '*/*',
                copyToCacheDirectory: true,
                multiple: false,
            });

            if (res.assets && res.assets.length > 0) {
                const file = res.assets[0];
                setForm(prev => ({
                    ...prev,
                    applicant_signature: {
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

    const handleSubmit = async () => {
        if (onSubmit) {
            onSubmit(form);
        }
    }

    return (
        <ScrollView refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
            <Text style={{ fontWeight: "500", marginTop: 10 }} >III. OTHER INFORMATION</Text>

            <View style={[styles.inputWrapper, styles.row, { padding: 5, marginTop: 10 }]}>
                <View style={{ flex: 1 }}>
                    <ThemedRadioBtn
                        label={"Does the family receive any remittances?"}
                        required={true}
                        onChangeText={(value) => {
                            setForm(prev => ({ ...prev, is_remittance: value }))
                            console.log(value)
                        }}
                        options={[
                            { label: 'Yes', value: true },
                            { label: 'No', value: false },
                        ]}
                        selected={form.is_remittance}
                    />
                    <ThemedError error={errors?.is_remittance || errors?.errors?.is_remittance?.[0]} />
                </View>

                {form.is_remittance === true && (
                    <View style={{ flex: 1 }}>
                        <ThemedRadioBtn
                            label={"If yes?"}
                            required={true}
                            onChangeText={(value) => {
                                setForm(prev => ({ ...prev, remittance: value }))
                                console.log(value)
                            }}
                            options={[
                                { label: 'Local', value: 'local' },
                                { label: 'International', value: 'international' },
                            ]}
                            selected={form.remittance}
                        />
                        <ThemedError error={errors?.remittance || errors?.errors?.remittance?.[0]} />
                    </View>
                )}
            </View>

            <View style={[styles.inputWrapper, styles.row, { padding: 5, marginTop: 10 }]}>
                <View style={{ flex: 1 }}>
                    <ThemedRadioBtn
                        label={"Does the Household head/spouse own any real property in the Philippines"}
                        onChangeText={(value) => {
                            setForm(prev => ({ ...prev, have_property: value }))
                            console.log(value)
                        }}
                        options={[
                            { label: 'Yes', value: true },
                            { label: 'No', value: false },
                        ]}
                        selected={form.have_property}
                    />
                </View>
            </View>

            <View style={[styles.inputWrapper, styles.row, { padding: 5, marginTop: 10 }]}>
                <View style={{ flex: 1 }}>
                    <ThemedRadioBtn
                        label={"Has the Household head/spouse already been awarded government resettlement/housing assistance "}
                        required={true}
                        onChangeText={(value) => {
                            setForm(prev => ({ ...prev, is_awarded: value }))
                            console.log(value)
                        }}
                        options={[
                            { label: 'Yes', value: true },
                            { label: 'No', value: false },
                        ]}
                        selected={form.is_awarded}
                    />
                    <ThemedError error={errors?.is_awarded || errors?.errors?.is_awarded?.[0]} />
                </View>
            </View>

            {form.is_awarded === true && (
                <View style={{ marginTop: 10 }}>
                    <ThemedInputField
                        required={true}
                        label="if yes, please specify "
                        value={form.awarded}
                        onChangeText={(value) => {
                            setForm(prev => ({ ...prev, awarded: value }))
                            // if (errors?.['present_address']) {
                            //     setErrors(prev => ({ ...prev, present_address: undefined }));
                            // }
                        }}
                    />
                    <ThemedError error={errors?.awarded || errors?.errors?.awarded?.[0]} />
                </View>
            )}

            <View style={[styles.noticeContainer,
            form.is_awarded === true ? {} : { marginTop: 10 }
            ]}>
                <View style={styles.noticeBox}>
                    <Text style={styles.noticeText}>
                        I hereby certify that the above statement and information are true and correct to the best of my knowledge. I further understand that any misrepresentation and/or deliberate omission of facts and information contained herein shall constitute ground for my disqualification.
                    </Text>
                </View>

                <View style={styles.noticeBox}>
                    <Text style={styles.noticeText}>
                        <Text style={styles.bold}>DATA PRIVACY ACT (R.A. 10173):</Text> The Department needs your personal data above for data and information collection. By signing this census form, you give consent to the collection, use, processing and storage of the information you provided above.
                    </Text>
                </View>
            </View>

            <View style={[styles.row, { marginTop: 10 }]}>
                <View style={styles.inputBox}>
                    <ThemedInputField
                        label="Contact Number:"
                        keyboardType="numeric"
                        value={form.phone_number}
                        onChangeText={(value) => {
                            setForm(prev => ({ ...prev, phone_number: value }));
                        }}
                    />
                </View>

                <View style={styles.inputBox}>
                    <ThemedInputField
                        label="Date:"
                        value={form.date}
                        onChangeText={(value) => {
                            setForm(prev => ({ ...prev, date: value }));
                        }}
                    />
                </View>
            </View>

            <View>
                <ThemedButton
                    required={true}
                    children={
                        typeof form.applicant_signature === 'object'
                            ? form.applicant_signature?.name || 'Select file'
                            : form.applicant_signature
                                ? form.applicant_signature.split('/').pop()
                                : 'Select file'
                    }
                    label={"HH Head/Registrant Signature:"}
                    icon={() => <FontAwesome6 name="upload" size={18} color="#fff" />}
                    styleButton={[styles.uploadImage, { justifyContent: 'center' }]}
                    onPress={handlePickStructureFile}
                />
                <ThemedError error={errors?.applicant_signature || errors?.errors?.applicant_signature?.[0]} />
            </View>

            <ThemedSubmit title={"Submit"} style={[styles.submitButton, { marginTop: 10 }]} onPress={handleSubmit} />
        </ScrollView>
    )
}

export default ThemedOtherInformation

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 10,
    },
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

    inputBox: {
        flex: 1,
    },
    noticeContainer: {
        gap: 10,
    },
    noticeBox: {
        backgroundColor: '#f0f4ff',
        borderColor: '#2680eb',
        borderWidth: 1,
        borderRadius: 8,
        padding: 10,
    },
    noticeText: {
        fontSize: 14,
        color: '#333',
        textAlign: 'justify',
        lineHeight: 18,
        fontWeight: 'medium'
    },
    bold: {
        fontWeight: '700',
    },
    uploadImage: {
        backgroundColor: "#2680eb",
    },
    submitButton: {
        width: "100%"
    },
})