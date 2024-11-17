import React, { useState, useContext } from 'react';
import { View, StyleSheet, Text, Alert, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { updateDoc, doc} from 'firebase/firestore'; // Removed GeoPoint as it's not used.
import { AuthContext, db } from './Authentication';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import 'react-native-get-random-values'; // Ensure this is loaded before encryption or UUID usage.
import { encryptData } from '../encrypt'; // Assuming this handles encryption.

const UpdateLocation: React.FC<{ userId: string }> = ({ userId }) => {
    const authContext = useContext(AuthContext);
    // console.log('AuthContext:', authContext);
    if (!authContext) {
        throw new Error("AuthContext is null");
    }
    const { user } = authContext;
    console.log('User from AuthContext:', user);
    

    const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
    const [loading, setLoading] = useState(false);

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
            console.log('Firestore updated successfully.');
    
            Alert.alert('Success', 'Location updated successfully!');
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
                    key: process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY, // Ensure environment variable is loaded correctly.
                    language: 'en',
                }}
                styles={{
                    textInput: styles.input,
                    listView: { zIndex: 1 },
                }}
                debounce={300}
                enablePoweredByContainer={false}
                renderRow={(data, index) => {
                    // Render only first 3 suggestions
                    if (index < 5) {
                      return (
                        <View key={index} style={styles.suggestionRow}>
                          <Text>{data.description}</Text>
                        </View>
                      );
                    } else {
                      return <View />;
                    }
                  }}
                onFail={(error) => console.error('API Request Failed:', error)}
                onNotFound={() => console.warn('No suggestions found')}
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
