import { StyleSheet, Text, View } from 'react-native'
import ThemedView from "../../../../../components/ThemedForm/ThemedView";
import ThemedHousehold from "../../../../../components/ThemedCensus/ThemedHousehold";
import { useLocalSearchParams, router } from "expo-router";
import React from 'react'

const household = () => {
    const { uuid } = useLocalSearchParams();


    return (
        <ThemedView style={[styles.container, { paddingHorizontal: 10 }]} safe={true}>
            <ThemedHousehold />
        </ThemedView>
    )
}

export default household

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 30,
    },
})