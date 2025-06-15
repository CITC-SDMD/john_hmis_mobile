import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, Platform } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { format } from "date-fns";

const ThemedDate = ({
    value,
    onChange,
    placeholder = "Select date",
    label,
    required = false,
    icon: IconComponent,
}) => {
    const [isPickerVisible, setPickerVisible] = useState(false);
    const [displayDate, setDisplayDate] = useState('');

    useEffect(() => {
        if (value instanceof Date) {
            const formattedDisplay = format(value, "MMMM dd, yyyy");
            setDisplayDate(formattedDisplay);
        } else {
            setDisplayDate('');
        }
    }, [value]);

    const showPicker = () => setPickerVisible(true);
    const hidePicker = () => setPickerVisible(false);

    const handleConfirm = (selectedDateFromPicker: any) => {
        onChange(selectedDateFromPicker);
        hidePicker();
    };

    return (
        <View style={styles.outerContainer}>
            {label && (
                <View style={{ flexDirection: 'row' }}>
                    <Text style={styles.label}>{label}</Text>
                    {required && <Text style={{ color: 'red', marginLeft: 4 }}>*</Text>}
                </View>
            )}

            <Pressable onPress={showPicker} style={styles.inputContainer}>
                {IconComponent && (
                    <View style={styles.iconContainer}>
                        <IconComponent size={20} color="#6B7280" />
                    </View>
                )}
                <TextInput
                    style={styles.textInput}
                    value={displayDate}
                    placeholder={placeholder}
                    placeholderTextColor="#A0AEC0"
                    editable={false}
                    pointerEvents="none"
                />
            </Pressable>

            <DateTimePickerModal
                isVisible={isPickerVisible}
                mode="date"
                date={value || new Date()}
                onConfirm={handleConfirm}
                onCancel={hidePicker}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    outerContainer: {
        marginBottom: 16,
        width: '100%'
    },
    label: {
        fontSize: 14,
        color: '#4A5568',
        marginBottom: 8,
        fontWeight: '600'
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#E2E8F0',
        borderRadius: 8,
        backgroundColor: '#fff',
        paddingHorizontal: 12,
        minHeight: 50,
    },
    iconContainer: {
        marginRight: 10
    },
    textInput: {
        flex: 1,
        padding: 10,
        fontSize: 14,
        color: "#2D3748",
    },
});

export default ThemedDate;
