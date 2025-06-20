import {
    SafeAreaView,
    FlatList,
    TouchableOpacity,
    View,
    Text,
    ActivityIndicator,
    RefreshControl
} from "react-native";
import { format } from "date-fns";
import { useRouter } from "expo-router";
import { applicationService } from "../../components/API/ApplicationService";
import ThemedMembersMenu from "../../components/ThemedMenu/ThemedMembersMenu";
import ThemedCard from "../../components/ThemedForm/ThemedCard";
import * as FileSystem from 'expo-file-system';

const AssociationMemberList = ({
    data,
    theme,
    onFormPdf,
    expandedId,
    onEndReached,
    onToggleExpand,
    isLoading,
    isLoadingMore,
    handleRefresh,
    isRefreshing,
}) => {
    const router = useRouter();

    // const formPdf = async (value) => {
    //     try {
    //         const response = await applicationService.printApplicationFormPdf(value);
    //         console.log("Raw API Response:", response); // Add this line
    //         if (response.data) {
    //             const { file } = response.data;
    //             if (file) {
    //                 const filename = FileSystem.documentDirectory + 'application_form.pdf';
    //                 const downloadResumable = FileSystem.createDownloadResumable(
    //                     file,
    //                     filename,
    //                     {},
    //                     (downloadProgress) => {
    //                         const progress = downloadProgress.totalBytesWritten / downloadProgress.totalBytesExpectedToWrite;
    //                         console.log('Download progress:', progress);
    //                     }
    //                 );

    //                 try {
    //                     const { uri } = await downloadResumable.downloadAsync();
    //                     console.log('File downloaded to:', uri);
    //                     Alert.alert('Success', 'PDF downloaded successfully!');

    //                 } catch (downloadError) {
    //                     console.error('Download error:', downloadError);
    //                     Alert.alert('Error', 'Could not download the PDF.');
    //                 }
    //             } else {
    //                 Alert.alert('Error', 'PDF file URL not found in the API response.');
    //             }
    //         } else {
    //             Alert.alert('Error', 'Failed to fetch PDF data.');
    //         }
    //     } catch (error) {
    //         console.error('API error:', error);
    //         Alert.alert('Error', 'Failed to generate PDF.');
    //     }
    // };

    const renderItem = ({ item }) => {
        const isExpanded = expandedId === item.uuid;
        return (
            <>
                <TouchableOpacity onPress={() => onToggleExpand(item.uuid)}>
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
                                        {item.firstname.charAt(0).toUpperCase() + item.firstname.slice(1)} {item.middlename} {item.lastname}
                                    </Text>
                                    <View style={{ flexDirection: "row" }}>
                                        {item?.application?.is_approved === true ? (
                                            <View style={[styles.iconFlex, { backgroundColor: '#d1fae5', borderRadius: 8, }]}>
                                                <View style={[{ marginHorizontal: 7, marginVertical: 3 }, styles.iconFlex]}>
                                                    <View style={styles.iconGreen} />
                                                    <Text style={[styles.detailStatus]}>Approved</Text>
                                                </View>
                                            </View>
                                        ) : item?.application?.is_approved === false ? (
                                            <View style={[styles.iconFlex, { backgroundColor: '#fee2e2', borderRadius: 8, }]}>
                                                <View style={[{ marginHorizontal: 7, marginVertical: 3 }, styles.iconFlex]}>
                                                    <View style={styles.iconCancel} />
                                                    <Text style={[styles.detailStatus]}>Disapproved</Text>
                                                </View>
                                            </View>
                                        ) : (
                                            <View style={[styles.iconFlex, { backgroundColor: '#fef9c3', borderRadius: 8, }]}>
                                                <View style={[{ marginHorizontal: 7, marginVertical: 3 }, styles.iconFlex]}>
                                                    <View style={styles.iconPending} />
                                                    <Text style={[styles.detailStatus]}>Pending</Text>
                                                </View>
                                            </View>
                                        )}
                                    </View>
                                </View>
                                <View style={styles.msgContainer}>
                                    <Text style={styles.msgTxt}>{item.phone_number}</Text>
                                </View>
                            </View>
                        </View>


                        {isExpanded && (
                            <View style={styles.details}>
                                <View>
                                    <View style={styles.flexContent}>
                                        <Text style={styles.labelText}>Full Name :</Text>
                                        <Text style={styles.pendingText}> {item.firstname.charAt(0).toUpperCase() + item.firstname.slice(1)} {item.middlename} {item.lastname}</Text>
                                    </View>
                                    <View style={styles.flexContent}>
                                        <Text style={styles.labelText}>Date of birth :</Text>
                                        <Text style={styles.pendingText}>{format(item.birthdate, 'MMMM dd, yyyy')}</Text>
                                    </View>
                                    <View style={styles.flexContent}>
                                        <Text style={styles.labelText}>Gender :</Text>
                                        <Text style={styles.pendingText}>{item.gender.charAt(0).toUpperCase() + item.gender.slice(1)}</Text>
                                    </View>
                                    <View style={styles.flexContent}>
                                        <Text style={styles.labelText}>Address :</Text>
                                        <Text style={styles.pendingText}>{item.address.charAt(0).toUpperCase() + item.address.slice(1)}</Text>
                                    </View>
                                </View>
                                <View>
                                    {item?.application?.is_approved === true ? (
                                        <View />
                                    ) : (
                                        <ThemedMembersMenu
                                            theme={theme}
                                            // onFormPdf={() => formPdf(item?.uuid)}
                                            onForm={() =>
                                                router.push(
                                                    `/dashboard/housing-applicants/association/basicInformation-form/${item?.uuid}`
                                                )
                                            }
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
                keyExtractor={(item, index) => item.id ?? `fallback-${index}`}
                contentContainerStyle={{ paddingBottom: 100 }}
                onEndReached={onEndReached}
                onEndReachedThreshold={0.1}
                refreshControl={
                    <RefreshControl
                        refreshing={isRefreshing}
                        onRefresh={handleRefresh}
                    />
                }
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
            />
        </SafeAreaView>

    )
}

export default AssociationMemberList

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
    footer: {
        paddingVertical: 20,
        alignItems: "center",
        justifyContent: "center",
    },
    footerText: {
        marginLeft: 10,
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
    },
    nameTxt: {
        marginLeft: 14,
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
    Status: {
        fontWeight: '500',
        color: '#0CB6F3',
        fontSize: 12,
        marginLeft: 15,
    },
    flexContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    labelText: {
        fontWeight: '500',
        fontSize: 13,
        color: '#333',
        marginRight: 8,
    },
    pendingText: {
        fontSize: 13,
        color: 'grey',
        fontWeight: '500',
    },
    iconFlex: {
        flexDirection: "row",
        alignItems: "center",
        marginLeft: 4,
    },
    iconPending: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: '#FFA500',
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
    detailText: {
        fontSize: 13,
        color: '#333',
        fontWeight: '500',
    },
    detailStatus: {
        fontSize: 10,
        color: '#333',
        fontWeight: '600',
    }
};