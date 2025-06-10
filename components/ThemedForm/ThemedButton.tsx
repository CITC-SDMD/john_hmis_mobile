import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

const ThemedButton = ({
    label,
    onPress,
    style,
    styleButton,
    required = false,
    icon: IconComponent,
    children,
    disabled = false,
}) => {
    return (
        <View style={[styles.container, style]}>
            {label && (
                <Text style={styles.label}>
                    {label}
                    {required && <Text style={{ color: "red" }}> *</Text>}
                </Text>
            )}

            <TouchableOpacity
                style={[styles.button, styleButton]}
                onPress={onPress}
                activeOpacity={0.7}
                disabled={disabled}
            >
                {IconComponent && (
                    <View style={styles.iconWrapper}>
                        <IconComponent size={18} color="#2680eb" />
                    </View>
                )}
                <Text style={styles.placeholder}>{children}</Text>
            </TouchableOpacity>
        </View>
    );
};

export default ThemedButton;

const styles = StyleSheet.create({
    container: {
        marginBottom: 16,
    },
    label: {
        fontSize: 14,
        fontWeight: "500",
        color: "#2D3748",
        marginBottom: 5,
    },
    button: {
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#2680eb",
        borderRadius: 4,
        paddingVertical: 10,
        paddingHorizontal: 12,
    },
    placeholder: {
        color: "#fff",
        fontSize: 14,
        fontWeight: "500",
    },
    iconWrapper: {
        marginRight: 10,
    },
});
