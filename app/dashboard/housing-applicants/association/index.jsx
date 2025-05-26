import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  ActivityIndicator,
  SafeAreaView,
} from "react-native";
import { useRouter } from "expo-router";
import { useColorScheme } from "react-native";
import { Colors } from "../../../../constants/Colors";
import { applicantService } from "../../../../components/API/ApplicantService";
import ThemedView from "../../../../components/ThemedForm/ThemedView";
import React, { useEffect, useState } from "react";
import ThemedAssociationList from "../../../../components/ThemendList/ThemedAssociationList";
import { agencyMemberService } from "../../../../components/API/AgencyMemberService";
import { agencyService } from "../../../../components/API/AgencyService";
import ThemedTableForm from "../../../../components/ThemedTable/ThemedTableForm";

const AssociationScreen = () => {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme] ?? Colors.light;
  const router = useRouter();
  const headers = ['President name'];

  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [expandedId, setExpandedId] = useState(null);
  const [agency, setAgency] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchData(1);
  }, []);

  const fetchData = async (page = 1) => {
    try {
      page === 1 ? setIsLoading(true) : setIsLoadingMore(true);
      const params = { page };
      const response = await agencyService.getAgencies(params);

      if (response.data) {
        setAgency(prev =>
          page === 1 ? response.data : [...prev, ...response.data]
        );
        setTotalPages(response.meta?.last_page || 1);
        setCurrentPage(page);
      }
    } catch (error) {
      console.error("Fetch Error:", error);
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  };

  const loadMoreData = () => {
    const nextPage = currentPage + 1;
    if (!isLoadingMore && nextPage <= totalPages) {
      fetchData(nextPage);
    }
  };

  if (isLoading && agency.length === 0) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.primary} />
        <Text style={{ color: theme.textLight }}>Loading...</Text>
      </SafeAreaView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <Text style={[styles.title, { color: theme.textLight }]}>
        Association List
      </Text>
      <ThemedTableForm headers={headers} />

      {/* <View style={styles.tabContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {tabs.map((tab) => (
            <TouchableOpacity
              key={tab.id}
              onPress={() => handleTabChange(tab.id)}
              style={[
                styles.tab,
                {
                  borderBottomColor:
                    activeTab === tab.id ? theme.blue : theme.border,
                  backgroundColor:
                    activeTab === tab.id ? theme.white : theme.backgroundColor,
                  width: widthTab,
                },
              ]}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === tab.id && styles.activeTabText,
                  { color: activeTab === tab.id ? theme.blue : theme.text },
                ]}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View> */}

      <ThemedAssociationList
        data={agency}
        theme={theme}
        expandedId={expandedId}
        onEndReached={loadMoreData}
        isLoadingMore={isLoadingMore}
        onToggleExpand={(id) => setExpandedId(expandedId === id ? null : id)}
      />
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 17,
    fontWeight: "bold",
    marginVertical: 10,
  },
  tabContainer: {
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
  header: {
    fontWeight: "400",
    fontSize: 12,
  },
  card: {
    width: "100%",
    marginVertical: 10,
    padding: 20,
    paddingLeft: 14,
    borderLeftColor: "#2680eb",
    borderLeftWidth: 4,
    borderRadius: 3,
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
  menuClick: {
    padding: 10,
  },
});

export default AssociationScreen;



// import { StyleSheet, Text, View } from 'react-native'
// import React from 'react'
// import { Link } from 'expo-router'

// const AssociationScreen = () => {
//   return (
//     <View>
//       <Text>association</Text>
//       <Link href={'/forms/association-form'}>
//         {/* <Link href={`/forms/application-form/uuid/${item?.uuid}`}> */}
//         <Text style={{ textAlign: 'center' }}>
//           Registration Form</Text>
//       </Link>
//     </View>


//   )
// }

// export default AssociationScreen

// const styles = StyleSheet.create({})