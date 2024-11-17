import React, { useState, useContext } from 'react';
import { View, TextInput, Text, StyleSheet, Dimensions, Pressable, Alert } from 'react-native';
import { signInWithEmailAndPassword, PhoneAuthProvider, multiFactor } from 'firebase/auth';
import { AuthContext, setupRecaptcha } from './Authentication';

const screenHeight = Dimensions.get('window').height;
const RPH = (percentage: any) => (percentage / 100) * screenHeight;
const screenWidth = Dimensions.get('window').width;
const RPW = (percentage: any) => (percentage / 100) * screenWidth;

const Login: React.FC = () => {
  const authContext = useContext(AuthContext);
  if (!authContext) {
    throw new Error("AuthContext is null");
  }
  const { auth } = authContext;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log("User logged in: " + userCredential.user.email);

      // Check if MFA is required
      const mfaResolver = multiFactor(userCredential.user);
      if (mfaResolver) {
        console.log("MFA required. Initiating second factor authentication...");

        setupRecaptcha(); // Ensure ReCAPTCHA is set up
        const phoneAuthProvider = new PhoneAuthProvider(auth);
        const verificationId = await phoneAuthProvider.verifyPhoneNumber(
          "+1234567890", // Replace with dynamic phone number input
          window.recaptchaVerifier
        );

        const verificationCode = prompt("Enter the verification code:");
        const credential = PhoneAuthProvider.credential(verificationId, verificationCode);
        await mfaResolver.resolveSignIn(credential);

        console.log("MFA login successful!");
        Alert.alert("Success", "Multi-Factor Authentication completed!");
      }
    } catch (error) {
      console.error("Login error:", error);
      Alert.alert("Error", error.message);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.box}>
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
          <Pressable style={styles.button} onPress={handleLogin}>
            <Text style={styles.textButton}> Login </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  // Same styles as original
});

export default Login;
