import React, { useState } from "react";
import {
    SafeAreaView,
    FlatList,
    TouchableOpacity,
    View,
    Text,
    ActivityIndicator,
    Modal,
    TextInput,
    RefreshControl,
} from "react-native";
import { format } from "date-fns";
import { useRouter } from "expo-router";
import { FontAwesome6 } from "@expo/vector-icons";
import { ALERT_TYPE, Toast } from "react-native-alert-notification";
import { applicantSchedulesService } from "../../components/API/ApplicantSchedulesService";
import ThemedDateTimePicker from "../../components/ThemedForm/ThemedDateTimePicker";
import ThemeAssociationMenu from "../../components/ThemedMenu/ThemedAssociationMenu";
import ThemedLabel from "../../components/ThemedForm/ThemedLabel";
import ThemedError from "../../components/ThemedForm/ThemedError";
import ThemedCard from "../../components/ThemedForm/ThemedCard";
import ThemedButton from "../ThemedForm/ThemedSubmit";

const AssociationList = ({
    data,
    theme,
    expandedId,
    onEndReached,
    onToggleExpand,
    isLoading,
    setIsLoading,
    isRefreshing,
    handleRefresh,
    isLoadingMore,
    onDataChanged
}) => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [schedule, setSchedule] = useState(null);
    const [showPicker, setShowPicker] = useState(false);
    const [errors, setErrors] = useState({});
    const router = useRouter();

    const showPickerHnadler = () => setShowPicker(true);
    const hidePickerHnadler = () => setShowPicker(false);

    const handleDateChange = (selectDate) => {
        setSchedule(selectDate);
        hidePickerHnadler();
    };

    const handleSubmit = async () => {
        setIsLoading(true);
        setErrors({});
        try {
            const params = {
                schedule: schedule ? format(schedule, "yyyy-MM-dd HH:mm:ss") : null,
            };
            const response = await applicantSchedulesService.saveApplicantSchedules(
                selectedItem.uuid,
                params
            );
            if (response.data) {
                resetModalStates();
                onToggleExpand(null);

                if (typeof onDataChanged === "function") {
                    onDataChanged('scheduled', selectedItem.uuid);
                }

                successAlert(
                    "Create Successful",
                    "You have been successfully created a schedule",
                    ALERT_TYPE.SUCCESS
                );
            }
        } catch (error) {
            setErrors(error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCancelApplicaition = async (item) => {
        try {
            setIsLoading(true);
            const response = await applicantSchedulesService.cancelApplicantSchedules(
                item.uuid
            );
            if (response.data) {
                if (typeof onDataChanged === "function") {
                    onDataChanged('cancelled', item.uuid);
                }
                successAlert(
                    "Cancel Successful",
                    "You have been successfully cancel a application",
                    ALERT_TYPE.WARNING
                );
            }
        } catch (error) {
        } finally {
            setIsLoading(false);
        }
    };

    function successAlert(title, message, type) {
        Toast.show({
            title: title,
            textBody: message,
            type: type,
        });
    }

    const resetModalStates = () => {
        setIsModalVisible(false);
        setSchedule(null);
        setSelectedItem(null);
        setShowPicker(false);
        setErrors({});
    };

    const renderItem = ({ item }) => {
        const isExpanded = expandedId === item.id;
        return (
            <>
                <TouchableOpacity onPress={() => onToggleExpand(item.id)}>
                    <ThemedCard style={[styles.card, { backgroundColor: "#FBFDFF" }]}>
                        <View style={styles.row}>
                            <View style={styles.pic}>
                                <Text style={styles.picText}>
                                    {item.firstname[0]?.toUpperCase()}
                                    {item.lastname[0]?.toUpperCase()}
                                </Text>
                            </View>
                            <View>
                                <View style={styles.nameContainer}>
                                    <Text style={styles.nameTxt} numberOfLines={1} ellipsizeMode="tail">
                                        {item.name} {item.middlename} {item.lastname}
                                    </Text>
                                </View>
                                <View style={styles.msgContainer}>
                                    <Text style={styles.msgTxt}>{item.agency.name}</Text>
                                </View>
                            </View>
                        </View>


                        {isExpanded && (
                            <View style={styles.details}>
                                <View>
                                    <View style={styles.scheduleContainer}>
                                        <Text style={styles.labelText}>Schedule:</Text>
                                        {item.schedule ? (
                                            <View style={styles.iconFlex}>
                                                <View style={styles.iconBlue} />
                                                <Text style={styles.detailText}>
                                                    {format(new Date(item.schedule), "MMMM dd, yyyy, h:mm a")}
                                                </Text>
                                            </View>
                                        ) : (
                                            <View style={styles.iconFlex}>
                                                <View style={styles.iconPending} />
                                                <Text style={styles.pendingText}>Pending</Text>
                                            </View>
                                        )}
                                    </View>

                                    <View>
                                        {item?.application?.is_approved === true ? (
                                            <View />
                                        ) : (
                                            <View style={{ flexDirection: "row" }}>
                                                <Text style={styles.labelText}>Reason:</Text>

                                                {item.is_cancelled === true ? (
                                                    <View style={styles.iconFlex}>
                                                        <View style={styles.iconCancel} />
                                                        <Text style={styles.detailText}>
                                                            Cancel Application
                                                        </Text>
                                                    </View>
                                                ) : (
                                                    <View style={styles.iconFlex}>
                                                        <View style={styles.iconPending} />
                                                        <Text style={styles.pendingText}>Pending</Text>
                                                    </View>
                                                )}
                                            </View>
                                        )}
                                    </View>
                                </View>
                                <View>
                                    {item?.application?.is_approved === true ? (
                                        <View />
                                    ) : (
                                        <ThemeAssociationMenu
                                            theme={theme}
                                            data={item}
                                            onForm={() =>
                                                router.push(
                                                    `/dashboard/housing-applicants/association/association-members/${item?.agency.uuid}`
                                                )
                                            }
                                            onSchedule={() => {
                                                setSelectedItem(item);
                                                setIsModalVisible(true);
                                            }}
                                            onCancelApplication={() => handleCancelApplicaition(item)}
                                        />
                                    )}
                                </View>
                            </View>
                        )}
                    </ThemedCard>
                </TouchableOpacity>
            </>
        );
    };

    if (isLoading) {
        return (
            <SafeAreaView
                style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
            >
                <ActivityIndicator size="large" color={theme.primary} />
                <Text style={{ color: theme.textLight }}>Loading...</Text>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView>
            <FlatList
                data={data}
                renderItem={renderItem}
                keyExtractor={(item, index) => item.uuid ?? `fallback-${index}`}
                contentContainerStyle={{ paddingBottom: 100 }}
                onEndReached={onEndReached}
                onEndReachedThreshold={0.1}
                ListFooterComponent={
                    isLoadingMore ? (
                        <View style={styles.footer}>
                            <ActivityIndicator size="small" color={theme.primary} />
                            <Text style={[styles.footerText, { color: theme.textLight }]}>
                                Loading more...
                            </Text>
                        </View>
                    ) : null
                }
                refreshControl={
                    <RefreshControl
                        refreshing={isRefreshing}
                        onRefresh={() => handleRefresh && onDataChanged('refresh')}
                    />
                }
            />
            <Modal
                visible={isModalVisible}
                animationType="fade"
                transparent={true}
                onRequestClose={() => resetModalStates()}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalFlex}>
                            <ThemedLabel label="Add schedule" required={true} />
                            <TouchableOpacity onPress={resetModalStates}>
                                <FontAwesome6 size={20} name="xmark" color={"#2680eb"} />
                            </TouchableOpacity>
                        </View>
                        <View>
                            <TouchableOpacity onPress={showPickerHnadler}>
                                <View style={styles.inputContainer}>
                                    <FontAwesome6
                                        name="calendar"
                                        size={18}
                                        color="#2680eb"
                                        style={styles.inputIcon}
                                    />
                                    <TextInput
                                        style={styles.inputWithIcon}
                                        value={
                                            schedule ? format(schedule, "MMMM dd, yyyy, h:mm a") : ""
                                        }
                                        editable={false}
                                        pointerEvents="none"
                                        placeholder="Select date and time"
                                        placeholderTextColor="#A0AEC0"
                                    />
                                </View>
                            </TouchableOpacity>
                            <ThemedDateTimePicker
                                date={schedule || new Date()}
                                handleConfirm={handleDateChange}
                                hidePicker={hidePickerHnadler}
                                isPickerVisible={showPicker}
                            />
                            <ThemedError error={errors?.errors?.schedule?.[0]} />
                            <ThemedButton
                                title={"Submit"}
                                style={{ width: 400, marginTop: 10 }}
                                onPress={handleSubmit}
                            />
                        </View>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>

    )
}

export default AssociationList

const styles = {
    card: {
        width: "100%",
        marginVertical: 10,
        padding: 15,
        paddingLeft: 14,
        borderLeftColor: "#2680eb",
        borderLeftWidth: 4,
        borderRadius: 3,
    },
    details: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 10,
        paddingTop: 15,
        borderTopWidth: 1,
        borderTopColor: "#ccc",
    },
    detailText: {
        fontSize: 13,
        color: '#333',
        fontWeight: '500',
    },
    emptyText: {
        textAlign: "center",
        padding: 20,
        fontSize: 16,
        color: "#8A94A6",
    },
    footer: {
        paddingVertical: 20,
        alignItems: "center",
        justifyContent: "center",
    },
    footerText: {
        marginLeft: 10,
    },
    modalContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0,0,0,0.5)",
    },
    modalContent: {
        backgroundColor: "white",
        padding: 20,
        borderRadius: 8,
        elevation: 5,
        minWidth: 400,
    },
    modalFlex: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    input: {
        height: 40,
        borderColor: "#2680eb",
        borderWidth: 1,
        paddingHorizontal: 10,
        marginTop: 10,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 5,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderWidth: 1,
        borderColor: '#D5DCE4',
        borderRadius: 8,
        backgroundColor: '#fff',
        paddingHorizontal: 12,
        minHeight: 50,
        // marginBottom: 10,
    },
    inputIcon: {
        marginRight: 10,
    },
    inputWithIcon: {
        flex: 1,
        padding: 0,
        color: "#2D3748",
    },
    iconBlue: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: "#0066CC",
        marginRight: 6,
    },
    iconGreen: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: "#22c55e",
        marginRight: 6,
    },
    iconCancel: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: "#ef4444",
        marginRight: 6,

    },
    iconPending: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: '#FFA500',
        marginRight: 6,
    },
    iconFlex: {
        flexDirection: "row",
        alignItems: "center",
        marginLeft: 4,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        borderColor: '#DCDCDC',
        padding: 2,
    },
    pic: {
        borderRadius: 60,
        width: 60,
        height: 60,
        backgroundColor: '#007AFF',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
    },
    picText: {
        color: '#fff',
        fontSize: 24,
        fontWeight: 'bold',
    },
    nameContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: 280,
    },
    nameTxt: {
        marginLeft: 10,
        fontWeight: '600',
        color: '#222',
        fontSize: 15,
    },
    msgContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    msgTxt: {
        fontWeight: '500',
        color: '#0CB6F3',
        fontSize: 12,
        marginLeft: 15,
    },
    scheduleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    labelText: {
        fontWeight: '500',
        fontSize: 15,
        color: '#333',
        marginRight: 8,
    },
    iconFlex: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    pendingText: {
        fontSize: 13,
        color: 'grey',
        fontWeight: '500',
    },

};