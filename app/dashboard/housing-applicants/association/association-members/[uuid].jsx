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
import { Colors } from "../../../../../constants/Colors";
import ThemedView from "../../../../../components/ThemedForm/ThemedView";
import React, { useEffect, useState } from "react";
import ThemedAssociationList from "../../../../../components/ThemendList/ThemedAssociationList";
import { agencyService } from "../../../../../components/API/AgencyService";
import { agencyMemberService } from "../../../../../components/API/AgencyMemberService";
import ThemedTableForm from "../../../../../components/ThemedTable/ThemedTableForm";
import ThemedMembersList from "../../../../../components/ThemendList/ThemedMembersList";
import { useLocalSearchParams } from "expo-router";


const AssociationMembers = () => {
    const colorScheme = useColorScheme();
    const theme = Colors[colorScheme] ?? Colors.light;
    // const router = useRouter();
    const { uuid } = useLocalSearchParams();

    const [expandedId, setExpandedId] = useState(null);
    const [members, setMembers] = useState([]);

    console.log("AGENCY UUID:", uuid);
    useEffect(() => {
        fetchMembers();
    }, []);

    const fetchMembers = async () => {
        try {
            const params = {
                agency_uuid: uuid
            }

            const response = await agencyMemberService.getAgencyMembers(params);

            if (response.data) {
                setMembers(response.data);
            }
        } catch (error) {
            console.error("Error fetching agency members:", error);
            if (error.response) {
                console.error("Response data:", error.response.data);
                console.error("Status code:", error.response.status);
            }
        }
    };


    // const loadMoreData = () => {
    //     const nextPage = currentPage + 1;
    //     if (!isLoadingMore && nextPage <= totalPages) {
    //         fetchData(nextPage);
    //     }
    // };

    // if (isLoading && members.length === 0) {
    //     return (
    //         <SafeAreaView style={styles.loadingContainer}>
    //             <ActivityIndicator size="large" color={theme.primary} />
    //             <Text style={{ color: theme.textLight }}>Loading...</Text>
    //         </SafeAreaView>
    //     );
    // }

    return (
        <ThemedView style={styles.container}>
            <Text style={[styles.title, { color: theme.textLight }]}>
                Members List
            </Text>

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

            <ThemedMembersList
                data={members}
                theme={theme}
                expandedId={expandedId}
                // onEndReached={loadMoreData}
                // isLoadingMore={isLoadingMore}
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

export default AssociationMembers;



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

// import {
//     StyleSheet,
//     Text,
//     View,
//     ActivityIndicator,
//     SafeAreaView,
// } from "react-native";
// import { useColorScheme } from "react-native";
// import { useRouter, useLocalSearchParams } from "expo-router";
// import React, { useEffect, useState } from "react";
// import { Colors } from "../../../../../constants/Colors";
// import { agencyMemberService } from "../../../../../components/API/AgencyMemberService";
// import ThemedView from "../../../../../components/ThemedForm/ThemedView";
// import ThemedMembersList from "../../../../../components/ThemendList/ThemedMembersList";

// const AssociationMembers = () => {
//     const { uuid } = useLocalSearchParams();
//     const colorScheme = useColorScheme();
//     const theme = Colors[colorScheme] ?? Colors.light;
//     const router = useRouter();

//     const [isLoading, setIsLoading] = useState(false);
//     const [isLoadingMore, setIsLoadingMore] = useState(false);
//     const [expandedId, setExpandedId] = useState(null);
//     const [members, setMembers] = useState([]);
//     const [currentPage, setCurrentPage] = useState(1);
//     const [totalPages, setTotalPages] = useState(1);

//     useEffect(() => {
//         if (uuid) {
//             fetchData(1);
//         }
//     }, [uuid]);

//     const fetchData = async (page = 1) => {
//         try {
//             console.log("Fetching members for agency_uuid:", uuid);

//             const params = {
//                 agency_uuid: uuid,
//             };

//             const response = await agencyMemberService.getAgencyMembers(params);
//             console.log("API response:", response);

//             if (response?.data) {
//                 setMembers(prev =>
//                     page === 1 ? response.data : [...prev, ...response.data]
//                 );
//                 setTotalPages(response.meta?.last_page || 1);
//                 setCurrentPage(page);
//             }
//         } catch (error) {
//             console.error("Fetch Error:", error);
//         } finally {
//             setIsLoading(false);
//             setIsLoadingMore(false);
//         }
//     };

//     const loadMoreData = () => {
//         const nextPage = currentPage + 1;
//         if (!isLoadingMore && nextPage <= totalPages) {
//             fetchData(nextPage);
//         }
//     };

//     if (isLoading && members.length === 0) {
//         return (
//             <SafeAreaView style={styles.loadingContainer}>
//                 <ActivityIndicator size="large" color={theme.primary} />
//                 <Text style={{ color: theme.textLight }}>Loading...</Text>
//             </SafeAreaView>
//         );
//     }

//     return (
//         <ThemedView style={styles.container}>
//             <Text style={[styles.title, { color: theme.textLight }]}>
//                 Members for Agency: {uuid}
//             </Text>

//             <ThemedMembersList
//                 data={members}
//                 theme={theme}
//                 expandedId={expandedId}
//                 onEndReached={loadMoreData}
//                 isLoadingMore={isLoadingMore}
//                 onToggleExpand={(id) =>
//                     setExpandedId(expandedId === id ? null : id)
//                 }
//             />
//         </ThemedView>
//     );
// };

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         padding: 20,
//     },
//     loadingContainer: {
//         flex: 1,
//         justifyContent: "center",
//         alignItems: "center",
//     },
//     title: {
//         fontSize: 17,
//         fontWeight: "bold",
//         marginVertical: 10,
//     },
// });

// export default AssociationMembers;



// // import {
// //     StyleSheet,
// //     Text,
// //     View,
// //     TouchableOpacity,
// //     ScrollView,
// //     Dimensions,
// //     ActivityIndicator,
// //     SafeAreaView,
// // } from "react-native";
// // import { useRouter } from "expo-router";
// // import { useColorScheme } from "react-native";
// // import { Colors } from "../../../../../constants/Colors";
// // import { applicantService } from "../../../../../components/API/ApplicantService";
// // import ThemedView from "../../../../../components/ThemedForm/ThemedView";
// // import React, { useEffect, useState } from "react";
// // import { agencyMemberService } from "../../../../../components/API/AgencyMemberService";
// // import ThemedTableForm from "../../../../../components/ThemedTable/ThemedTableForm";
// // import ThemedMembersList from "../../../../../components/ThemendList/ThemedMembersList";

// // const AssociationMembers = () => {
// //     const colorScheme = useColorScheme();
// //     const theme = Colors[colorScheme] ?? Colors.light;
// //     const router = useRouter();

// //     const [isLoading, setIsLoading] = useState(false);
// //     const [isLoadingMore, setIsLoadingMore] = useState(false);
// //     const [expandedId, setExpandedId] = useState(null);
// //     const [members, setMembers] = useState([]);
// //     const [currentPage, setCurrentPage] = useState(1);
// //     const [totalPages, setTotalPages] = useState(1);

// //     useEffect(() => {
// //         fetchData(1);
// //     }, []);

// //     const fetchData = async (page = 1) => {
// //         try {
// //             page === 1 ? setIsLoading(true) : setIsLoadingMore(true);
// //             const params = { page };
// //             const response = await agencyMemberService.getAgencyMembers(params);

// //             if (response.data) {
// //                 setMembers(prev =>
// //                     page === 1 ? response.data : [...prev, ...response.data]
// //                 );
// //                 setTotalPages(response.meta?.last_page || 1);
// //                 setCurrentPage(page);
// //             }
// //         } catch (error) {
// //             console.error("Fetch Error:", error);
// //         } finally {
// //             setIsLoading(false);
// //             setIsLoadingMore(false);
// //         }
// //     };

// //     const loadMoreData = () => {
// //         const nextPage = currentPage + 1;
// //         if (!isLoadingMore && nextPage <= totalPages) {
// //             fetchData(nextPage);
// //         }
// //     };

// //     if (isLoading && members.length === 0) {
// //         return (
// //             <SafeAreaView style={styles.loadingContainer}>
// //                 <ActivityIndicator size="large" color={theme.primary} />
// //                 <Text style={{ color: theme.textLight }}>Loading...</Text>
// //             </SafeAreaView>
// //         );
// //     }

// //     return (
// //         <ThemedView style={styles.container}>
// //             <Text style={[styles.title, { color: theme.textLight }]}>
// //                 Member List
// //             </Text>

// //             {/* <View style={styles.tabContainer}>
// //         <ScrollView horizontal showsHorizontalScrollIndicator={false}>
// //           {tabs.map((tab) => (
// //             <TouchableOpacity
// //               key={tab.id}
// //               onPress={() => handleTabChange(tab.id)}
// //               style={[
// //                 styles.tab,
// //                 {
// //                   borderBottomColor:
// //                     activeTab === tab.id ? theme.blue : theme.border,
// //                   backgroundColor:
// //                     activeTab === tab.id ? theme.white : theme.backgroundColor,
// //                   width: widthTab,
// //                 },
// //               ]}
// //             >
// //               <Text
// //                 style={[
// //                   styles.tabText,
// //                   activeTab === tab.id && styles.activeTabText,
// //                   { color: activeTab === tab.id ? theme.blue : theme.text },
// //                 ]}
// //               >
// //                 {tab.label}
// //               </Text>
// //             </TouchableOpacity>
// //           ))}
// //         </ScrollView>
// //       </View> */}

// //             <ThemedMembersList
// //                 data={members}
// //                 theme={theme}
// //                 expandedId={expandedId}
// //                 onEndReached={loadMoreData}
// //                 isLoadingMore={isLoadingMore}
// //                 onToggleExpand={(id) => setExpandedId(expandedId === id ? null : id)}
// //             />
// //         </ThemedView>
// //     );
// // };

// // const styles = StyleSheet.create({
// //     container: {
// //         flex: 1,
// //         padding: 20,
// //     },
// //     loadingContainer: {
// //         flex: 1,
// //         justifyContent: "center",
// //         alignItems: "center",
// //     },
// //     title: {
// //         fontSize: 17,
// //         fontWeight: "bold",
// //         marginVertical: 10,
// //     },
// //     tabContainer: {
// //         alignItems: "center",
// //         marginBottom: 15,
// //     },
// //     tab: {
// //         alignItems: "center",
// //         paddingVertical: 10,
// //         borderBottomWidth: 3,
// //     },
// //     tabText: {
// //         fontSize: 13,
// //         padding: 3,
// //         fontWeight: "500",
// //     },
// //     activeTabText: {
// //         fontWeight: "bold",
// //     },
// //     header: {
// //         fontWeight: "400",
// //         fontSize: 12,
// //     },
// //     card: {
// //         width: "100%",
// //         marginVertical: 10,
// //         padding: 20,
// //         paddingLeft: 14,
// //         borderLeftColor: "#2680eb",
// //         borderLeftWidth: 4,
// //         borderRadius: 3,
// //     },
// //     emptyText: {
// //         textAlign: "center",
// //         padding: 20,
// //         fontSize: 16,
// //         color: "#8A94A6",
// //     },
// //     footer: {
// //         paddingVertical: 20,
// //         alignItems: "center",
// //         justifyContent: "center",
// //     },
// //     footerText: {
// //         marginLeft: 10,
// //     },
// //     details: {
// //         flexDirection: "row",
// //         justifyContent: "space-between",
// //         marginTop: 10,
// //         paddingTop: 15,
// //         borderTopWidth: 1,
// //         borderTopColor: "#ccc",
// //     },
// //     detailText: {
// //         marginVertical: 5,
// //         fontSize: 11,
// //     },
// //     menuClick: {
// //         padding: 10,
// //     },
// // });

// // export default AssociationMembers;
