import { StyleSheet, Text, View, Modal, TouchableWithoutFeedback } from 'react-native';
import { FontAwesome6 } from "@expo/vector-icons";
import { useState } from 'react';
import ThemedButton from '../ThemedForm/ThemedButton';
import ThemedInputField from '../ThemedForm/ThemedInputField';
import ThemedSubmit from '../ThemedForm/ThemedSubmit';
import React from 'react';

const ThemedAddPlace = () => {
    const [form, setForm] = useState({
        place: '',
        inclusive_dates: '',
    })
    const [showModal, setShowModal] = useState(false);

    const handleAddPlace = () => {
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    return (
        <View style={styles.container}>
            <View style={styles.row}>
                <Text style={styles.label}>
                    Specific Place of Previous Residence (in chronological order):
                </Text>
                <ThemedButton
                    icon={() => <FontAwesome6 name="plus" size={14} color="#fff" />}
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

                            <ThemedInputField label="Place"
                                value={form.place}
                                onChangeText={(value => setForm({ ...form, place: value }))}
                            />

                            <ThemedInputField label="Inclusive dates"
                                value={form.inclusive_dates}
                                onChangeText={(value => setForm({ ...form, inclusive_dates: value }))}
                            />

                            <ThemedSubmit style={styles.submitButton} title={"Submit"}
                                onPress={() => console.log('Submit')}
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
        // alignItems: 'center',
    },
    modalTitle: {
        fontSize: 14,
        marginBottom: 20,
        color: '#2D3748',
        fontWeight: 'bold',
    },
    closeButton: {
        backgroundColor: '#2680eb',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
        alignItems: 'center',
    },
    closeButtonText: {
        color: '#fff',
        fontWeight: '600',
    },
    submitButton: {
        width: "100%",
    }
});
