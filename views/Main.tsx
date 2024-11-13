import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { getAuth, signOut } from 'firebase/auth';
import AddNecesidad from './AddNecesidad';

export default function Main() {
  const auth = getAuth();
  const navigation = useNavigation<NavigationProp<any>>(); // Navigation prop for navigating between screens

  const handleSignOut = () => {
    signOut(auth)
      .then(() => {
        console.log('User signed out');
      })
      .catch((error) => {
        console.error('Error signing out:', error);
      });
  };

  return (
    <View style={styles.container}>
      <Text>Main Menu</Text>
      <View style={styles.buttonContainer}>
        <View style={styles.button}>
          <Button title="Display Map" onPress={() => navigation.navigate('Maps')} />
        </View>
        <View style={styles.button}>
          <Button title="Display Necesidades" onPress={() => navigation.navigate('DisplayNecesidades')} />
        </View>
        <View style={styles.button}>
          <Button title="Add Necesidad" onPress={() => navigation.navigate('AddNecesidad')} />
        </View>
        <View style={styles.button}>
          <Button title="Sign Out" onPress={handleSignOut} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, // Ensures the container takes up the full screen
    padding: 40,
    justifyContent: 'space-between', // Spreads out items
    backgroundColor: '#ffffff',
  },
  buttonContainer: {
    justifyContent: 'center',
    
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
  },
  button: {
    marginBottom: 20, // Adds some margin to the bottom
    justifyContent: 'flex-end',
  },
});
