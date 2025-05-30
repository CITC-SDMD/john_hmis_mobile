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
}) => {
    return (
        <View style={[styles.container, style]}>
            {label && (
                <Text style={styles.label}>
                    {label}
                    {required && <Text style={{ color: "red" }}> *</Text>}
                </Text>
            )}

            <View style={[styles.buttonWrapper, styleButton]}>
                <TouchableOpacity style={[styles.button]} onPress={onPress}>
                    {IconComponent && (
                        <View style={styles.iconWrapper}>
                            <IconComponent size={18} color="#2680eb" />
                        </View>
                    )}
                    <Text style={styles.placeholder}>{children}</Text>
                </TouchableOpacity>
            </View>
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
    buttonWrapper: {
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#2680eb",
        borderRadius: 8,
        backgroundColor: "#fff",
        paddingHorizontal: 10,
    },
    button: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 10,
        justifyContent: "flex-start",
    },
    buttonText: {
        color: "#fff",
        fontSize: 14,
        fontWeight: "bold",
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
