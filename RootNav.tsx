import React, { useContext } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { AuthContext } from './views/Authentication';
import Main from './views/Main';
import Entry from './views/Entry';
import Login from './views/Login';
import SignInView from './views/SignIn';
import Maps from './views/Map';
import DisplayNecesidades from './views/DisplayNecesidades';
import AddNecesidad from './views/AddNecesidad';
import DonorProfile from './views/DonorProfile';
import UpdateLocation from './views/UpdateLocation';
import Company from './views/Company';

const Stack = createStackNavigator();

function RootNavigator() {
  const authContext = useContext(AuthContext);
  const user = authContext ? authContext.user : null;

  return (
    <Stack.Navigator>
      {user ? (
        // Group for authenticated user screens
        <Stack.Group>
          <Stack.Screen name="MainMenu" component={Main} options={{ headerShown: true }} />
          <Stack.Screen name="Company" component={Company} options={{headerShown: true}}/>
          <Stack.Screen name="Maps" component={Maps} options={{ title: 'Display Map' }} />
          <Stack.Screen name="DisplayNecesidades" component={DisplayNecesidades} options={{ title: 'Necesidades Publicadas' }} />
          <Stack.Screen name="AddNecesidad" component={AddNecesidad} options={{ title: 'Agregar Necesidad' }} />
          <Stack.Screen name="DonorProfile" options={{ title: 'Perfil de donador' }} >
            {props => <DonorProfile {...props} userId={user.uid} />}
          </Stack.Screen>
          <Stack.Screen
            name="UpdateLocation"
            options={{ title: 'Update Location' }}
          >
            {props => <UpdateLocation {...props} userId={user.uid} />}
          </Stack.Screen>

        </Stack.Group>
        // Group for company account

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
