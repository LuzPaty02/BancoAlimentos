import React, { useEffect, useState, useContext } from 'react';
import { View, Text, ScrollView, StyleSheet, Dimensions, Pressable } from 'react-native';
import { collection, getDocs } from 'firebase/firestore';
import { AuthContext } from './Authentication';

interface Necesidad {
  id: string;
  Necesidad: string;
  Categoria?: {
    Tipo: string;
    TipoEncoded: number;
  };
  Prioridad: number;
  Caducidad?: any; 
  Fecha_de_creacion?: any; 
}

const screenHeight = Dimensions.get('window').height;
const RPH = (percentage: any) => {
    return (percentage / 100) * screenHeight;
};

const screenWidth = Dimensions.get('window').width;
const RPW = (percentage: any) => {
    return (percentage / 100) * screenWidth;
};

const DisplayNecesidades = () => {
  const [necesidades, setNecesidades] = useState<Necesidad[]>([]);
  const [loading, setLoading] = useState(true); // Loading state
  const authContext = useContext(AuthContext); // Access Firestore instance from context
  const db = authContext?.db;

  useEffect(() => {
    const fetchNecesidades = async () => {
      if (!db) {
        console.error("Firestore database not available.");
        setLoading(false);
        return;
      }

      setLoading(true); // Set loading to true at the start
      try {
        const querySnapshot = await getDocs(collection(db, 'necesidades'));
        const necesidadesData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Necesidad[]; // Cast to Necesidad[]
        setNecesidades(necesidadesData);
      } catch (error) {
        console.error('Error fetching necesidades:', error);
      } finally {
        setLoading(false); // Set loading to false once done
      }
    };

    fetchNecesidades();
  }, [db]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={{ padding: 20 }}>
        {loading ? (
          <Text>Loading...</Text>
        ) : necesidades.length > 0 ? (
          necesidades.map((necesidad) => (
            <View key={necesidad.id} style={{ marginBottom: 10 }}>
              <Text>Necesidad: {necesidad.Necesidad}</Text>
              <Text>Tipo: {necesidad.Categoria?.Tipo}</Text>
              <Text>Prioridad: {necesidad.Prioridad}</Text>
            </View>
          ))
        ) : (
          <Text>No necesidades found.</Text>
        )}
      </View>
      
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
      justifyContent: 'center',
      textAlign: 'left',
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

export default DisplayNecesidades;
