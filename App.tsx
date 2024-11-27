import React from 'react';
import Authentication from './views/Authentication';
import { NavigationContainer } from '@react-navigation/native';
import 'react-native-get-random-values';
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