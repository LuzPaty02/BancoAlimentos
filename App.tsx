import React from 'react';
import Authentication from './views/Authentication';
import { SubmissionTriggerProvider } from './views/SubmissionContext';
import { NavigationContainer } from '@react-navigation/native';
import 'react-native-get-random-values';
import RootNav from './RootNav';


export default function App() {
  return (
    <Authentication>
      <SubmissionTriggerProvider> {/* Wrap the app in the provider */}
        <NavigationContainer>
          <RootNav />
        </NavigationContainer>
      </SubmissionTriggerProvider>
    </Authentication>
  );
}