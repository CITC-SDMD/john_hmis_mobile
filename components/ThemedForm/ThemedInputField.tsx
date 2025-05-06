import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { Eye, EyeOff } from "lucide-react-native";

const InputField = ({
  label,
  placeholder,
  secureTextEntry = false,
  style,
  ...props
}) => {
  const [hidePassword, setHidePassword] = useState(secureTextEntry);
  const toggleSecure = () => setHidePassword((prev) => !prev);

  const showToggle = secureTextEntry;

  return (
    <View style={[styles.container, style]}>
      {label && <Text style={styles.label}>{label}</Text>}

      <View style={styles.inputWrapper}>
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor="#666"
          secureTextEntry={hidePassword}
          {...props}
        />
        {showToggle && (
          <TouchableOpacity style={styles.iconWrapper} onPress={toggleSecure}>
            {hidePassword ? <EyeOff size={20} color="#2680eb" /> : <Eye size={20} color="#2680eb"/>}
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default InputField;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginBottom: 16,
  },
  label: {
    fontWeight: "medium",
    marginBottom: 6,
    color: "#000",
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#2680eb",
    borderRadius: 8,
    backgroundColor: "#fff",
  },
  input: {
    flex: 1,
    padding: 10,
    fontSize: 14,
    color: "#000",
  },
  iconWrapper: {
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
});
