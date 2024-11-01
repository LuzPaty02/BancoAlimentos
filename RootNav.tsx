import React, { useContext } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { AuthContext } from './views/Authentication';
import LoginSignUp from './views/LoginSignup';
import MainMenu from './views/Main';
import entry from './views/Entry';
import Entry from './views/Entry';

const Stack = createStackNavigator();

function RootNavigator() {
  const authContext = useContext(AuthContext);
  const user = authContext ? authContext.user : null;

  return (
    <Stack.Navigator>
      {user ? (
        // If authenticated, show the MainMenu
        <Stack.Screen name="MainMenu" component={MainMenu} />
      ) : (
        // If not authenticated, show the SignUp screen
        <Stack.Screen
          name="Login/SignUp"
          component={Entry}
          options={{ headerShown: false }}
        />
      )}
    </Stack.Navigator>
  );
}

export default RootNavigator;
