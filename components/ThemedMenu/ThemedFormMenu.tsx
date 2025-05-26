import React, { useState } from "react";
import { MaterialIcons } from '@expo/vector-icons';
import { Dropdown } from 'react-native-element-dropdown';
import {
    Text,
    StyleSheet,
    View,
    Modal,
    TextInput,
    TouchableOpacity,
    Pressable,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
    Menu,
    MenuTrigger,
    MenuOptions,
    MenuOption,
} from "react-native-popup-menu";
import * as DocumentPicker from "expo-document-picker";
import ThemedInputField from '../../components/ThemedForm/ThemedInputField'
import ThemedUploadButton from "../ThemedForm/ThemedUploadButton";

const ThemedFormMenu = ({ label = "Actions", onRemarks = () => { }, theme }) => {
    const [isRequirementsModalVisible, setRequirementsModalVisible] = useState(false);
    const [isModalVisible, setModalVisible] = useState(false);
    const [fieldOne, setFieldOne] = useState("");
    const [fieldTwo, setFieldTwo] = useState("");

    const handleUpload = async (documentType) => {
        try {
            const result = await DocumentPicker.getDocumentAsync({
                type: "application/pdf",
            });

            if (result?.assets && result.assets.length > 0) {
                const file = result.assets[0];
                console.log(`${documentType} uploaded:`, file.uri);
            }
        } catch (err) {
            console.error("Upload error:", err);
        }
    };

    const submitRemarks = () => {
        console.log("Remarks submitted:", fieldOne, fieldTwo);
        onRemarks({ fieldOne, fieldTwo });
        setModalVisible(false);
        setFieldOne("");
        setFieldTwo("");
    };

    return (
        <>
            <Menu>
                <MenuTrigger>
                    <View style={styles.triggerContainer}>
                        <Text
                            style={[
                                styles.menuClick,
                                {
                                    backgroundColor: theme?.blue || "#2680eb",
                                    color: theme?.white || "#fff",
                                    fontSize: 11,
                                },
                            ]}
                        >
                            {label}
                        </Text>
                        <Ionicons
                            name="ellipsis-vertical"
                            size={23}
                            color={theme?.blue || "#2680eb"}
                        />
                    </View>
                </MenuTrigger>

                <MenuOptions
                    customStyles={{
                        optionsContainer: {
                            padding: 8,
                            borderRadius: 4,
                            backgroundColor: "#fff",
                            shadowColor: "#000",
                            shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: 0.2,
                            shadowRadius: 4,
                            elevation: 5,
                        },
                        optionWrapper: {
                            paddingVertical: 10,
                            paddingHorizontal: 12,
                        },
                    }}
                >
                    <MenuOption
                        style={styles.contentflex}
                        onSelect={() => setModalVisible(true)}
                    >
                        <Ionicons
                            name="chatbox-ellipses-outline"
                            color={"#2680eb"}
                            size={20}
                        />
                        <Text style={styles.optionText}>Remarks</Text>
                    </MenuOption>

                    <MenuOption
                        style={styles.contentflex}
                        onSelect={() => setRequirementsModalVisible(true)}
                    >
                        <Ionicons
                            name="clipboard-outline"
                            color={"#2680eb"}
                            size={20}
                        />
                        <Text style={styles.optionText}>View Requirements</Text>
                    </MenuOption>
                </MenuOptions>
            </Menu>

            <Modal
                transparent
                animationType="slide"
                visible={isModalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <Pressable
                    style={styles.modalOverlay}
                    onPress={() => setModalVisible(false)}
                >
                    <Pressable style={styles.modalContent} onPress={() => { }}>
                        <Text style={styles.modalTitle}>Remarks</Text>

                        <Dropdown
                            style={styles.dropdown}
                            placeholderStyle={styles.placeholderStyle}
                            selectedTextStyle={styles.selectedTextStyle}
                            data={[
                                { label: "Absentee Owner", value: "Absentee Owner" },
                                { label: "Uninterviewed", value: "Uninterviewed" },
                                { label: "Unoccupied", value: "Unoccupied" },
                            ]}
                            maxHeight={200}
                            labelField="label"
                            valueField="value"
                            placeholder="Select Option"
                            searchPlaceholder="Search..."
                            value={fieldOne}
                            onChange={(item) => setFieldOne(item.value)}
                        />

                        <ThemedInputField
                            label="Attested by"
                            value={fieldTwo}
                            onChangeText={setFieldTwo}
                        />

                        <ThemedUploadButton
                            containerStyle={{ marginTop: 0 }}
                            label="Attested"
                            onFileSelect={(file) => console.log(file)}
                        >
                            <MaterialIcons name="attach-file" size={20} color="white" />
                            <Text style={{ color: 'white', marginLeft: 8 }}>Upload Signature</Text>
                        </ThemedUploadButton>

                        <View style={styles.modalButtons}>
                            <Pressable
                                style={[styles.button, styles.submitButton]}
                                onPress={submitRemarks}
                            >
                                <Text style={styles.buttonText}>Submit</Text>
                            </Pressable>
                        </View>
                    </Pressable>
                </Pressable>
            </Modal >

            <Modal
                transparent
                animationType="slide"
                visible={isRequirementsModalVisible}
                onRequestClose={() => setRequirementsModalVisible(false)}
            >
                <Pressable
                    style={styles.modalOverlay}
                    onPress={() => setRequirementsModalVisible(false)}
                >
                    <Pressable style={styles.modalContent} onPress={() => { }}>
                        <Text style={styles.modalTitle}>Upload Requirements</Text>

                        <ThemedUploadButton
                            label="Upload Letter of Intent"
                            onFileSelect={() => handleUpload("Letter of Intent")}
                        />

                        <ThemedUploadButton
                            label="Upload Certificate of No Land Holding"
                            onFileSelect={() => handleUpload("Certificate of No Land Holding")}
                        />

                        <ThemedUploadButton
                            label="Upload Affidavit of No Land Holding"
                            onFileSelect={() => handleUpload("Affidavit of No Land Holding")}
                        />

                        <Pressable
                            style={[styles.button, styles.cancelButton, { marginTop: 10 }]}
                            onPress={() => setRequirementsModalVisible(false)}
                        >
                            <Text style={[styles.buttonText, { color: '#333' }]}>Cancel</Text>
                        </Pressable>
                    </Pressable>
                </Pressable>
            </Modal>
        </>
    );
};

const styles = StyleSheet.create({
    optionText: {
        marginLeft: 7,
        fontSize: 13,
        color: "#333",
    },
    contentflex: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 8,
    },
    triggerContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
    },
    menuClick: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 5,
        fontWeight: "600",
        textAlign: "center",
    },
    modalOverlay: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0,0,0,0.5)",
    },
    modalContent: {
        width: "85%",
        backgroundColor: "#fff",
        padding: 20,
        borderRadius: 10,
    },
    modalTitle: {
        fontSize: 14,
        marginBottom: 5,
    },
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 5,
        padding: 10,
        marginBottom: 10,
    },
    modalButtons: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 2,
    },
    button: {
        padding: 10,
        borderRadius: 5,
        minWidth: 100,
        alignItems: "center",
    },
    cancelButton: {
        backgroundColor: "#ccc",
    },
    submitButton: {
        backgroundColor: "#2680eb",
        width: '100%'
    },
    buttonText: {
        color: "#fff",
        fontWeight: "600",
    },
    dropdown: {
        height: 45,
        borderColor: 'blue',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 10,
        // marginBottom: 10,
    },
    placeholderStyle: {
        fontSize: 14,
        color: '#999',
    },
    selectedTextStyle: {
        fontSize: 14,
        color: '#333',
    },
    inputSearchStyle: {
        height: 40,
        fontSize: 14,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
    },
});

export default ThemedFormMenu;