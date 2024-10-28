import React, { useState, useContext } from 'react';
import { View, TextInput, Button, Text, StyleSheet } from 'react-native';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { AuthContext } from './authentication';

const LoginSignUp: React.FC = () => {
    const authContext = useContext(AuthContext);
    if (!authContext) {
        throw new Error("AuthContext is null");
    }
    const { auth } = authContext;

    const [isSignUp, setIsSignUp] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleToggleForm = () => {
        setIsSignUp(!isSignUp);
    };

    const handleLogin = () => {
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                console.log("User logged in: " + userCredential.user.email);
            })
            .catch((error) => {
                if (error.code === 'auth/user-not-found') {
                    alert("No user found with this email address.");
                } else if (error.code === 'auth/wrong-password') {
                    alert("Incorrect password. Please try again.");
                } else {
                    alert("Login failed: " + error.message);
                }
            });
    };

    const handleSignUp = () => {
        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                console.log("User signed up: " + userCredential.user.email);
            })
            .catch((error) => {
                if (error.code === "auth/weak-password") {
                    alert("That password is too weak!");
                } else {
                    alert("Error: " + error.message);
                }
            });
    };

    return (
        <View style={styles.container}>
            <Text>{isSignUp ? "Sign Up" : "Login"}</Text>
            <TextInput
                style={styles.inputField}
                keyboardType="email-address"
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
            />
            <TextInput
                style={styles.inputField}
                placeholder="Password"
                secureTextEntry={true}
                value={password}
                onChangeText={setPassword}
            />
            <View style={styles.button}>
                <Button
                    title={isSignUp ? "Sign Up" : "Login"}
                    onPress={isSignUp ? handleSignUp : handleLogin}
                />
            </View>
            <View style={styles.switchText}>
                <Text>{isSignUp ? "Already have an account?" : "Don't have an account?"}</Text>
            </View>
            <View style={styles.button}>
                <Button
                    title={isSignUp ? "Log in" : "Sign up"}
                    onPress={handleToggleForm}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
    },
    inputField: {
        margin: 5,
        padding: 10,
        borderWidth: 0.5,
        borderRadius: 5,
        width: 200,
        borderColor: 'grey',
    },
    button: {
        margin: 5,
        width: 200,
    },
    switchText: {
        marginVertical: 10,
    },
});

export default LoginSignUp;
