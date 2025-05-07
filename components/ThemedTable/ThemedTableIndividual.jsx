import React from 'react';
import { Colors } from '../../constants/Colors';
import { useColorScheme } from 'react-native';
import { View, Text, ScrollView, StyleSheet, Dimensions } from 'react-native';

const ThemedTableIndividual = ({  headers = [], data = [] }) => {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme] ?? Colors.light;
  const screenWidth = Dimensions.get("window").width;
  const cellWidth = screenWidth / 2;

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={true}>
      <View>
        {/* Header Row */}
        <View style={styles.row}>
          {headers.map((header, index) => (
            <Text key={index} style={[styles.cell, styles.headerCell, {width: cellWidth, backgroundColor: theme.backgroundColor}]}>
              {header.name}
            </Text>
          ))}
        </View>

        {/* Data Rows */}
        {data.map((row, rowIndex) => (
          <View key={rowIndex} style={styles.row}>
            <Text style={[styles.cell, {width: cellWidth}]}>{row.firstname + " " + row.middlename + " " + row.lastname}</Text>
            <Text style={[styles.cell, {width: cellWidth}]}>{row.phone_number}</Text>
            <Text style={[styles.cell, {width: cellWidth}]}>{row.schedule ?? 'N/A'}</Text>
            <Text style={[styles.cell, {width: cellWidth}]}>{row.schedule ?? 'N/A'}</Text>


          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
  },
  cell: {
    padding: 10,
    borderWidth: 0.5,
    borderColor: '#ccc',
  },
  headerCell: {
    fontWeight: 'bold',
  },
});

export default ThemedTableIndividual;
