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
} from "react-native";
import { format } from "date-fns";
import { useRouter } from "expo-router";
import { FontAwesome6 } from "@expo/vector-icons";
import { ALERT_TYPE, Toast } from "react-native-alert-notification";
import { applicantSchedulesService } from "../../components/API/ApplicantSchedulesService";
import { applicantService } from "../../components/API/ApplicantService";
import ThemedCard from "../../components/ThemedForm/ThemedCard";
import ThemedButton from "../../components/ThemedForm/ThemedButton";
import ThemedDateTimePicker from "../../components/ThemedForm/ThemedDateTimePicker";
import ThemeIndividualMenu from "../../components/ThemedMenu/ThemeIndividualMenu";
import ThemedLabel from "../../components/ThemedForm/ThemedLabel";

const ApplicantList = ({
  data,
  theme,
  expandedId,
  onEndReached,
  isLoadingMore,
  onToggleExpand,
  onDataChanged,
  isLoading,
  setIsLoading,
}) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [dateTime, setDateTime] = useState(null);
  const [showPicker, setShowPicker] = useState(false);
  const router = useRouter();

  const showPickerHnadler = () => setShowPicker(true);
  const hidePickerHnadler = () => setShowPicker(false);

  const handleDateChange = (selectDate) => {
    setDateTime(selectDate);
    hidePickerHnadler();
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const params = {
        schedule: format(dateTime, "yyyy-MM-dd HH:mm:ss"),
      };
      const response = await applicantSchedulesService.saveApplicantSchedules(
        selectedItem.uuid,
        params
      );
      if (response.data) {
        setIsModalVisible(false);
        setSelectedItem(null);
        onToggleExpand(null);
        if (typeof onDataChanged === "function") {
          onDataChanged();
        }
        successAlert(
          "Create Successful",
          "You have been successfully created a schedule",
          ALERT_TYPE.SUCCESS
        );
      }
    } catch (error) {
      console.log("error submit", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteApplication = async (item) => {
    try {
      setIsLoading(true);
      const response = await applicantService.deleteApplicant(item.uuid);
      if (response.message) {
        if (typeof onDataChanged === "function") {
          onDataChanged();
        }
        successAlert(
          "Delete Successful",
          "You have been successfully delete a application",
          ALERT_TYPE.DANGER
        );
      }
    } catch (error) {
      console.log("error delete", error);
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
          onDataChanged();
        }
        successAlert(
          "Cancel Successful",
          "You have been successfully cancel a application",
          ALERT_TYPE.WARNING
        );
      }
    } catch (error) {
      console.log("error cancel", error);
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

  const resetModalStates = () => {
    setIsModalVisible(false);
    setDateTime(null);
    setSelectedItem(null);
    setShowPicker(false);
  };

  const renderItem = ({ item }) => {
    const isExpanded = expandedId === item.id;
    return (
      <>
        <TouchableOpacity onPress={() => onToggleExpand(item.id)}>
          <ThemedCard style={[styles.card, { backgroundColor: "#FBFDFF" }]}>
            <Text style={styles.header}>
              {item.firstname} {item.middlename} {item.lastname}
            </Text>

            {isExpanded && (
              <View style={styles.details}>
                <View>
                  <Text style={styles.detailText}>
                    Phone number: {item.phone_number || "N/A"}
                  </Text>
                  <Text style={styles.detailText}>
                    Schedule:{" "}
                    {item.schedule
                      ? format(new Date(item.schedule), "MMMM dd, yyyy, h:mm a")
                      : "N/A"}
                  </Text>
                  <Text style={styles.detailText}>
                    Status: {item.status || "N/A"}
                  </Text>
                  <Text style={styles.detailText}>
                    Reason:{" "}
                    {item.is_cancelled === true ? (
                      <Text>Cancel Application</Text>
                    ) : (
                      <Text style={styles.detailText}> N/A</Text>
                    )}
                  </Text>
                </View>
                <View>
                  <ThemeIndividualMenu
                    theme={theme}
                    data={item}
                    onForm={() =>
                      router.push(
                        `/dashboard/housing-applicants/individual/application-form/${item?.uuid}`
                      )
                    }
                    onSchedule={() => {
                      setSelectedItem(item);
                      setIsModalVisible(true);
                    }}
                    onDelete={() => handleDeleteApplication(item)}
                    onCancelApplication={() => handleCancelApplicaition(item)}
                  />
                </View>
              </View>
            )}
          </ThemedCard>
        </TouchableOpacity>
      </>
    );
  };

  return (
    <SafeAreaView>
      <FlatList
        data={data}
        keyExtractor={(item) => `${item.uuid}`}
        contentContainerStyle={{ paddingBottom: 100 }}
        onEndReached={onEndReached}
        onEndReachedThreshold={0.1}
        renderItem={renderItem}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No applicants found</Text>
        }
        ListFooterComponent={
          isLoadingMore ? (
            <View style={styles.footer}>
              <ActivityIndicator size="large" color={theme.primary} />
              <Text style={[styles.footerText, { color: theme.textLight }]}>
                Loading more...
              </Text>
            </View>
          ) : null
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
              <ThemedLabel label="Add Schedule" required={true} />
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
                      dateTime ? format(dateTime, "MMMM dd, yyyy, h:mm a") : ""
                    }
                    editable={false}
                    pointerEvents="none"
                    placeholder="Select date and time"
                    placeholderTextColor="#A0AEC0"
                  />
                </View>
              </TouchableOpacity>
              <ThemedDateTimePicker
                date={dateTime || new Date()}
                handleConfirm={handleDateChange}
                hidePicker={hidePickerHnadler}
                isPickerVisible={showPicker}
              />
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
  );
};

const styles = {
  card: {
    width: "100%",
    marginVertical: 10,
    padding: 20,
    paddingLeft: 14,
    borderLeftColor: "#2680eb",
    borderLeftWidth: 4,
    borderRadius: 3,
  },
  header: {
    fontWeight: "400",
    fontSize: 12,
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
    marginVertical: 5,
    fontSize: 11,
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
    flexDirection: "row",
    alignItems: "center",
    borderColor: "#2680eb",
    borderWidth: 1,
    borderRadius: 5,
    marginTop: 10,
    paddingHorizontal: 10,
    height: 40,
  },
  inputIcon: {
    marginRight: 10,
  },
  inputWithIcon: {
    flex: 1,
    padding: 0, // Remove default padding
    color: "#2D3748",
  },
};

export default ApplicantList;
