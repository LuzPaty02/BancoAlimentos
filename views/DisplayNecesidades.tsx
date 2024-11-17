import React, { useEffect, useState, useContext } from 'react';
import { View, Text, ScrollView, Image, StyleSheet, Dimensions, Pressable } from 'react-native';
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

const placeholder = {
  uri: 'https://i.scdn.co/image/ab67616d0000b273f536bbb3a72d3cc03f67d774',
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
      <View style={{ padding: 12 }}>
        {loading ? (
          <Text>Loading...</Text>
        ) : necesidades.length > 0 ? (
          necesidades.map((necesidad) => (
            <View key={necesidad.id} style={styles.list}>
              <View style={styles.listItem}>
                <Image source={placeholder} style={styles.imgstyle}></Image>
                <View style={styles.group}>
                  <Text style={styles.necesidadTitle}>{necesidad.Necesidad}</Text>
                  <Text>Tipo: {necesidad.Categoria?.Tipo}</Text>
                  <Text>Prioridad: {necesidad.Prioridad}</Text>
                </View>
              </View>
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
  },
  imgstyle:{
    borderRadius: 20,
    resizeMode: 'contain',
    width: RPW(22),
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
  necesidadTitle: {
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
});

export default DisplayNecesidades;
