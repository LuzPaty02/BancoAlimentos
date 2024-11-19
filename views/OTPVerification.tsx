import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, Alert } from 'react-native';
import auth from '@react-native-firebase/auth';

const OtpVerification = ({ route, navigation }: any) => {
  const { phone } = route.params; 
  const [code, setCode] = useState('');
  const [confirmation, setConfirmation] = useState<any | null>(null);

  // Enviar OTP
  const sendOtp = async () => {
    try {
      // Enviar el OTP al número de teléfono proporcionado
      const confirmationResult = await auth().signInWithPhoneNumber(phone);
      setConfirmation(confirmationResult); // Almacena el resultado de la confirmación
      Alert.alert('OTP Sent', 'Please check your messages for the OTP.');
    } catch (error: any) {
      console.error('Failed to send OTP:', error.message);
      Alert.alert('Error', 'Failed to send OTP. Please try again.');
    }
  };

  // Verificar OTP
  const verifyOtp = async () => {
    if (!confirmation) {
      Alert.alert('Error', 'No confirmation result found. Please send OTP again.');
      return;
    }
    try {
      // Verifica el código OTP ingresado
      await confirmation.confirm(code);
      Alert.alert('Success', 'Phone number verified successfully!');
      navigation.navigate('Main'); // Redirigir a la vista principal
    } catch (error: any) {
      console.error('Failed to verify OTP:', error.message);
      Alert.alert('Error', 'Invalid OTP. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Enter the OTP sent to {phone}</Text>
      <TextInput
        style={styles.inputField}
        placeholder="OTP"
        value={code}
        onChangeText={setCode}
        keyboardType="numeric"
      />
      <Pressable style={styles.button} onPress={sendOtp}>
        <Text style={styles.textButton}>Resend OTP</Text>
      </Pressable>
      <Pressable style={styles.button} onPress={verifyOtp}>
        <Text style={styles.textButton}>Verify OTP</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 18,
    marginBottom: 16,
  },
  inputField: {
    borderWidth: 1,
    borderRadius: 8,
    width: '80%',
    padding: 10,
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#FF8400',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginVertical: 8,
  },
  textButton: {
    color: '#FFF',
    fontSize: 16,
  },
});

export default OtpVerification;