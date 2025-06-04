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
        <View style={[styles.container, style]}>
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
                        <View style={styles.radioOuter}>
                            {selectedOption === option.value && <View style={styles.radioInner} />}
                        </View>
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
        marginBottom: 10,
    },
    option: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 12,
        marginBottom: 8,
    },
    radioOuter: {
        height: 18,
        width: 18,
        borderRadius: 9,
        borderWidth: 2,
        borderColor: '#999',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 6,
    },
    radioInner: {
        height: 8,
        width: 8,
        borderRadius: 4,
        backgroundColor: '#007AFF',
    },
    label: {
        fontSize: 14,
        color: '#333',
    },
});
