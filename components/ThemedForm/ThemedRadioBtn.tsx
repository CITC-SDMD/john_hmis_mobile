import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const ThemedRadioBtn = ({ label, required, options, onChangeText, selected, style, styleWidth }) => {
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
                <View style={styles.labelContainer}>
                    <Text style={styles.label}>{label}</Text>
                    {required && <Text style={{ color: 'red', marginLeft: 4 }}>*</Text>}
                </View>
            )}

            <View style={styles.row}>
                {options.map((option) => (
                    <TouchableOpacity
                        key={option.value}
                        style={[styleWidth, styles.option]}
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
    container: {
        width: "100%",
        marginBottom: 16,
    },
    label: {
        fontSize: 14,
        color: '#4A5568',
        marginBottom: 8,
        fontWeight: '600'
    },
    labelContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    row: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    option: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 10,
        marginBottom: 10,
    },
    radioOuter: {
        height: 18,
        width: 18,
        borderRadius: 9,
        borderWidth: 2,
        borderColor: '#D5DCE4',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 8,
        backgroundColor: '#fff',
    },
    radioInner: {
        height: 8,
        width: 8,
        borderRadius: 4,
        backgroundColor: '#007AFF',
    },
});
