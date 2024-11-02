import React, { useContext } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { AuthContext } from './views/Authentication';
import LoginSignUp from './views/LoginSignup';
import MainMap from './views/Main';
import Entry from './views/Entry';

const Stack = createStackNavigator();

function RootNavigator() {
  const authContext = useContext(AuthContext);
  const user = authContext ? authContext.user : null;

  return (
    <Stack.Navigator>
      {// If authenticated, show the MainMenu
      }
      <Stack.Screen name="Entry" component={Entry} options={{ headerShown: false }}/>
      <Stack.Screen
        name="Login/SignUp"
        component={LoginSignUp}
        options={{ headerShown: false }}
      />
      <Stack.Screen name="MainMenu" component={MainMap} />
      
    </Stack.Navigator>
  );
}

export default RootNavigator;
