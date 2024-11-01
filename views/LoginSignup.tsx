import React, { useState, useContext } from 'react';
import { View, TextInput, Button, Text, StyleSheet, Image, Dimensions, Pressable } from 'react-native';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { AuthContext } from './Authentication';

const screenHeight = Dimensions.get('window').height;
const RPH = (percentage: any) => {
    return (percentage / 100) * screenHeight;
};

const screenWidth = Dimensions.get('window').width;
const RPW = (percentage: any) => {
    return (percentage / 100) * screenWidth;
};

const logo = {
    uri: 'https://bamx.org.mx/wp-content/uploads/2023/12/Logo-RED-BAMX_Mesa-de-trabajo-1.png',
    width: RPW(90),
    height: RPH(20),
};

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
            <Image source={logo} style={{ resizeMode: 'contain' }}></Image>
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
            <Pressable style={styles.button}>
                <Text style= {styles.textButton}> Login </Text>
            </Pressable>
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
        fontFamily: 'Roboto',
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
        alignItems: 'center',
        justifyContent: 'center',
        margin: 20,
        width: RPW(80),
        backgroundColor: '#FF8400',
        borderRadius: 100,
        paddingVertical: 10,
    },

    textButton:
    {
        color: 'white',
    },

    switchText: {
        marginVertical: 10,
    },

});

export default LoginSignUp;
