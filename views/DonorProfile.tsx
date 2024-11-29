import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { doc, getDoc } from 'firebase/firestore';
import { AuthContext, db } from './Authentication';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { decryptData } from '../encrypt';

interface ProfileData {
  nombre: string;
  email: string;
  phone: string;
  accountType: string;
  address?: string;
  ubicacion?: {
    latitude: number;
    longitude: number;
  };
}

const DonorProfile: React.FC<{ userId: string }> = ({ userId }: { userId: string }) => {
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation() as any;

  const authContext = useContext(AuthContext);
  if (!authContext) {
    throw new Error('AuthContext is null');
  }

  const fetchAndDecryptProfileData = async () => {
      try {
        setLoading(true);
        const userDoc = await getDoc(doc(db, 'users', userId));
        if (userDoc.exists()) {
          const encryptedData = userDoc.data();
          console.log('Fetched Encrypted:', encryptedData.email);
          // console.log('Decrypted Logs — Emails decrypted:', decryptData(encryptedData.email));

          // Decrypt data
          const decryptedEmail = await decryptData(encryptedData.email);
          const decryptedNombre = await decryptData(encryptedData.nombre);
          const decryptedPhone = await decryptData(encryptedData.phone);

          let decryptedAddress;
          if (encryptedData.address) {
            try {
              const decryptedAddressData = await decryptData(encryptedData.address);
              decryptedAddress =
                typeof decryptedAddressData === 'string'
                  ? decryptedAddressData
                  : decryptedAddressData.address;
            } catch (error) {
              console.error('Failed to decrypt address:', error);
            }
          }
          // Decrypt location
          let decryptedUbicacion;
          if (encryptedData.ubicacion) {
            decryptedUbicacion = await decryptData(encryptedData.ubicacion);
            if (typeof decryptedUbicacion === 'string') {
              decryptedUbicacion = JSON.parse(decryptedUbicacion);
            }
          }
          console.log('Decrypted Data:', { decryptedEmail, decryptedNombre, decryptedPhone, decryptedUbicacion, decryptedAddress });

          setProfileData({
            nombre: decryptedNombre,
            email: decryptedEmail,
            phone: decryptedPhone,
            accountType: encryptedData.accountType,
            address: decryptedAddress || undefined,
            ubicacion: decryptedUbicacion || undefined,
          });
        } else {
          console.warn('No profile data found for the user.');
        }
      } catch (error) {
        console.error('Failed to fetch and decrypt profile data:', error);
      } finally {
        setLoading(false);
      }
    };

  // Run fetch logic whenever the screen is focused
  useFocusEffect(
    React.useCallback(() => {
      fetchAndDecryptProfileData();
    }, [userId])
  );
      // Run fetch logic whenever the screen is focused
  useFocusEffect(
    React.useCallback(() => {
      fetchAndDecryptProfileData();
    }, [userId])
  );
  

  if (loading) {
    return <ActivityIndicator size="large" color="#4285F4" />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Donor Profile</Text>

      {profileData && (
        <>
          <Text style={styles.label}>Name:</Text>
          <Text style={styles.value}>{profileData.nombre}</Text>

          <Text style={styles.label}>Email:</Text>
          <Text style={styles.value}>{profileData.email}</Text>

          <Text style={styles.label}>Phone:</Text>
          <Text style={styles.value}>{profileData.phone}</Text>

          <Text style={styles.label}>Account Type:</Text>
          <Text style={styles.value}>{profileData.accountType}</Text>

          <Text style={styles.label}>Address:</Text>
          <Text style={styles.value}> {typeof profileData.address === 'string'
                ? profileData.address
                : profileData.address}</Text>

          {profileData.ubicacion && (
            <>
              <Text style={styles.label}>Location:</Text>
              <Text style={styles.value}>
                [{profileData.ubicacion.latitude}° N, {profileData.ubicacion.longitude}° W]
              </Text>
            </>
          )}
        </>
      )}

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('UpdateLocation', { userId })}
      >
        <Text style={styles.buttonText}>Update Location</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
  },
  value: {
    fontSize: 16,
    color: '#333',
  },
  button: {
    backgroundColor: '#FF8400',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default DonorProfile;