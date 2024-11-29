import React, { useEffect, useState, useContext } from 'react';
import { View, Text, ScrollView, Image, StyleSheet, Dimensions, Pressable, Alert } from 'react-native';
import { collection, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { AuthContext } from './Authentication';

interface Donor {
  id: string;
  nombre: string;
  email: string;
  phone: string;
  accountType: string;
  ubicacion?: {
    latitude: number;
    longitude: number;
  };
}

const screenHeight = Dimensions.get('window').height;
const RPH = (percentage: any) => (percentage / 100) * screenHeight;
const screenWidth = Dimensions.get('window').width;
const RPW = (percentage: any) => (percentage / 100) * screenWidth;

const placeholder = {
  uri: 'https://media.licdn.com/dms/image/v2/D560BAQH0lQq_4TEh4g/company-logo_200_200/company-logo_200_200/0/1712160830518/redbamx_logo?e=2147483647&v=beta&t=96GI1KFEMnrHFqdQU0TZJRcc1WpbvYC7FN-hfB-HKh0',
};

const DisplayDonors = () => {
  const [donors, setDonors] = useState<Donor[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDonor, setSelectedDonor] = useState<Donor | null>(null);
  
  const authContext = useContext(AuthContext);
  const db = authContext?.db;

  const fetchDonors = async () => {
    if (!db) {
      console.error("Firestore database not available.");
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, 'users'));
      const donorsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Donor[];
      const activeDonors = donorsData.filter(donor => donor.accountType === 'donor company');
      setDonors(activeDonors);
    } catch (error) {
      console.error('Error fetching donors:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDonors();
  }, [db]);

  const handleDonorSelect = (donor: Donor) => {
    setSelectedDonor(donor);
    Alert.alert('Donor Selected', `You selected ${donor.nombre}`);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={{ padding: 12 }}>
        {loading ? (
          <Text>Loading...</Text>
        ) : donors.length > 0 ? (
          donors.map((donor) => (
            <Pressable 
              key={donor.id} 
              onPress={() => handleDonorSelect(donor)}
              style={({ pressed }) => [
                styles.list,
                pressed && { opacity: 0.7 }
              ]}
            >
              <View style={styles.listItem}>
                <Image source={placeholder} style={styles.imgstyle} />
                <View style={styles.group}>
                  <Text style={styles.donorTitle}>{donor.nombre}</Text>
                  <Text>Email: {donor.email}</Text>
                  <Text>Phone: {donor.phone}</Text>
                  <Text>Account Type: {donor.accountType}</Text>
                  {donor.ubicacion && (
                    <Text>Location: [{donor.ubicacion.latitude}° N, {donor.ubicacion.longitude}° W]</Text>
                  )}
                </View>
              </View>
            </Pressable>
          ))
        ) : (
          <Text>No active donors found.</Text>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    textAlign: 'left',
  },
  imgstyle:{
    borderRadius: 20,
    resizeMode: 'cover',
    width: RPW(20),
    height: RPH(10),
  },
  list: {
    textAlign: 'left',
    flexDirection: 'row',
    borderColor: '#D9D9D9',
    borderBottomWidth: 1,
    paddingBottom: 16,
    gap: 16,
  },
  donorTitle: {
    fontFamily: 'Roboto',
    fontWeight: 'bold',
    fontSize: 24,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 12,
    width: RPW(70),
    gap: 12,
  },
  group: {
    gap: 8,
    alignContent: 'center',
  },
});

export default DisplayDonors;