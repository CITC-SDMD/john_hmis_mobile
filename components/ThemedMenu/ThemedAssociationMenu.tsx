import React from "react";
import { Text, StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
    Menu,
    MenuTrigger,
    MenuOptions,
    MenuOption,
} from "react-native-popup-menu";

const ThemeAssociationMenu = ({
    label = "Options",
    onForm = () => { },
    onSchedule = () => { },
    theme,
}) => {
    return (
        <Menu>
            <MenuTrigger>
                <View style={styles.triggerContainer}>
                    <Text
                        style={[
                            styles.menuClick,
                            {
                                backgroundColor: theme.blue,
                                color: theme.white,
                                fontSize: 11,
                            },
                        ]}
                    >
                        {label}
                    </Text>
                    <Ionicons name="ellipsis-vertical" size={23} color={theme.blue} />
                </View>
            </MenuTrigger>
            <MenuOptions
                customStyles={{
                    optionsContainer: {
                        padding: 8,
                        borderRadius: 4,
                        backgroundColor: "#fff",
                        shadowColor: "#000",
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.2,
                        shadowRadius: 4,
                        elevation: 5,
                    },
                    optionWrapper: {
                        paddingVertical: 10,
                        paddingHorizontal: 12,
                    },
                }}
            >
                <MenuOption style={styles.contentflex} onSelect={onForm}>
                    <Ionicons name="document-text-outline" color={"#2680eb"} size={20} />
                    <Text style={styles.optionText}>View form</Text>
                </MenuOption>
                <MenuOption style={styles.contentflex} onSelect={onSchedule}>
                    <Ionicons name="time-outline" color={"#2680eb"} size={20} />
                    <Text style={styles.optionText}>Set schedule</Text>
                </MenuOption>
            </MenuOptions>
        </Menu>
    );
};

const styles = StyleSheet.create({
    optionText: {
        marginLeft: 7,
        fontSize: 13,
        color: "#333",
    },
    contentflex: {
        flexDirection: "row",
    },
    triggerContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
    },
    menuClick: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 5,
        fontWeight: "600",
        textAlign: "center",
    },
});

export default ThemeAssociationMenu;
