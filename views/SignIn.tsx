import React, { useState, useContext } from 'react';
import Checkbox from 'expo-checkbox';
import { View, TextInput, Text, StyleSheet, Dimensions, Pressable, Alert } from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { AuthContext, db } from './Authentication';
import { doc, GeoPoint, setDoc } from 'firebase/firestore';


// Define the RootStackParamList for navigation
type RootStackParamList = {
    OTPVerification: { phone: string };
    SignIn: undefined;
};

// Define the navigation prop type for SignIn
type SignInNavigationProp = StackNavigationProp<RootStackParamList, 'SignIn'>;

const screenHeight = Dimensions.get('window').height;
const RPH = (percentage: any) => {
    return (percentage / 100) * screenHeight;
};

const screenWidth = Dimensions.get('window').width;
const RPW = (percentage: any) => {
    return (percentage / 100) * screenWidth;
};

const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

const validatePassword = (password: string) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
};

const SignInView: React.FC = () => {
    const navigation = useNavigation<SignInNavigationProp>(); // Use the typed navigation prop
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

    const handleSignUp = async () => {
        // Validate fields
        if (!nombre.trim()) {
            Alert.alert("Error", "Please enter your name.");
            return;
        }
        if (!validateEmail(email)) {
            Alert.alert("Error", "Please enter a valid email address.");
            return;
        }
        if (!phone.trim() || phone.length < 10) {
            Alert.alert("Error", "Please enter a valid phone number.");
            return;
        }
        if (!validatePassword(password)) {
            Alert.alert(
                "Error",
                "Password must be at least 8 characters long and include an uppercase letter, a lowercase letter, a number, and a special character."
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
                ubicacion?: GeoPoint;
                uid?: string;
            } = {
                email,
                nombre,
                phone,
                accountType,
            };

            if (accountType === 'donor company') {
                userData.ubicacion = new GeoPoint(0, 0);
            }

            if (accountType === 'food bank staff') {
                userData.uid = userId;
            }

            await setDoc(doc(db, 'users', userId), userData);

            console.log("User signed up with account type: " + accountType);

            // Redirect to OTP Verification screen
            navigation.navigate('OTPVerification', { phone });
        } catch (error: any) {
            if (error.code === "auth/weak-password") {
                alert("That password is too weak!");
            } else {
                alert("Error: " + error.message);
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
                        keyboardType="phone-pad"
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
                        <Checkbox style={styles.checkbox} color={'black'} value={isCompany} onValueChange={setIsCompany} />
                        <Text style={styles.switchText}>Register as a company account</Text>
                    </View>
                    <View>
                        <Text style={styles.checkText}>
                            By registering as a Company account you'll have to wait until the BAMX administrator accepts and verifies your request.
                        </Text>
                    </View>
                </View>
                <View style={styles.group}>
                    <View style={styles.section}>
                        <Checkbox style={styles.checkbox} color={'black'} value={isBAMX} onValueChange={setIsBAMX} />
                        <Text style={styles.switchText}>Register as a BAMX account</Text>
                    </View>
                    <View>
                        <Text style={styles.checkText}>
                            By registering as a new BAMX employee account you'll have to wait until the BAMX administrator accepts and verifies your request.
                        </Text>
                    </View>
                </View>
                <View>
                    <Pressable style={styles.button} onPress={handleSignUp}>
                        <Text style={styles.textButton}> Register </Text>
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