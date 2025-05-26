import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const ThemedRadioBtn = ({ label, required, options, onChange, selected }) => {
    const [selectedOption, setSelectedOption] = useState(selected);

    const handleSelect = (value) => {
        setSelectedOption(value);
        if (onChange) onChange(value);
    };

    return (
        <View style={styles.container}>
            {label && (
                <Text style={styles.groupLabel}>
                    {label}
                    {required && <Text style={styles.required}> *</Text>}
                </Text>
            )}

            <View style={styles.row}>
                {options.map((option) => (
                    <TouchableOpacity
                        key={option.value}
                        style={styles.option}
                        onPress={() => handleSelect(option.value)}
                    >
                        <View
                            style={[
                                styles.radio,
                                selectedOption === option.value && styles.radioSelected,
                            ]}
                        />
                        <Text style={styles.label}>{option.label}</Text>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );
};

export default ThemedRadioBtn;

const styles = StyleSheet.create({
    container: {
        marginVertical: 8,
    },
    groupLabel: {
        fontSize: 14,
        // fontWeight: '500',
        marginBottom: 6,
    },
    required: {
        color: 'red',
    },
    row: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'center',
        gap: 8,
        marginTop: 1,
    },
    option: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 4,
        marginBottom: 4,
    },
    radio: {
        height: 14,
        width: 14,
        borderRadius: 7,
        borderWidth: 2,
        borderColor: '#999',
        marginRight: 8,
    },
    radioSelected: {
        backgroundColor: '#007AFF',
        borderColor: '#007AFF',
    },
    label: {
        fontSize: 15,
    },
});