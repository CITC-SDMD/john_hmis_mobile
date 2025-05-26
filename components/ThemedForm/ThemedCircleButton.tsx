import { TouchableOpacity, StyleSheet } from 'react-native';
import { Plus } from "lucide-react-native"; 


const SimpleCircleButton = ({size = 50, onPress, color = "#fff", backgroundColor = "#007bff" }) => {
  return (
    <TouchableOpacity
      style={[styles.button, { width: size, height: size, borderRadius: size / 2, backgroundColor }]}
      onPress={onPress}
    >
      <Plus size={size * 0.5} color={color} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000', 
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 2,
    position: 'absolute',
    bottom: 20,
    right: 20,
  },
});

export default SimpleCircleButton;