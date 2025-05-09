import React from 'react';
import { View, TouchableOpacity, StyleSheet, Text } from 'react-native';
import Dots from 'react-native-dots-pagination';

const PaginationControl = ({ 
  currentPage, 
  totalPages, 
  onPageChange,
  activeColor = '#007AFF', 
  passiveColor = '#D1D1D6'
}) => {
  // Handles moving to the next page if not at the end
  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  // Handles moving to the previous page if not at the beginning
  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  // Determine if next/prev buttons should be disabled
  const isPreviousDisabled = currentPage <= 1;
  const isNextDisabled = currentPage >= totalPages;

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        onPress={handlePrevious}
        disabled={isPreviousDisabled}
        style={[styles.button, isPreviousDisabled && styles.disabledButton]}
      >
        <Text style={[styles.buttonText, isPreviousDisabled && styles.disabledText]}>
          Previous
        </Text>
      </TouchableOpacity>
      
      <Dots 
        length={totalPages}
        active={currentPage - 1} // Dots component uses 0-based index
        activeColor={activeColor}
        passiveColor={passiveColor}
        activeDotWidth={10}
        activeDotHeight={10}
        passiveDotWidth={8}
        passiveDotHeight={8}
      />
      
      <TouchableOpacity 
        onPress={handleNext}
        disabled={isNextDisabled}
        style={[styles.button, isNextDisabled && styles.disabledButton]}
      >
        <Text style={[styles.buttonText, isNextDisabled && styles.disabledText]}>
          Next
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 8,
  },
  button: {
    padding: 8,
  },
  buttonText: {
    color: '#007AFF',
    fontWeight: '600',
  },
  disabledButton: {
    opacity: 0.5,
  },
  disabledText: {
    color: '#8E8E93',
  }
});

export default PaginationControl;