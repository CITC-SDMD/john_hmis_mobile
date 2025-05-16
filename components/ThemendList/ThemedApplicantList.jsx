import React, { useState } from "react";
import {
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  View,
  Text,
  ActivityIndicator,
  Modal,
} from "react-native";
import { format } from "date-fns";
import { useRouter } from "expo-router";
import ThemedCard from "../../components/ThemedForm/ThemedCard";
import ThemeIndividualMenu from "../../components/ThemedMenu/ThemeIndividualMenu";

const ApplicantList = ({
  data,
  theme,
  expandedId,
  onEndReached,
  isLoadingMore,
  onToggleExpand,
}) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const router = useRouter();
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
                      <View
                        style={{
                          backgroundColor: "#2680eb",
                          paddingLeft: 10,
                          paddingRight: 10,
                          borderRadius: 10,
                          alignItems: "center",
                        }}
                      >
                        <Text style={[styles.detailText, { color: "white" }]}>
                          {" "}
                          N/A
                        </Text>
                      </View>
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
        keyExtractor={(item, index) => `${item.id}-${index}`}
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
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {selectedItem && <Text>{selectedItem.uuid}</Text>}
            <TouchableOpacity onPress={() => setIsModalVisible(false)}>
              <Text>Close</Text>
            </TouchableOpacity>
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
    minWidth: 300,
  },
};

export default ApplicantList;
