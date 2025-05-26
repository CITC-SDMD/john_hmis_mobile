import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    Modal,
    StyleSheet,
    Button,
    TouchableWithoutFeedback
} from 'react-native';
import ThemedButton from '../../components/ThemedForm/ThemedButton'

const YourComponent = () => {
    const [modalVisible, setModalVisible] = useState(false);
    const [inputOne, setInputOne] = useState('');
    const [inputTwo, setInputTwo] = useState('');

    return (
        <View style={styles.row}>
            <View style={[styles.row, { justifyContent: 'space-between', alignItems: 'flex-start' }]}>
                <Text style={[styles.columnText]}>
                    Specific Place of Previous Residence (in chronological order):
                </Text>
                <ThemedButton
                    style={styles.buttonColumn}
                    title="Add Place"
                    onPress={() => setModalVisible(true)}
                />
            </View>

            <Modal
                visible={modalVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setModalVisible(false)}
            >
                <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
                    <View style={styles.modalOverlay}>
                        <TouchableWithoutFeedback onPress={() => { }}>
                            <View style={styles.modalContent}>
                                <Text style={styles.modalTitle}>Add place of previous residence</Text>

                                <View style={{ marginBottom: 10 }}>
                                    <Text style={styles.label}>Place</Text>
                                    <TextInput
                                        style={styles.input}
                                        value={inputOne}
                                        onChangeText={setInputOne}
                                    />
                                </View>

                                <View style={{ marginBottom: 10 }}>
                                    <Text style={styles.label}>Inclusive Date</Text>
                                    <TextInput
                                        style={styles.input}
                                        value={inputTwo}
                                        onChangeText={setInputTwo}
                                    />
                                </View>

                                <View style={[styles.buttonRow, { borderRadius: 5 }]}>
                                    <Button
                                        title="Submit"
                                        onPress={() => {
                                            console.log('Place:', inputOne);
                                            console.log('Date:', inputTwo);
                                            setModalVisible(false);
                                        }}
                                    />
                                </View>
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
        </View>
    );
};

export default YourComponent;

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        columnGap: 10,
    },
    inputHalf: {
        flex: 1,
    },
    label: {
        fontWeight: '600',
        marginBottom: 5,
    },
    input: {
        borderWidth: 1,
        borderColor: '#2680eb',
        padding: 10,
        borderRadius: 6,
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
        paddingHorizontal: 20,
    },
    modalContent: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        elevation: 5,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 15,
    },
    buttonRow: {
        // flexDirection: 'row',
        // justifyContent: 'space-between',
        borderRadius: 5,
    },
    columnText: {
        flex: 1,
        marginTop: 12,
        marginRight: 10,
    },

    buttonColumn: {
        width: 150,
        marginTop: 12,
    },

});