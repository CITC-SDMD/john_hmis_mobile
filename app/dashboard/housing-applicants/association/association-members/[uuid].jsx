import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    ActivityIndicator,
    SafeAreaView,
    useColorScheme
} from "react-native";
import { useLocalSearchParams } from 'expo-router'
import { agencyMemberService } from "../../../../../components/API/AgencyMemberService";
import { Colors } from "../../../../../constants/Colors";
import ThemedView from "../../../../../components/ThemedForm/ThemedView";
import AssociationMemberList from "../../../../../components/ThemendList/ThemedAssociationMemberList";
import React, { useEffect, useState, useCallback } from 'react'

const AssociationMemberScreen = () => {
    const { uuid } = useLocalSearchParams();
    const colorScheme = useColorScheme();
    const theme = Colors[colorScheme] ?? Colors.light;

    const [members, setMembers] = useState([]);
    const [expandedId, setExpandedId] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const [errors, setErrors] = useState(null);

    useEffect(() => {
        fetchMember()
    }, [])

    const fetchMember = async () => {
        try {
            const params = {
                agency_uuid: uuid
            }
            const response = await agencyMemberService.getAgencyMembers(params)
            if (response.data) {
                setMembers(response.data)
            }
        } catch (error) {
            setErrors(error);
        }
    }

    const handleRefresh = useCallback(async () => {
        setIsRefreshing(true);
        try {
            setErrors(null);
            await fetchMember();
        } catch (error) {
            setErrors(error);
        } finally {
            setIsRefreshing(false);
        }
    }, []);

    const Loading = isLoading && members.length === 0 && !errors;
    const hasNoData = !isLoading && members.length === 0 && !errors;

    if (Loading) {
        return (
            <SafeAreaView style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={theme.primary} />
                <Text style={[styles.loadingText, { color: theme.textLight }]}>
                    Loading...
                </Text>
            </SafeAreaView>
        );
    }

    const capitalizeFirstLetter = (str) => {
        if (!str) return '';
        return str.charAt(0).toUpperCase() + str.slice(1);
    };

    const getAgencyName = () => {
        const firstAgencyMember = members.find(item => item.agency && item.agency.name);
        if (firstAgencyMember) {
            return firstAgencyMember.agency.name;
        }
        return '';
    };

    return (
        <ThemedView style={styles.container}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={[styles.title, { color: theme.textLight }]}>
                    Member List
                </Text>
                <View>
                    <Text style={[styles.agencyTitle, { color: theme.blue, textAlign: 'right' }]}>
                        {capitalizeFirstLetter(getAgencyName())}
                    </Text>
                </View>
            </View>

            {/* Error Display */}
            {errors && (
                <View style={[styles.errorContainer, { backgroundColor: theme.errorBackground || '#ffebee' }]}>
                    <Text style={[styles.errorText, { color: theme.error || '#d32f2f' }]}>
                        {errors.message}
                    </Text>
                    {errors.retry && (
                        <TouchableOpacity
                            onPress={errors.retry}
                            style={[styles.retryButton, { borderColor: theme.error || '#d32f2f' }]}
                        >
                            <Text style={[styles.retryButtonText, { color: theme.error || '#d32f2f' }]}>
                                Retry
                            </Text>
                        </TouchableOpacity>
                    )}
                </View>
            )}

            {/* Empty State */}
            {hasNoData && (
                <View style={styles.emptyContainer}>
                    <Text style={[styles.emptyText, { color: theme.textLight }]}>
                        No association member found
                    </Text>
                    <TouchableOpacity
                        onPress={handleRefresh}
                        style={[styles.refreshButton, { borderColor: theme.blue }]}
                    >
                        <Text style={[styles.refreshButtonText, { color: theme.blue }]}>
                            Refresh
                        </Text>
                    </TouchableOpacity>
                </View>
            )}

            <AssociationMemberList
                data={members}
                theme={theme}
                expandedId={expandedId}
                onToggleExpand={(uuid) => setExpandedId(expandedId === uuid ? null : uuid)}
                setIsLoading={setIsLoading}
                isLoading={isLoading}
                isRefreshing={isRefreshing}
                handleRefresh={handleRefresh}
            />
        </ThemedView>
    )
}

export default AssociationMemberScreen

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
    agencyTitle: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#2680eb",
        marginTop: 10,
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