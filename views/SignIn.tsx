import React, { useState, useContext } from 'react';
import Checkbox from 'expo-checkbox';
import { View, TextInput, Text, StyleSheet, Dimensions, Pressable } from 'react-native';
import { createUserWithEmailAndPassword, signInWithPhoneNumber, ConfirmationResult, RecaptchaVerifier } from 'firebase/auth';
import { useNavigation } from '@react-navigation/native';
import { auth, AuthContext, db } from './Authentication';
import { doc, GeoPoint, setDoc } from 'firebase/firestore';

const screenHeight = Dimensions.get('window').height;
const RPH = (percentage: number) => (percentage / 100) * screenHeight;

const screenWidth = Dimensions.get('window').width;
const RPW = (percentage: number) => (percentage / 100) * screenWidth;

// Extend the Window interface to include recaptchaVerifier
declare global {
  interface Window {
    recaptchaVerifier: RecaptchaVerifier | null; // Allow it to be null initially
  }
}

const SignInView: React.FC = () => {
  const navigation = useNavigation();
  const authContext = useContext(AuthContext);

  if (!authContext) {
    throw new Error("AuthContext is null");
  }

  const { auth } = authContext;

  const [email, setEmail] = useState("");
  const [nombre, setNombre] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [isCompany, setIsCompany] = useState(false);
  const [isBAMX, setIsBAMX] = useState(false);
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  const [verificationCode, setVerificationCode] = useState("");
  const [error, setError] = useState("");


  const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  const handleSendCode = async () => {
    setError('');

    if (!nombre.trim()) {
      setError('Please enter your name.');
      return;
    }

    if (!email.trim()) {
      setError('Please enter a valid email.');
      return;
    }

    if (!passwordRegex.test(password)) {
      setError(
        'Password must be at least 8 characters long, include one uppercase letter, one lowercase letter, one number, and one special character.'
      );
      return;
    }

    if (!phone || phone.length < 10 || !/^\+?\d{10,15}$/.test(phone)) {
      setError('Please enter a valid phone number in international format.');
      return;
    }

    try {
      // Initialize reCAPTCHA if it doesn't exist
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

      // Send verification code
      const confirmation = await signInWithPhoneNumber(auth, phone, appVerifier);
      setConfirmationResult(confirmation);
      console.log('Verification code sent successfully.');
    } catch (error) {
      console.error('Error sending verification code:', error);
      setError('Failed to send verification code. Please try again.');
    }
  };

  const handleVerifyCode = async () => {
    if (!confirmationResult) {
      setError('No confirmation result found.');
      return;
    }

    try {
      await confirmationResult.confirm(verificationCode);
      console.log('Phone authentication successful');
      await handleSignUp();
    } catch (error) {
      console.error('Error verifying code:', error);
      setError('Invalid verification code. Please try again.');
    }
  };

  const handleSignUp = async () => {
    if (!passwordRegex.test(password)) {
      setError(
        'Password must be at least 8 characters long, include one uppercase letter, one lowercase letter, one number, and one special character.'
      );
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const userId = userCredential.user.uid;

      const accountType = isBAMX ? 'food bank staff' : isCompany ? 'donor company' : 'regular donor';

      const userData: {
        email: string;
        nombre: string;
        phone: string;
        accountType: string;
        ubicacion?: GeoPoint; // Use GeoPoint for location
        uid?: string;
      } = {
        email,
        nombre,
        phone,
        accountType,
      };

      if (accountType === 'donor company') {
        userData.ubicacion = new GeoPoint(0, 0); // Default location [0° N, 0° E]
      }

      if (accountType === 'food bank staff') {
        userData.uid = userId; // Add UID for food bank staff
      }

      await setDoc(doc(db, 'users', userId), userData);

      console.log("User signed up with account type: " + accountType);
    } catch (error: any) {
      console.error('Error signing up:', error);
      setError(error.message || 'Error signing up. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.box}>
        <View style={styles.group}>
          <Text style={styles.switchText}>Name</Text>
          <TextInput
            style={styles.inputField}
            placeholder="Your Name"
            value={nombre}
            onChangeText={setNombre}
          />
        </View>
        <View style={styles.group}>
          <Text style={styles.switchText}>Phone Number</Text>
          <TextInput
            style={styles.inputField}
            placeholder="+521234567890"
            value={phone}
            onChangeText={setPhone}
          />
          <Pressable
            style={[
              styles.button,
              (!phone || phone.length < 10) && styles.disabledButton,
            ]}
            onPress={phone && phone.length >= 10 ? handleSendCode : undefined}
          >
            <Text style={styles.textButton}>Send Verification Code</Text>
          </Pressable>
        </View>
        {confirmationResult && (
          <View style={styles.group}>
            <Text style={styles.switchText}>Enter Verification Code</Text>
            <TextInput
              style={styles.inputField}
              placeholder="Verification Code"
              value={verificationCode}
              onChangeText={setVerificationCode}
            />
            <Pressable style={styles.button} onPress={handleVerifyCode}>
              <Text style={styles.textButton}>Verify Code</Text>
            </Pressable>
          </View>
        )}
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
            secureTextEntry={true}
            value={password}
            onChangeText={setPassword}
          />
        </View>
        <View>
          <Text style={styles.noteText}>
            Password must be at least 8 characters long, include one uppercase letter, one lowercase letter, one number, and one special character.
          </Text>
        </View>
        <View style={styles.group}>
          <View style={styles.section}>
            <Checkbox
              style={styles.checkbox}
              color={'black'}
              value={isCompany}
              onValueChange={setIsCompany}
            />
            <Text style={styles.switchText}>Register as a company account</Text>
          </View>
        </View>
        <View style={styles.group}>
          <View style={styles.section}>
            <Checkbox
              style={styles.checkbox}
              color={'black'}
              value={isBAMX}
              onValueChange={setIsBAMX}
            />
            <Text style={styles.switchText}>Register as a BAMX account</Text>
          </View>
        </View>
        {confirmationResult && (
          <View>
            <Pressable style={styles.button} onPress={handleSignUp}>
              <Text style={styles.textButton}>Register</Text>
            </Pressable>
          </View>
        )}
        {error && <Text style={styles.errorText}>{error}</Text>}
      </View>
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
    width: RPW(70),
    borderColor: 'grey',
    lineHeight: 16,
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    width: RPW(70),
    backgroundColor: '#FF8400',
    borderRadius: 8,
    paddingVertical: 10,
    marginTop: 8,
  },
  disabledButton: {
    backgroundColor: '#cccccc',
  },
  textButton: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  switchText: {
    width: RPW(55),
    textAlign: 'left',
    fontSize: 16,
  },
  checkbox: {
    borderRadius: 4,
  },
  section: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  noteText: {
    color: '#757575',
    fontSize: 12,
    marginTop: 5,
    textAlign: 'center',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginTop: 10,
  },
});

export default SignInView;