import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { doc, getDoc } from 'firebase/firestore';
import { AuthContext, db } from './Authentication';
import { useNavigation } from '@react-navigation/native';
import { decryptData } from '../encrypt'; 

interface ProfileData {
  nombre: string;
  email: string;
  phone: string;
  accountType: string;
  ubicacion?: {
    latitude: number;
    longitude: number;
  };
}

const DonorProfile: React.FC<{ userId: string }> = ({ userId }) => {
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation() as any;

  const authContext = useContext(AuthContext);
  if (!authContext) {
    throw new Error('AuthContext is null');
  }

  useEffect(() => {
    const fetchAndDecryptProfileData = async () => {
      try {
        const docRef = doc(db, 'users', userId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const encryptedData = docSnap.data();
          console.log('Fetched Encrypted:', encryptedData);

          const decryptedEmail = await decryptData(encryptedData.email);
          const decryptedNombre = await decryptData(encryptedData.nombre);
          const decryptedPhone = await decryptData(encryptedData.phone);

          let decryptedUbicacion;
          if (encryptedData.encryptedUbicacion) {
            decryptedUbicacion = await decryptData(encryptedData.encryptedUbicacion);
            if (typeof decryptedUbicacion === 'string') {
              decryptedUbicacion = JSON.parse(decryptedUbicacion);
            }
          }

          console.log('Decrypted Data:', { decryptedEmail, decryptedNombre, decryptedPhone, decryptedUbicacion });

          setProfileData({
            nombre: decryptedNombre,
            email: decryptedEmail,
            phone: decryptedPhone,
            accountType: encryptedData.accountType,
            ubicacion: decryptedUbicacion,
          });
        } else {
          console.log('No such document!');
        }
      } catch (error) {
        console.error('Failed to fetch and decrypt profile data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAndDecryptProfileData();
  }, [userId]);

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <View style={styles.container}>
      {profileData ? (
        <>
          <Text>Nombre: {profileData.nombre}</Text>
          <Text>Email: {profileData.email}</Text>
          <Text>Phone: {profileData.phone}</Text>
          <Text>Account Type: {profileData.accountType}</Text>
          {profileData.ubicacion && (
            <Text>Ubicacion: {profileData.ubicacion.latitude}, {profileData.ubicacion.longitude}</Text>
          )}
        </>
      ) : (
        <Text>No profile data available</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
});

export default DonorProfile;
