import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Eye, EyeOff } from "lucide-react-native";

const ThemedInputField = ({
  label,
  placeholder,
  secureTextEntry = false,
  style,
  required = false,
  editable,
  ...props
}) => {
  const [hidePassword, setHidePassword] = useState(secureTextEntry);
  const toggleSecure = () => setHidePassword((prev) => !prev);

  const showToggle = secureTextEntry;

  return (
    <View style={[styles.container, style]}>
      {label && (
        <View style={{ flexDirection: 'row' }}>
          <Text style={styles.label}>{label}</Text>
          {required && <Text style={{ color: 'red', marginLeft: 4 }}>*</Text>}
        </View>
      )}

      <View style={styles.inputWrapper}>
        <TextInput
          style={styles.input}
          keyboardType={props.keyboardType}
          placeholder={placeholder}
          placeholderTextColor="#666"
          secureTextEntry={hidePassword}
          onChangeText={props.onChangeText}
          value={props.value}
          editable={editable}
          {...props}
        />
        {showToggle && (
          <TouchableOpacity style={styles.iconWrapper} onPress={toggleSecure}>
            {hidePassword ? <EyeOff size={20} color="#2680eb" /> : <Eye size={20} color="#2680eb" />}
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default ThemedInputField;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: '#4A5568',
    marginBottom: 8,
    fontWeight: '600'
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    minHeight: 50,
  },
  input: {
    flex: 1,
    padding: 10,
    fontSize: 14,
    color: "#2D3748",
  },
  iconWrapper: {
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
});
