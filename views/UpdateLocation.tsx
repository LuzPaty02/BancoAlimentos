import React, { useState, useContext } from 'react';
import { View, StyleSheet, Text, Alert, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { updateDoc, GeoPoint, doc } from 'firebase/firestore';
import { AuthContext, db } from './Authentication';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';

const UpdateLocation: React.FC<{ userId: string }> = ({ userId }) => {
  const authContext = useContext(AuthContext);
  if (!authContext) {
    throw new Error("AuthContext is null");
  }

  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [loading, setLoading] = useState(false);

  const saveLocation = async () => {
    if (!location) {
      Alert.alert('Error', 'Please select a valid address from the suggestions.');
      return;
    }

    try {
      setLoading(true);
      const userDoc = doc(db, 'users', userId);

      // Validate latitude and longitude
      if (typeof location.latitude !== 'number' || typeof location.longitude !== 'number') {
        throw new Error('Invalid location coordinates');
      }

      await updateDoc(userDoc, {
        ubicacion: new GeoPoint(location.latitude, location.longitude),
      });

      Alert.alert('Success', 'Location updated successfully!');
      console.log('Location updated successfully:', location);
    } catch (error) {
      Alert.alert('Error', 'Failed to update location.');
      console.error('Failed to update location:', error);
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
            console.log('Details:', details);
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
});

export default UpdateLocation;
