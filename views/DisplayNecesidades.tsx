import React, { useEffect, useState, useContext } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { collection, getDocs } from 'firebase/firestore';
import { AuthContext } from './Authentication';
import Maps from './Map';

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
    <ScrollView>
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

export default DisplayNecesidades;
