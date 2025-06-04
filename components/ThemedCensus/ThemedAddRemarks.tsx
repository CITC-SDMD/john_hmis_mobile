import { StyleSheet, Text, View, Modal, TouchableWithoutFeedback, SafeAreaView, ActivityIndicator } from 'react-native';
import ThemedDropdown from "../../components/ThemedForm/ThemedDropdown";
import { applicationService } from "../API/ApplicationService";
import { FontAwesome6 } from "@expo/vector-icons";
import { useState } from 'react';
import { ALERT_TYPE, Toast } from "react-native-alert-notification";
import { useColorScheme } from "react-native";
import { Colors } from "../../constants/Colors";
import * as DocumentPicker from 'expo-document-picker';
import ThemedError from "../ThemedForm/ThemedError";
import ThemedButton from '../../components/ThemedForm/ThemedButton';
import ThemedInputField from '../ThemedForm/ThemedInputField';
import ThemedSubmit from '../ThemedForm/ThemedSubmit';
import React from 'react';

const ThemedAddRemarks = ({ sex, uuid, attested_by, remarks, attested_signature }) => {
    const colorScheme = useColorScheme();
    const theme = Colors[colorScheme] ?? Colors.light;
    const [form, setForm] = useState({
        remarks: remarks ? remarks : '',
        attested_by: attested_by ? attested_by : '',
        attested_signature: attested_signature ? attested_signature : null,
        sex: sex,
    })
    const [showModal, setShowModal] = useState(false);
    const [errors, setErrors] = useState('' as any)
    const [isLoading, setIsLoading] = useState(false)

    const remarksList = [
        { label: 'Absentee Owner', value: 'Absentee Owner' },
        { label: 'Uninterviewed', value: 'Uninterviewed' },
        { label: 'Unoccupied', value: 'Unoccupied' },
    ]

    const handleSubmitRemarks = async () => {
        try {
            setIsLoading(true)
            const formData = new FormData();
            formData.append('applicant_uuid', uuid);
            formData.append('remarks', form.remarks)
            formData.append('sex', form.sex)
            formData.append('attested_by', form.attested_by)
            formData.append('attested_signature', form.attested_signature)
            const response = await applicationService.saveRemarks(uuid, formData)
            if (response.data) {
                successAlert(
                    "Successful",
                    "You have been successfully created remarks",
                    ALERT_TYPE.SUCCESS
                );
                setShowModal(false)
                setErrors({});
            }
        } catch (error) {
            setErrors(error);
        } finally {
            setIsLoading(false)
        }
    };


    const handlePickFile = async () => {
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
                    attested_signature: {
                        uri: file.uri,
                        name: file.name,
                        type: file.mimeType || 'application/octet-stream',
                    },
                }));
            }
        } catch (err) {
            console.error('Document Error:', err);
        }
    };

    const handleAddPlace = () => {
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    const getFileName = () => {
        if (!form.attested_signature) return 'Select file';

        if (typeof form.attested_signature === 'string') {
            return form.attested_signature.split('/').pop() || 'File selected';
        }

        if (form.attested_signature.name) {
            return form.attested_signature.name;
        }

        if (form.attested_signature.uri) {
            return form.attested_signature.uri.split('/').pop() || 'File selected';
        }

        return 'File selected';
    };

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
                <Text style={{ color: theme.textLight }}>Submitting ...</Text>
            </SafeAreaView>
        );
    }

    return (

        <View style={styles.container}>
            <ThemedButton
                icon={() => <FontAwesome6 name="edit" size={14} color="#fff" />}
                styleButton={[styles.button, { justifyContent: "center", }]}
                children={"Add remarks"}
                onPress={handleAddPlace}
            />

            <Modal
                visible={showModal}
                transparent={true}
                animationType="fade"
                onRequestClose={handleCloseModal}
            >
                <TouchableWithoutFeedback onPress={handleCloseModal}>
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContainer}>
                            <View>
                                <ThemedDropdown
                                    label="Remarks "
                                    required={true}
                                    value={form.remarks}
                                    onChangeText={(value) => {
                                        setForm({ ...form, remarks: value });
                                    }}
                                    items={remarksList}
                                    icon={() => <FontAwesome6 name="chevron-down" size={14} color="#2680eb" />}
                                />
                                <ThemedError error={errors?.remarks || errors?.errors?.remarks?.[0]} />
                            </View>

                            <View>
                                <ThemedInputField
                                    label="Attested by"
                                    required={true}
                                    value={form.attested_by}
                                    onChangeText={(value => setForm({ ...form, attested_by: value }))}
                                />
                                <ThemedError error={errors?.attested_by || errors?.errors?.attested_by?.[0]} />
                            </View>

                            <View>
                                <ThemedButton
                                    children={getFileName()}
                                    label="Attested"
                                    required={true}
                                    icon={() => <FontAwesome6 name="upload" size={18} color="#fff" />}
                                    styleButton={[styles.uploadImage, { justifyContent: 'center' }]}
                                    onPress={handlePickFile}
                                />
                                <ThemedError error={errors?.attested_signature || errors?.errors?.attested_signature?.[0]} />
                            </View>

                            <ThemedSubmit style={styles.submitButton} title={"Submit"}
                                onPress={handleSubmitRemarks}
                            />
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
        </View>
    );
};

export default ThemedAddRemarks;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 10,
    },
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    label: {
        fontWeight: "500",
        flex: 1,
        marginRight: 10,
        fontSize: 14,
        color: "#2D3748",
    },
    button: {
        backgroundColor: "#2680eb",
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
        width: '80%',
    },
    modalTitle: {
        fontSize: 14,
        marginBottom: 20,
        color: '#2D3748',
        fontWeight: 'bold',
    },
    submitButton: {
        width: "100%",
    },
    item: {
        backgroundColor: '#e2e2e2',
        padding: 20,
        marginVertical: 8,
        marginHorizontal: 16,
        borderRadius: 8,
    },
    title: {
        fontSize: 18,
    },
    uploadImage: {
        backgroundColor: "#2680eb",
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
});
