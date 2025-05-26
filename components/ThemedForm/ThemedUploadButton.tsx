import React from 'react';
import { TouchableOpacity, Text, View, StyleSheet } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';

const ThemedUploadButton = ({
    onFileSelect,
    buttonText = 'Upload File',
    allowedTypes = '*/*',
    multiple = false,
    style = {},
    textStyle = {},
    label = '',
    labelStyle = {},
    containerStyle = {},
    children,
    pickerOptions = {},
}) => {
    const handleUpload = async () => {
        try {
            const result = await DocumentPicker.getDocumentAsync({
                type: allowedTypes,
                multiple,
                copyToCacheDirectory: true,
                ...pickerOptions,
            });

            if (result.type === 'success') {
                onFileSelect?.(result);
            } else {
                console.log('User cancelled document picker');
            }
        } catch (error) {
            console.error('Upload error:', error);
        }
    };

    return (
        <View style={[styles.container, containerStyle]}>
            {label ? <Text style={[styles.label, labelStyle]}>{label}</Text> : null}
            <TouchableOpacity onPress={handleUpload} style={[styles.button, style]}>
                {children ? children : <Text style={[styles.buttonText, textStyle]}>{buttonText}</Text>}
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginVertical: 10,
    },
    label: {
        fontSize: 13,
        color: '#333',
        marginBottom: 6,
    },
    button: {
        backgroundColor: '#007bff',
        padding: 10,
        borderRadius: 6,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
    },
});

export default ThemedUploadButton;