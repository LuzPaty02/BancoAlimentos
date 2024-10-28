import React, { useState } from 'react';
import MapView, { Marker, Region } from 'react-native-maps';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

type Location = {
  id: string;
  latitude: number;
  longitude: number;
  title: string;
  category: string;
};

const Maps: React.FC = () => {
  const [filter, setFilter] = useState<string | null>(null);

  // Sample locations with different categories
  const locations: Location[] = [
    { id: '1', latitude: 20.7295, longitude: -103.3698, title: 'Location 1', category: 'Restaurant' },
    { id: '2', latitude: 20.7315, longitude: -103.3700, title: 'Location 2', category: 'Museum' },
    { id: '3', latitude: 20.7280, longitude: -103.3680, title: 'Location 3', category: 'Park' },
    { id: '4', latitude: 20.7270, longitude: -103.3660, title: 'Location 4', category: 'Restaurant' },
  ];

  // Filtered locations based on the selected tag
  const filteredLocations = filter
    ? locations.filter((location) => location.category === filter)
    : locations;

  // Initial region type for MapView centered on Guadalajara
  const initialRegion: Region = {
    latitude: 20.7295168,
    longitude: -103.3697941,
    latitudeDelta: 0.005,
    longitudeDelta: 0.005,
  };

  return (
    <View style={styles.container}>
      <View style={styles.filterContainer}>
        {['All', 'Restaurant', 'Museum', 'Park'].map((category) => (
          <TouchableOpacity
            key={category}
            style={[styles.tag, filter === category && styles.activeTag]}
            onPress={() => setFilter(category === 'All' ? null : category)}
          >
            <Text style={styles.tagText}>{category}</Text>
          </TouchableOpacity>
        ))}
      </View>
      
      <MapView style={styles.map} initialRegion={initialRegion}>
        {filteredLocations.map((location) => (
          <Marker
            key={location.id}
            coordinate={{ latitude: location.latitude, longitude: location.longitude }}
            title={location.title}
          />
        ))}
      </MapView>
      
      <View style={styles.infoWindow}>
        <Text style={styles.infoText}>
          Guadalajara - coord.: {initialRegion.latitude.toFixed(4)}, {initialRegion.longitude.toFixed(4)}
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
    backgroundColor: '#4285F4',
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
