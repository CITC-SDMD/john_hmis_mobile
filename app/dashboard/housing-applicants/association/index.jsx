import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
  RefreshControl,
} from "react-native";
import { useColorScheme } from "react-native";
import { Colors } from "../../../../constants/Colors";
import { agencyService } from "../../../../components/API/AgenciesService";
import AssociationList from "../../../../components/ThemendList/ThemedAssociationList";
import ThemedView from "../../../../components/ThemedForm/ThemedView";
import { useEffect, useState, useRef, useCallback } from "react";

const AssociationScreen = () => {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme] ?? Colors.light;
  const [association, setAssociation] = useState([]);
  const [errors, setErrors] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    fetchAssociation();
  }, [])


  const fetchAssociation = async () => {
    try {
      const response = await agencyService.getAgencies()
      if (response.data) {
        setAssociation(response.data)
      }
    } catch (error) {
      console.log(error)
    }
  }


  if (isLoading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.primary} />
        <Text style={[styles.loadingText, { color: theme.textLight }]}>
          Loading...
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <Text style={[styles.title, { color: theme.textLight }]}>
        Association List
      </Text>

      <AssociationList
        data={association}
        theme={theme}
        expandedId={expandedId}
        onToggleExpand={(id) => setExpandedId(expandedId === id ? null : id)} />
    </ThemedView>
  )
}

export default AssociationScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
  },
  title: {
    fontSize: 17,
    fontWeight: "bold",
    marginVertical: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
  },
  tabContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  tab: {
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 3,
  },
  tabText: {
    fontSize: 13,
    padding: 3,
    fontWeight: "500",
  },
  activeTabText: {
    fontWeight: "bold",
  },
  errorContainer: {
    padding: 15,
    marginBottom: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  errorText: {
    fontSize: 14,
    textAlign: "center",
    marginBottom: 10,
  },
  retryButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderWidth: 1,
    borderRadius: 5,
  },
  retryButtonText: {
    fontSize: 14,
    fontWeight: "500",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 50,
  },
  emptyText: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
  },
  refreshButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderWidth: 1,
    borderRadius: 5,
  },
  refreshButtonText: {
    fontSize: 14,
    fontWeight: "500",
  },
})