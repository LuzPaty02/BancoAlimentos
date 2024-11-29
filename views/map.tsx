import React, { useState, useRef, useEffect } from 'react';
import MapView, { Marker, Region } from 'react-native-maps';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

type Location = {
  id: string;
  latitude: number;
  longitude: number;
  title: string;
  category: string;
  status: 'disponible' | 'no disponible';
};

const Maps: React.FC = () => {
  const [filter, setFilter] = useState<string | null>(null);
  const mapRef = useRef<MapView>(null);

  // Ubicaciones de ejemplo con diferentes categorías y estados
  const locations: Location[] = [
    { id: '1', latitude: 20.7295, longitude: -103.3698, title: 'Donante 1', category: 'Medicamentos', status: 'disponible' },
    { id: '2', latitude: 20.7315, longitude: -103.3700, title: 'Donante 2', category: 'Ropa', status: 'no disponible' },
    { id: '3', latitude: 20.7280, longitude: -103.3680, title: 'Donante 3', category: 'Alimentos', status: 'disponible' },
    { id: '4', latitude: 20.7270, longitude: -103.3660, title: 'Donante 4', category: 'Medicamentos', status: 'no disponible' },
    // { id: '5', latitude: 20.7454, longitude: -103.4405, title: 'Donante 5', category: 'baddies', status: 'disponible' },
  ];

  // Filtra las ubicaciones según la etiqueta seleccionada
  const filteredLocations = filter
    ? locations.filter((location) => location.category === filter)
    : locations;


  return (
    <View style={styles.container}>
      <View style={styles.filterContainer}>
        {['Todos', 'Medicamentos', 'Ropa', 'Alimentos'].map((category) => (
          <TouchableOpacity
            key={category}
            style={[
              styles.tag,
              (filter === category || (filter === null && category === 'Todos')) && styles.activeTag,
            ]}
            onPress={() => setFilter(category === 'Todos' ? null : category)}
          >
            <Text style={styles.tagText}>{category}</Text>
          </TouchableOpacity>
        ))}
      </View>
      
      <MapView ref={mapRef} style={styles.map} initialRegion={{
        latitude: 20.7295168,
        longitude: -103.3697941,
        latitudeDelta: 0.02,
        longitudeDelta: 0.02,
      }}>
        {filteredLocations.map((location) => (
          <Marker
            key={location.id}
            coordinate={{ latitude: location.latitude, longitude: location.longitude }}
            title={location.title}
            description={location.status === 'disponible' ? 'Donación disponible' : 'No disponible'}
            pinColor={location.status === 'disponible' ? 'green' : 'red'}
          />
        ))}
      </MapView>
      
      <View style={styles.infoWindow}>
        <Text style={styles.infoText}>
          Guadalajara - coord.: {20.7295168.toFixed(4)}, {-103.3697941.toFixed(4)}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 10,
    backgroundColor: '#f0f0f0',
  },
  tag: {
    padding: 8,
    borderRadius: 15,
    backgroundColor: '#FF5500FF',
    marginHorizontal: 5,
  },
  activeTag: {
    backgroundColor: '#4285F4', // Color azul para la etiqueta activa
  },
  tagText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  map: {
    width: '100%',
    height: '80%',
  },
  infoWindow: {
    alignItems: 'center',
    padding: 10,
  },
  infoText: {
    fontSize: 14,
  },
});

export default Maps;


// import React, { useEffect, useState, useContext } from 'react';
// import MapView, { Marker } from 'react-native-maps';
// import { collection, getDocs } from 'firebase/firestore';
// import { View, StyleSheet, Text } from 'react-native';
// import { AuthContext } from './Authentication';
// import { useSubmissionTrigger } from './SubmissionContext';
// import { decryptData } from '../encrypt'; // Import your decryption function

// interface Location {
//   id: string;
//   latitude: number;
//   longitude: number;
//   title: string;
// }

// const Maps: React.FC = () => {
//   const [locations, setLocations] = useState<Location[]>([]);
//   const authContext = useContext(AuthContext);
//   const { trigger } = useSubmissionTrigger();

//   if (!authContext) {
//     throw new Error('Maps must be used within an AuthContext.Provider');
//   }

//   const { db } = authContext;

//   const fetchLocations = async () => {
//     if (!db) return;
  
//     try {
//       const querySnapshot = await getDocs(collection(db, 'donationRequests'));
//       const locationData: Location[] = [];
  
//       for (const doc of querySnapshot.docs) {
//         const data = doc.data();
//         let decryptedUbicacion = null;
  
//         if (data.ubicacion) {
//           try {
//             decryptedUbicacion = await decryptData(data.ubicacion); // Decrypt the ubicacion field
//             if (typeof decryptedUbicacion === 'string') {
//               decryptedUbicacion = JSON.parse(decryptedUbicacion); // Parse the decrypted string
//             }
//             console.log('Decrypted ubicacion:', decryptedUbicacion);
//           } catch (error) {
//             console.error(`Error decrypting ubicacion for ${doc.id}:`, error);
//           }
//         }
  
//         if (decryptedUbicacion && decryptedUbicacion.latitude && decryptedUbicacion.longitude) {
//           locationData.push({
//             id: doc.id,
//             latitude: decryptedUbicacion.latitude,
//             longitude: decryptedUbicacion.longitude,
//             title: data.necesidadName || 'Unknown Location',
//           });
//           console.log('Added location:', {
//             id: doc.id,
//             latitude: decryptedUbicacion.latitude,
//             longitude: decryptedUbicacion.longitude,
//           });
//         }
//       }
  
//       setLocations(locationData);
//       console.log('Final locations array:', locationData);
//     } catch (error) {
//       console.error('Error fetching locations:', error);
//     }
//   };
  

//   // Fetch locations on mount and whenever the trigger changes
//   useEffect(() => {
//     fetchLocations();
//   }, [db, trigger]);

//   return (
//     <View style={styles.container}>
//       <MapView
//         style={styles.map}
//         initialRegion={{
//           latitude: locations.length > 0 ? locations[0].latitude : 20.7295,
//           longitude: locations.length > 0 ? locations[0].longitude : -103.3698,
//           latitudeDelta: 0.1,
//           longitudeDelta: 0.1,
//         }}
//       >
//         {locations.map((location) => (
//           <Marker
//             key={location.id}
//             coordinate={{ latitude: location.latitude, longitude: location.longitude }}
//             title={location.title}
//           />
//         ))}
//       </MapView>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   map: {
//     width: '100%',
//     height: '100%',
//   },
//   errorText: {
//     color: 'red',
//     fontSize: 18,
//     textAlign: 'center',
//     marginTop: 20,
//   },
// });

// export default Maps;
