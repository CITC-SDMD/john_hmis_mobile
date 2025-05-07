import { StyleSheet, Text } from 'react-native';
import { useColorScheme } from 'react-native';
import { Colors } from '../../../../constants/Colors';
import { applicantService } from '../../../../components/API/ApplicantService';
import ThemedView from '../../../../components/ThemedForm/ThemedView';
import ThemedTableIndividual from '../../../../components/ThemedTable/ThemedTableIndividual';
import React, {useEffect, useState } from 'react'

const IndividualScreen = () => {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme] ?? Colors.light;
  const [applicants, setApplicants] = useState([]);
  const columns = [ 
    { name: 'Full name' },
    { name: 'Phone number' },
    { name: 'Schedule' },
    { name: 'Status' },
    { name: 'Reason' },
    { name: 'View' },
  ]

  useEffect(() => {
    fetchApplicants()
  }, []);

  async function fetchApplicants() {
    try {
      const response = await applicantService.getApplicants();
      if(response.data) {
        console.log(response.data)
        setApplicants(response.data)
      }
    } catch (error) {
      console.log('Error', error) 
    }
  }

  return (
    <ThemedView  style={styles.container} safe={true} >
      <Text style={[styles.title, {color: theme.text}]}>Individual List</Text>
      <ThemedTableIndividual headers={columns} data={applicants} />
    </ThemedView>
  )
}

export default IndividualScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 20,
  }
})