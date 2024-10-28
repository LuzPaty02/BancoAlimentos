import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, Image } from 'react-native';
import { getFirestore, collection, getDocs } from "firebase/firestore";

export default function AnimalList() {
  interface Animal {
    id: string;  // Make sure 'id' is part of the Animal interface
    name: string;
    age: number;
    picture: string;
  }

  const [animals, setAnimals] = useState<Animal[]>([]);
  const [loading, setLoading] = useState(true);
  const db = getFirestore();

  useEffect(() => {
    const fetchAnimals = async () => {
      try {
        const colRef = collection(db, "Animales");
        const snapshot = await getDocs(colRef);
        const animalsData = snapshot.docs.map(doc => ({
          id: doc.id,  // Use Firestore document ID as the 'id'
          ...doc.data()
        } as Animal));
        setAnimals(animalsData);
        console.log("Animals fetched:", animalsData);
      } catch (error) {
        console.error("Error fetching documents from Firestore:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnimals();
  }, [db]);

  const renderItem = ({ item }: { item: Animal }) => (
    <View style={styles.item}>
      <Text style={styles.name}>{item.name}</Text>
      <Image source={{ uri: item.picture }} style={styles.image} />
      <Text>Age: {item.age}</Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Animal List</Text>
      {animals.length > 0 ? (
        <FlatList
          data={animals}
          keyExtractor={(item) => item.id}  // Use 'id' as the unique key
          renderItem={renderItem}
          contentContainerStyle={{ flexGrow: 1 }}
        />
      ) : (
        <Text>No animals found.</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#ffffff',
  },
  header: {
    fontSize: 24,
    color: '#000',
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  item: {
    padding: 20,
    borderBottomWidth: 1,
    borderColor: '#ccc',
    alignItems: 'center',
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  image: {
    width: 100,
    height: 100,
    marginBottom: 10,
    borderRadius: 10,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
