// MainMap.js
import React from 'react';
import { View, Button, StyleSheet, Text } from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { getAuth, signOut } from 'firebase/auth';

export default function Main() {
  const navigation = useNavigation<NavigationProp<any>>(); // Navigation prop for navigating between screens
  const auth = getAuth();

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
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  buttonContainer: {
    width: '80%',
  },
  button: {
    marginVertical: 5,
  },
});
