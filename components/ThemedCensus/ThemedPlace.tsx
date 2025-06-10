import { StyleSheet, Text, View, Modal, TouchableWithoutFeedback, SafeAreaView, ActivityIndicator } from 'react-native';
import { applicantResidencesService } from "../../components/API/applicantResidencesService";
import { FontAwesome6 } from "@expo/vector-icons";
import { useState } from 'react';
import { useColorScheme } from "react-native";
import { Colors } from "../../constants/Colors";
import { ALERT_TYPE, Toast } from "react-native-alert-notification";
import ThemedError from "../ThemedForm/ThemedError";
import ThemedButton from '../ThemedForm/ThemedButton';
import ThemedInputField from '../ThemedForm/ThemedInputField';
import ThemedSubmit from '../ThemedForm/ThemedSubmit';
import React from 'react';

const ThemedAddPlace = ({ uuid, fetchApplicant, onSubmit }) => {
    const colorScheme = useColorScheme();
    const theme = Colors[colorScheme] ?? Colors.light;
    const [form, setForm] = useState({
        place: '',
        inclusive_dates: '',
    })
    const [showModal, setShowModal] = useState(false);
    const [isLoading, setIsLoading] = useState(false)
    const [errors, setErrors] = useState('' as any);


    const handleSubmitPlace = async () => {
        try {
            setIsLoading(true)
            const params = {
                applicant_uuid: uuid,
                place: form.place,
                inclusive_dates: form.inclusive_dates
            }
            const response = await applicantResidencesService.saveApplicantResidences(params)
            if (response.data) {
                onSubmit()
                setShowModal(false)
                fetchApplicant();
                successAlert(
                    "Successful",
                    "You have been successfully created residence",
                    ALERT_TYPE.SUCCESS
                );
                setErrors({});
            }
        } catch (error) {
            setErrors(error)
        } finally {
            setIsLoading(false)
        }
    }

    function successAlert(title, message, type) {
        Toast.show({
            title: title,
            textBody: message,
            type: type,
        });
    }

    const handleAddPlace = () => {
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setErrors({});
    };

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
            <View style={styles.row}>
                <Text style={styles.label}>
                    Specific Place of Previous Residence (in chronological order):
                </Text>
                <ThemedButton
                    icon={() => <FontAwesome6 name="location-dot" size={14} color="#fff" />}
                    styleButton={styles.button}
                    children={"Add place"}
                    onPress={handleAddPlace}
                />
            </View>

            <Modal
                visible={showModal}
                transparent={true}
                animationType="fade"
                onRequestClose={handleCloseModal}
            >
                <TouchableWithoutFeedback onPress={handleCloseModal}>
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContainer}>
                            <Text style={styles.modalTitle}>Add place of previous residence</Text>

                            <View>
                                <ThemedInputField
                                    label="Place"
                                    required={true}
                                    value={form.place}
                                    onChangeText={(value) => {
                                        setForm({ ...form, place: value });
                                    }}
                                />
                                <ThemedError error={errors?.place || errors?.errors?.place?.[0]} />
                            </View>

                            <View>
                                <ThemedInputField
                                    label="Inclusive dates"
                                    required={true}
                                    value={form.inclusive_dates}
                                    onChangeText={(value) => {
                                        setForm({ ...form, inclusive_dates: value });
                                    }}
                                />
                                <ThemedError
                                    error={errors?.inclusive_dates || errors?.errors?.inclusive_dates?.[0]}
                                />
                            </View>

                            <ThemedSubmit
                                style={styles.submitButton}
                                title={"Submit"}
                                onPress={handleSubmitPlace}
                            />
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>

        </View>
    );
};

export default ThemedAddPlace;

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
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
});
