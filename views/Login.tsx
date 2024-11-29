import React, { useState, useContext } from 'react';
import { View, TextInput, Text, StyleSheet, Dimensions, Pressable } from 'react-native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { auth, db } from './Authentication';
import { doc, getDoc } from 'firebase/firestore';

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

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigation = useNavigation<NavigationProp<any>>();

    const handleLogin = async (e: any) => {
        e.preventDefault();

        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const userId = userCredential.user.uid;

            // Fetch user account type from Firestore
            const userDoc = await getDoc(doc(db, 'users', userId));
            const userType = userDoc.data()?.accountType;

            // Navigate based on account type
            switch (userType) {
                case 'regular donor':
                    navigation.navigate('Company');
                    console.log('Regular donor account type');
                    break;
                case 'donor company':
                    navigation.navigate('Company');
                    console.log('Donor company account type');
                    break;
                case 'food bank staff':
                    navigation.navigate('MainBamx');
                    console.log('Food Bank account type');
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
