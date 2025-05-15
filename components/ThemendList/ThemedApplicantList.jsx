import React from "react";
import {
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  View,
  Text,
  ActivityIndicator,
  Alert,
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
  const renderItem = ({ item }) => {
    const isExpanded = expandedId === item.id;
    const router = useRouter();

    return (
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
                  Reason: {item.reason || "N/A"}
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
                />
              </View>
            </View>
          )}
        </ThemedCard>
      </TouchableOpacity>
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
};

export default ApplicantList;
