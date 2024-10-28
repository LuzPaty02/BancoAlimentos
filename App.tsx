import React from 'react';
import { StyleSheet } from 'react-native';
import Authentication from '././views/authentication';
import { NavigationContainer } from '@react-navigation/native';
import RootNav from './RootNav';


export default function App() {
  return (
    <Authentication>
      <NavigationContainer>
        <RootNav/>
      </NavigationContainer>
    </Authentication>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
