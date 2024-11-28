import React, { useState, useContext } from 'react';
import { View, StyleSheet, Text, Alert, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { updateDoc, doc } from 'firebase/firestore';
import { AuthContext, db } from './Authentication';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import 'react-native-get-random-values';
import { encryptData } from '../encrypt';
import { useNavigation, NavigationProp } from '@react-navigation/native';

const UpdateLocation: React.FC<{ userId: string }> = ({ userId }) => {
    const navigation = useNavigation();
    const authContext = useContext(AuthContext);
    // console.log('AuthContext:', authContext);
    if (!authContext) {
        throw new Error("AuthContext is null");
    }
    const { user } = authContext;
    // console.log('User from AuthContext:', user);


    const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
    const [loading, setLoading] = useState(false);
    const [userInput, setUserInput] = useState('');

    const saveLocation = async () => {
        if (!location || typeof location.latitude !== 'number' || typeof location.longitude !== 'number') {
            Alert.alert('Error', 'Invalid location data. Please select a valid address.');
            console.error('Invalid location:', location);
            return;
        }

        try {
            setLoading(true);

            console.log('User ID:', userId);
            if (!userId) {
                throw new Error('User ID is undefined or null.');
            }

            const userDoc = doc(db, 'users', userId);
            console.log('Document reference created:', userDoc);

            const dataToEncrypt = {
                latitude: location.latitude.toString(),
                longitude: location.longitude.toString(),
            };

            console.log('Data before encryption:', dataToEncrypt);

            const encryptedLocation = await encryptData(dataToEncrypt);
            console.log('Encrypted location:', encryptedLocation);

            if (!encryptedLocation || typeof encryptedLocation !== 'string') {
                throw new Error('Invalid encrypted location returned.');
            }

            console.log('Attempting to update Firestore...');
            await updateDoc(userDoc, {
                encryptedUbicacion: encryptedLocation,
            });
            navigation.navigate('DonorProfile');

        } catch (error) {
            console.error('Failed to update location:', {
                message: error.message,
                stack: error.stack,
            });
            Alert.alert('Error', 'Failed to update location.');
        } finally {
            setLoading(false);
        }
    };





    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            <GooglePlacesAutocomplete
                placeholder="Enter your address"
                fetchDetails
                onPress={(data, details = null) => {
                    if (!details || !details.geometry || !details.geometry.location) {
                        console.error('Details missing required fields.');
                        Alert.alert('Error', 'Failed to retrieve location details.');
                        return;
                    }
                    const { lat, lng } = details.geometry.location;
                    setLocation({ latitude: lat, longitude: lng });
                }}
                query={{
                    key: process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY,
                    language: 'en',
                }}
                styles={{
                    textInput: styles.input,
                    listView: { zIndex: 1 },
                }}
                debounce={300}
                enablePoweredByContainer={false}
                onFail={(error) => console.error('API Request Failed:', error)}
                onNotFound={() => console.warn('No suggestions found')}
                textInputProps={{
                    onChangeText: (text) => {
                        setUserInput(text); // Update user input
                        const array = new Uint32Array(1);
                        crypto.getRandomValues(array);
                        const randomNumber = array[0] / (0xFFFFFFFF + 1); // Normalize
                        console.log("User input: ${text}, Secure random number: ${randomNumber}");
                },
            }}
            renderRow={(data, index) => {
                return (
                    <View key={index} style={styles.suggestionRow}>
                        <Text>{data.description}</Text>
                    </View>
                );
            }}
            />
            <TouchableOpacity style={styles.button} onPress={saveLocation} disabled={loading}>
                <Text style={styles.buttonText}>{loading ? 'Updating...' : 'Save Location'}</Text>
            </TouchableOpacity>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
    },
    input: {
        height: 50,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 20,
        paddingHorizontal: 10,
        borderRadius: 5,
    },
    button: {
        backgroundColor: '#FF8400',
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    suggestionRow: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
});

export default UpdateLocation;