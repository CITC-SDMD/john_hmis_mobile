import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';

const ThemedDropdown = ({ label, value, onChangeText, items, placeholder = 'Select Option', icon, required = false, }) => {
    return (
        <View style={styles.wrapper}>
            {label && <Text style={styles.label}>
                {label}
                {required && <Text style={{ color: "red" }}>*</Text>}
            </Text>}
            <View style={styles.inputWrapper}>
                <RNPickerSelect
                    Icon={icon}
                    onValueChange={onChangeText}
                    items={items}
                    placeholder={{ label: placeholder, value: null }}
                    style={pickerSelectStyles}
                    value={value}
                    useNativeAndroidPickerStyle={false}
                />
            </View>
        </View>
    );
};

export default ThemedDropdown;

const styles = StyleSheet.create({
    wrapper: {
        marginBottom: 10,
    },
    label: {
        fontSize: 14,
        fontWeight: "500",
        color: "#2D3748",
        marginBottom: 4,
    },
    inputWrapper: {
        borderWidth: 1,
        borderColor: "#2680eb",
        borderRadius: 8,
        backgroundColor: "#fff",
        marginBottom: 5
    },
});

const pickerSelectStyles = {
    inputIOS: {
        padding: 10,
        fontSize: 14,
        color: "#000",
        paddingRight: 30,
    },
    inputAndroid: {
        padding: 10,
        fontSize: 14,
        color: "#000",
        paddingRight: 30, // for icon space
    },
    iconContainer: {
        top: 12,
        right: 10,
    },
    placeholder: {
        color: '#A0AEC0',
    },
};
