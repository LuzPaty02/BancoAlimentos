import React, { useState, useContext } from 'react';
import Checkbox from 'expo-checkbox';
import { View, TextInput, Text, StyleSheet, Dimensions, Pressable } from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { useNavigation } from '@react-navigation/native';
import { AuthContext, db } from './Authentication';
import { doc, GeoPoint, setDoc } from 'firebase/firestore';
import { encryptData } from '../encrypt'; // Import encryption utility

const screenHeight = Dimensions.get('window').height;
const RPH = (percentage: any) => (percentage / 100) * screenHeight;
const screenWidth = Dimensions.get('window').width;
const RPW = (percentage: any) => (percentage / 100) * screenWidth;

const SignInView: React.FC = () => {
  const navigation = useNavigation();
  const authContext = useContext(AuthContext);
  if (!authContext) {
    throw new Error('AuthContext is null');
  }
  const { auth } = authContext;

  const [email, setEmail] = useState('');
  const [nombre, setNombre] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [isCompany, setIsCompany] = useState(false);
  const [isBAMX, setIsBAMX] = useState(false);

  const handleSignUp = async () => {
    try {
      if (!email || !nombre || !phone) {
        throw new Error('All fields are required before encryption.');
      }

      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const userId = userCredential.user.uid;

      console.log('Pre-encryption Data:', { email, nombre, phone });

      const encryptedEmail = await encryptData(email);
      const encryptedNombre = await encryptData(nombre);
      const encryptedPhone = await encryptData(phone);

      console.log('Post-encryption Data:', {
        encryptedEmail,
        encryptedNombre,
        encryptedPhone,
      });

      const accountType = isBAMX ? 'food bank staff' : isCompany ? 'donor company' : 'regular donor';

      const userEncryptedData = {
        email: encryptedEmail,
        nombre: encryptedNombre,
        phone: encryptedPhone,
        accountType,
        ...(accountType === 'donor company' && { ubicacion: new GeoPoint(0, 0) }), // Default GeoPoint for company
        ...(accountType === 'food bank staff' && { uid: userId }), // UID for BAMX staff
      };

      await setDoc(doc(db, 'users', userId), userEncryptedData);

      console.log('User signed up successfully with encrypted data and default location.');
    } catch (error: any) {
      console.error('Sign-up error:', error )
      if (error.message.includes('auth/email-already-in-use')) {
        alert('Email is already in use.');
      } else {
        alert('Error during sign-up: ' + error.message);
      }
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
            placeholder="+52 0 0000 0000"
            value={phone}
            onChangeText={setPhone}
          />
        </View>
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
          <Text style={styles.checkText}>
            By registering as a Company account you'll have to wait until the BAMX administrator
            accepts and verifies your request.
          </Text>
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
          <Text style={styles.checkText}>
            By registering as a new BAMX employee account you'll have to wait until the BAMX
            administrator accepts and verifies your request.
          </Text>
        </View>
        <Pressable style={styles.button} onPress={handleSignUp}>
          <Text style={styles.textButton}>Register</Text>
        </Pressable>
      </View>
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
    gap: 16,
    paddingVertical: 10,
  },
  group: {
    gap: 8,
    alignContent: 'center',
  },
  section: {
    flexDirection: 'row',
    alignItems: 'center',
    width: RPW(70),
    gap: 12,
  },
  textButton: {
    color: 'white',
  },
  switchText: {
    width: RPW(55),
    textAlign: 'left',
    fontSize: 16,
  },
  checkText: {
    width: RPW(55),
    textAlign: 'left',
    fontSize: 16,
    color: '#757575',
  },
  checkbox: {
    borderRadius: 4,
  },
});

export default SignInView;
