import React, { useContext } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { AuthContext } from './views/Authentication';
import LoginSignUp from './views/LoginSignup';
import Main from './views/Main';
import Entry from './views/Entry';
import Login from './views/Login';
import SignInView from './views/SignIn';
import Maps from './views/Map'; // Add your Map view
import DisplayNecesidades from './views/DisplayNecesidades';
import AddNecesidad from './views/AddNecesidad';

const Stack = createStackNavigator();

function RootNavigator() {
  const authContext = useContext(AuthContext);
  const user = authContext ? authContext.user : null;

  return (
    <Stack.Navigator>
      {user ? (
        // Group for authenticated user screens
        <Stack.Group>
          <Stack.Screen name="MainMenu" component={Main} options={{ headerShown: false }} />
          <Stack.Screen name="Maps" component={Maps} options={{ title: 'Display Map' }} />
          <Stack.Screen name="DisplayNecesidades" component={DisplayNecesidades} options={{ title: 'Display Necesidades' }} />
          <Stack.Screen name="AddNecesidad" component={AddNecesidad} options={{ title: 'Add Necesidad' }} />
        </Stack.Group>
      ) : (
        // Group for unauthenticated user screens
        <Stack.Group>
          <Stack.Screen name="Entry" component={Entry} options={{ headerShown: false }} />
          <Stack.Screen name="SignIn" component={SignInView} options={{ headerShown: false }} />
          <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
        </Stack.Group>
      )}
    </Stack.Navigator>
  );
}

export default RootNavigator;
