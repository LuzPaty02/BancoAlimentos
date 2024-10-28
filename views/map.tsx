import React from 'react';
import MapView, { Marker, Region } from 'react-native-maps';
import { View, Text, StyleSheet } from 'react-native';

type Location = {
  latitude: number;
  longitude: number;
};

const Maps: React.FC = () => {
  const location: Location = {
    latitude: 20.7295168, // Guadalajara latitude
    longitude: -103.3697941, // Guadalajara longitude
  };

  // Initial region type for MapView centered on Guadalajara
  const initialRegion: Region = {
    latitude: location.latitude,
    longitude: location.longitude,
    latitudeDelta: 0.005,
    longitudeDelta: 0.005,
  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={initialRegion}
      >
        <Marker
          coordinate={location}
          title="Guadalajara"
        />
      </MapView>
      <View style={styles.infoWindow}>
        <Text style={styles.infoText}>
          Guadalajara - coord.: {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    fontFamily: 'Arial',
  },
});

export default Maps;
