import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

const ThemedTableForm = ({ headers = [], data = [] }) => {
    return (
        <View style={styles.container}>
            <View style={styles.headerRow}>
                {headers.map((header, index) => (
                    <Text key={index} style={styles.headerCell}>
                        {header}
                    </Text>
                ))}
            </View>
            <ScrollView>
                {data.map((row, rowIndex) => (
                    <View key={rowIndex} style={styles.dataRow}>
                        {headers.map((_, colIndex) => (
                            <Text key={colIndex} style={styles.dataCell}>
                                {row[colIndex]}
                            </Text>
                        ))}
                    </View>
                ))}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginTop: 10,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 6,
        overflow: 'hidden',
    },
    headerRow: {
        flexDirection: 'row',
        backgroundColor: '#f2f2f2',
        paddingVertical: 10,
        paddingHorizontal: 12,
        borderBottomWidth: 1,
        borderColor: '#ccc',
    },
    headerCell: {
        flex: 1,
        fontWeight: 'bold',
        color: '#333',
    },
    dataRow: {
        flexDirection: 'row',
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderBottomWidth: 1,
        borderColor: '#eee',
    },
    dataCell: {
        flex: 1,
        color: '#444',
    },
});

export default ThemedTableForm;