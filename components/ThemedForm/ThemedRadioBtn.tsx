import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const ThemedRadioBtn = ({ label, required, options, onChangeText, selected, style }) => {
    const [selectedOption, setSelectedOption] = useState(selected);

    useEffect(() => {
        setSelectedOption(selected);
    }, [selected]);

    const handleSelect = (value) => {
        setSelectedOption(value);
        if (onChangeText) onChangeText(value);
    };

    return (
        <View style={styles.container}>
            {label && (
                <Text style={styles.groupLabel}>
                    {label}
                    {required && <Text style={{ color: "red" }}> *</Text>}
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
    container: {},
    groupLabel: {
        fontSize: 14,
        fontWeight: "500",
        color: "#2D3748",
        marginBottom: 5,
    },
    row: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        // alignItems: 'center',
        gap: 8,
        // marginTop: 1,
        marginBottom: 10
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
        fontSize: 14,
    },
});
