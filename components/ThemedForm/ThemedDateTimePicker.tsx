import { StyleSheet, View } from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import React from "react";

const ThemedDateTimePicker = ({
  isPickerVisible,
  handleConfirm,
  hidePicker,
  date,
}) => {
  return (
    <View style={styles.container}>
      <DateTimePickerModal
        style={styles.picker}
        isVisible={isPickerVisible}
        mode="datetime"
        display="spinner"
        date={date}
        onConfirm={handleConfirm}
        onCancel={hidePicker}
      />
    </View>
  );
};

export default ThemedDateTimePicker;

const styles = StyleSheet.create({
  container: {
    marginBottom: 8,
    flexDirection: "row",
    alignItems: "center",
  },
  picker: {
    width: 320,
    height: 160,
  },
});
