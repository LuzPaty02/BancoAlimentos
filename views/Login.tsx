import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet, Dimensions, Pressable } from 'react-native';
import { signInWithEmailAndPassword, signInWithPhoneNumber, ConfirmationResult, RecaptchaVerifier } from 'firebase/auth';
import { useNavigation } from '@react-navigation/native';
import { auth, db } from './Authentication';
import { doc, getDoc } from 'firebase/firestore';

const screenHeight = Dimensions.get('window').height;
const RPH = (percentage: number) => (percentage / 100) * screenHeight;

const screenWidth = Dimensions.get('window').width;
const RPW = (percentage: number) => (percentage / 100) * screenWidth;

// Extiende la interfaz global para incluir recaptchaVerifier
declare global {
  interface Window {
    recaptchaVerifier: RecaptchaVerifier | null;
  }
}

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [code, setCode] = useState('');
  const [confirmation, setConfirmation] = useState<ConfirmationResult | null>(null);
  const [error, setError] = useState('');
  const navigation = useNavigation();

  const handleLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const userId = userCredential.user.uid;

      const userDoc = await getDoc(doc(db, 'users', userId));
      const userType = userDoc.data()?.accountType;

      // Navegar según el tipo de usuario
      switch (userType) {
        case 'regular donor':
          navigation.navigate('/regular-donor-dashboard');
          break;
        case 'donor company':
          navigation.navigate('/company-dashboard');
          break;
        case 'food bank staff':
          navigation.navigate('Maps');
          break;
        default:
          setError('Unknown account type');
          break;
      }
    } catch (err) {
      setError('Failed to log in');
      console.error(err);
    }
  };

  const handleSendCode = async () => {
    try {
      if (!phoneNumber || phoneNumber.length < 10) {
        setError('Please enter a valid phone number.');
        return;
      }

      // Inicializar reCAPTCHA si no existe
      if (!window.recaptchaVerifier) {
        window.recaptchaVerifier = new RecaptchaVerifier(
          'send-code-button',
          {
            size: 'invisible',
            callback: (response: any) => {
              console.log('reCAPTCHA solved:', response);
            },
          },
          auth
        );
      }

      const appVerifier = window.recaptchaVerifier;

      // Enviar código de verificación
      const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
      setConfirmation(confirmationResult);
      setError('');
      console.log('Verification code sent successfully.');
    } catch (error) {
      console.error('Error sending verification code:', error);
      setError('Failed to send verification code. Please try again.');
    }
  };

  const handleVerifyCode = async () => {
    if (!confirmation) {
      setError('No confirmation result found.');
      return;
    }

    try {
      const userCredential = await confirmation.confirm(code);
      console.log('Phone number verified:', userCredential.user);
    } catch (error) {
      setError('Invalid verification code. Please try again.');
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.box}>
        {/* Login con email */}
        <View style={styles.group}>
          <Text style={styles.switchText}>Email</Text>
          <TextInput
            style={styles.inputField}
            keyboardType="email-address"
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
          />
        </View>
        <View style={styles.group}>
          <Text style={styles.switchText}>Password</Text>
          <TextInput
            style={styles.inputField}
            placeholder="Password"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
        </View>
        <Pressable style={styles.button} onPress={handleLogin}>
          <Text style={styles.textButton}>Login</Text>
        </Pressable>

        {/* Login con teléfono */}
        <View style={styles.group}>
          <Text style={styles.switchText}>Phone Number</Text>
          <TextInput
            style={styles.inputField}
            placeholder="Enter phone number"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
          />
        </View>
        {confirmation && (
          <View style={styles.group}>
            <Text style={styles.switchText}>Verification Code</Text>
            <TextInput
              style={styles.inputField}
              placeholder="Enter verification code"
              value={code}
              onChangeText={setCode}
            />
          </View>
        )}
        <Pressable
          style={styles.button}
          onPress={!confirmation ? handleSendCode : handleVerifyCode}
        >
          <Text style={styles.textButton}>
            {!confirmation ? 'Send Code' : 'Verify Code'}
          </Text>
        </Pressable>

        {error && <Text style={styles.errorText}>{error}</Text>}
      </View>

      {/* Invisible button para reCAPTCHA */}
      <Pressable id="send-code-button" style={{ display: 'none' }} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'left',
    flex: 1,
    fontFamily: 'Roboto',
  },
  box: {
    textAlign: 'left',
    borderColor: '#D9D9D9',
    borderWidth: 2,
    borderRadius: 8,
    padding: 24,
    gap: 24,
  },
  group: {
    marginBottom: 20,
  },
  inputField: {
    padding: 10,
    borderWidth: 0.5,
    borderRadius: 5,
    paddingHorizontal: 16,
    paddingVertical: 8,
    width: RPW(60),
    borderColor: 'grey',
    lineHeight: 16,
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    width: RPW(60),
    backgroundColor: '#FF8400',
    borderRadius: 8,
    paddingVertical: 10,
  },
  textButton: {
    color: 'white',
  },
  switchText: {
    width: RPW(40),
    textAlign: 'left',
    fontSize: 16,
  },
  errorText: {
    color: 'red',
    marginTop: 10,
  },
});

export default Login;