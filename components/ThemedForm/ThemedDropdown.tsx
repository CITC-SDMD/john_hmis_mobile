import React from 'react';
import { View, StyleSheet, Text, Platform } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import { Ionicons } from '@expo/vector-icons';

const ThemedDropdown = ({
    label,
    value,
    onChangeText,
    items,
    placeholder = 'Select Option',
    required = false,
}) => {
    return (
        <View style={styles.wrapper}>
            {label && (
                <View style={{ flexDirection: 'row' }}>
                    <Text style={styles.label}>{label}</Text>
                    {required && <Text style={{ color: 'red', marginLeft: 4 }}>*</Text>}
                </View>
            )}

            <RNPickerSelect
                value={value}
                onValueChange={onChangeText}
                items={items}
                useNativeAndroidPickerStyle={false}
                placeholder={{ label: placeholder, value: null }}
                Icon={() => <Ionicons name="chevron-down" size={20} color="#4A5568" />}
                style={{
                    inputIOSContainer: styles.inputWrapper,
                    inputAndroidContainer: styles.inputWrapper,
                    inputIOS: styles.input,
                    inputAndroid: styles.input,
                    placeholder: styles.placeholder,
                    iconContainer: styles.icon,
                }}
            />
        </View>
    );
};

export default ThemedDropdown;

const styles = StyleSheet.create({
    wrapper: {
        width: '100%',
        marginBottom: 16,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#4A5568',
        marginBottom: 8,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderWidth: 1,
        borderColor: '#D5DCE4',
        borderRadius: 8,
        backgroundColor: '#fff',
        paddingHorizontal: 12,
        minHeight: 50,
    },
    input: {
        fontSize: 14,
        color: '#2D3748',
        flex: 1,
        paddingVertical: Platform.OS === 'ios' ? 12 : 8,
    },
    placeholder: {
        color: '#A0AEC0',
    },
    icon: {
        top: Platform.OS === 'ios' ? 16 : 12,
        right: 10,
    },
});
