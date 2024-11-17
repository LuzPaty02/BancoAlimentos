import React, { useState, useContext } from 'react';
import { View, StyleSheet, Text, Alert, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { updateDoc, GeoPoint, doc } from 'firebase/firestore';
import { AuthContext, db } from './Authentication';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import 'react-native-get-random-values';


const DonorProfile: React.FC<{ userId: string }> = ({ userId }) => {
  const authContext = useContext(AuthContext);
  if (!authContext) {
    throw new Error("AuthContext is null");
  }
  const { auth } = authContext;
  const [address, setAddress] = useState('');
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [loading, setLoading] = useState(false);

  console.log('Loaded Google Maps API Key:', process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY);

  const saveLocation = async () => {
    if (!location) {
      Alert.alert('Error', 'Please select a valid address from the suggestions.');
      return;
    }

    try {
      const userDoc = doc(db, 'users', userId);
      await updateDoc(userDoc, {
        ubicacion: new GeoPoint(location.latitude, location.longitude),
      });
      Alert.alert('Success', 'Location updated successfully!');

      // Log success only after successful update
      console.log('Location updated successfully:', location);
    } catch (error) {
      Alert.alert('Error', 'Failed to update location.');
      console.error('Failed to update location:', error); //  for debugging
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
          // console.log('Selected Address Data:', data); // log all data
          console.log('Selected Address Description:', data.description);
          console.log('Place ID:', data.place_id);

          if (details) { // log only necessary details (exclude photos, reviews, etc.)
            console.log('Formatted Address:', details.formatted_address);
            console.log('Coordinates:', {
              latitude: details.geometry.location.lat,
              longitude: details.geometry.location.lng,
            });

            // Use the extracted latitude and longitude
            const { lat, lng } = details?.geometry.location || {};
            setAddress(data.description);
            if (lat !== undefined && lng !== undefined) {
              setLocation({ latitude: lat, longitude: lng });
              console.log('Location set:', { latitude: lat, longitude: lng });
            } else {
              Alert.alert('Error', 'Failed to get location details.');
            }
          }
        }}

        query={{ //looks for addresses using the Google Maps Places API
          key: process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY,
          language: 'en',
        }}
        onFail={(error) => {
          console.error('API Request Failed:', error);
        }}
        onNotFound={() => {
          console.warn('No suggestions found');
        }}
        textInputProps={{
          onChangeText: (text) => {
            console.log('Input changed:', text);
          },
        }}
        styles={{
          textInput: styles.input,
          listView: {
            zIndex: 1,
          },
        }}
        debounce={300} //debounce means that it will wait 300ms after the last character has been typed before making the request
        enablePoweredByContainer={false} // Remove "Powered by Google" footer if needed
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
    backgroundColor: '#4285F4',
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
    borderBottomColor: '#ddd',
    borderBottomWidth: 1,
  },
});

export default DonorProfile;
