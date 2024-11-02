import React, { useState, useContext } from 'react';
import { View, TextInput, Text, StyleSheet, Image, Dimensions, Pressable } from 'react-native';
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

const Login: React.FC = () => {
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
            <View style={styles.box}>
                <View style = {styles.group}>
                    <Text style={styles.switchText}>Email</Text>
                    <TextInput
                        style={styles.inputField}
                        keyboardType="email-address"
                        placeholder="Email"
                        value={email}
                        onChangeText={setEmail}
                    />
                </View>
                <View style = {styles.group}>
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
                    <Pressable style={styles.button}>
                        <Text style={styles.textButton}> Login </Text>
                    </Pressable>
                </View>

                <View>
                    <Pressable>
                        <Text style={styles.linkStyle}>{"Forgot password?"}</Text>
                    </Pressable>
                </View>
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
        gap: 16,
        paddingVertical: 10,
    },
    group: {
        gap: 8,
        alignContent: 'center',
    },
    textButton:
    {
        color: 'white',
    },

    switchText: {
        width: RPW(40),
        textAlign: 'left',
        fontSize: 16,
    },

    linkStyle: {
        textAlign: 'left',
        textDecorationLine: 'underline',
        textDecorationStyle: 'solid',
    },

});

export default Login;
