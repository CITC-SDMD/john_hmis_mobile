import { StyleSheet, Text, View, Modal, TouchableWithoutFeedback, SafeAreaView, ActivityIndicator } from 'react-native';
import { FontAwesome6 } from "@expo/vector-icons";
import { ALERT_TYPE, Toast } from "react-native-alert-notification";
import { useColorScheme } from "react-native";
import { Colors } from "../../constants/Colors";
import { applicantDocumentService } from "../API/ApplicantDocumentService";
import { useEffect, useState } from 'react';
import * as DocumentPicker from 'expo-document-picker';
import ThemedButton from '../../components/ThemedForm/ThemedButton';
import ThemedSubmit from '../ThemedForm/ThemedSubmit';

const ThemedAddDocuments = ({ uuid }) => {
    const colorScheme = useColorScheme();
    const theme = Colors[colorScheme] ?? Colors.light;
    const [uploadCompleted, setUploadCompleted] = useState({
        letter: false,
        certificate: false,
        affidavit: false
    });
    const [currentStep, setCurrentStep] = useState(0);
    const [uploadedFiles, setUploadedFiles] = useState({});

    const [showModal, setShowModal] = useState(false);
    const [errors, setErrors] = useState('' as any)
    const [isLoading, setIsLoading] = useState(false)


    const requiredDocuments = [
        { id: 1, label: "Letter of Intent", key: "letter" },
        { id: 2, label: "Certificate of No Land Holding", key: "certificate" },
        { id: 3, label: "Affidavit of No Land Holding", key: "affidavit" },
    ];

    const getFileName = () => {
        const currentKey = requiredDocuments[currentStep].key;
        const file = uploadedFiles[currentKey];

        if (!file) return 'Select Document';

        return file.name || file.uri?.split('/').pop() || 'File selected';
    };

    useEffect(() => {
        fetchDocuments()
    }, [])

    const fetchDocuments = async () => {
        try {
            const params = {
                applicant_uuid: uuid
            }
            const response = await applicantDocumentService.getDocumentByUuid(params);
            if (response.data) {
                const docs = response.data;
                setUploadCompleted({
                    letter: docs.some(doc => doc.document_type_id === 1),
                    certificate: docs.some(doc => doc.document_type_id === 2),
                    affidavit: docs.some(doc => doc.document_type_id === 3),
                });
                const nextStep = requiredDocuments.findIndex(doc =>
                    !docs.some(d => d.document_type_id === doc.id)
                );
                setCurrentStep(nextStep === -1 ? 0 : nextStep);
            }
        } catch (error) {
            setErrors(error)
        }
    }

    const handleSubmitRemarks = async () => {
        try {
            setIsLoading(true)
            const currentDoc = requiredDocuments[currentStep];
            const file = uploadedFiles[currentDoc.key];
            const params = new FormData();
            params.append('applicant_uuid', uuid);
            params.append('document_type_id', currentDoc?.id);
            params.append('file', file);
            const response = await applicantDocumentService.saveApplicantDocument(params)
            if (response.data) {
                successAlert(
                    "Successful",
                    "You have been successfully upload documents",
                    ALERT_TYPE.SUCCESS
                );
                setUploadCompleted(prev => ({
                    ...prev,
                    [currentDoc.key]: true
                }));

                const nextStep = requiredDocuments.findIndex((doc, index) =>
                    index > currentStep && !uploadCompleted[doc.key]
                );

                if (nextStep !== -1) {
                    setCurrentStep(nextStep);
                } else {
                    setShowModal(false);
                }
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

                const currentKey = requiredDocuments[currentStep].key;

                setUploadedFiles(prev => ({
                    ...prev,
                    [currentKey]: {
                        uri: file.uri,
                        name: file.name,
                        type: file.mimeType || 'application/octet-stream',
                    }
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

    const allDocumentsUploaded = requiredDocuments.every(doc =>
        uploadCompleted[doc.key]
    );

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
                icon={() => <FontAwesome6 name="upload" size={14} color="#fff" />}
                styleButton={[styles.button, { justifyContent: "center", }]}
                children={"Upload Ducoments"}
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
                                {!allDocumentsUploaded && (
                                    <View>
                                        <ThemedButton
                                            children={
                                                uploadedFiles[requiredDocuments[currentStep].key]
                                                    ? getFileName()
                                                    : requiredDocuments[currentStep].label
                                            }
                                            label="Upload Documents"
                                            icon={() => <FontAwesome6 name="upload" size={18} color="#fff" />}
                                            styleButton={[styles.uploadImage, { justifyContent: 'center' }]}
                                            onPress={handlePickFile}
                                        />

                                        <ThemedSubmit style={styles.submitButton} title={"Submit"}
                                            onPress={handleSubmitRemarks}
                                        />
                                    </View>
                                )}
                            </View>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
        </View>
    );
};

export default ThemedAddDocuments;

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
