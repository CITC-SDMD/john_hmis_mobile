import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';

const index = () => {

  const infoBoxes = [
    { label: 'Total beneficiaries', value: 0, icon: 'users' },
    { label: 'Total Individual', value: 0, icon: 'user' },
    { label: 'Total association', value: 0, icon: 'users' },
    { label: 'Total unscheduled', value: 0, icon: 'file-alt' },
    { label: 'Total current scheduled', value: 0, icon: 'file' },
  ];

  return (
    <View style={styles.container}>
      {infoBoxes.map((item, index) => (
        <View key={index} style={styles.card}>
          <Icon name={item.icon} size={24} color="#007bff" />
          <Text style={styles.label}>{item.label}</Text>
          <Text style={styles.value}>{item.value}</Text>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    padding: 10,
  },
  card: {
    width: '48%',
    backgroundColor: '#f9f9f9',
    padding: 15,
    marginVertical: 8,
    borderRadius: 10,
    elevation: 3,
  },
  label: {
    marginTop: 10,
    fontSize: 14,
    color: '#333',
  },
  value: {
    marginTop: 5,
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default index;