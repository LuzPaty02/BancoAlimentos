import React, { useContext, useEffect, useState } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { AuthContext, db } from './views/Authentication';
import { doc, getDoc } from 'firebase/firestore';
import MainBamx from './views/MainBamx';
import DisplayDonors from './views/DisplayDonors';
import Entry from './views/Entry';
import Login from './views/Login';
import SignInView from './views/SignIn';
import Maps from './views/Map';
import DisplayNecesidades from './views/DisplayNecesidades';
import AddNecesidad from './views/AddNecesidad';
import DonorProfile from './views/DonorProfile';
import UpdateLocation from './views/UpdateLocation';
import Company from './views/Company';
import DisplayNecesidadesDonor from './views/DisplayNecesidadesDonor';

const Stack = createStackNavigator();

type RootStackParamList = {
  Login: undefined;
  Main: undefined;
  Maps: undefined; // Asegúrate de que esté aquí
  DisplayNecesidades: undefined;
  AddNecesidad: undefined;
  DonorProfile: undefined;
};

function RootNavigator() {
  const authContext = useContext(AuthContext);
  const user = authContext ? authContext.user : null;

  const [accountType, setAccountType] = useState(null);

  useEffect(() => {
    const fetchAccountType = async () => {
      if (user) {
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            setAccountType(userDoc.data().accountType);
          } else {
            console.error('User document does not exist');
          }
        } catch (error) {
          console.error('Error fetching account type:', error);
        }
      }
    };

    fetchAccountType();
  }, [user]);

  if (!user) {
    return (
      <Stack.Navigator>
        <Stack.Screen name="Entry" component={Entry} options={{ headerShown: false }} />
        <Stack.Screen name="SignIn" component={SignInView} options={{ headerShown: false }} />
        <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
      </Stack.Navigator>
    );
  }

  if (accountType === null) {
    return null;
  }

  return (
    <Stack.Navigator>
      {accountType === 'food bank staff' && (
        <Stack.Group>
          <Stack.Screen name="MainBamx" component={MainBamx} options={{ title: 'BAMX Dashboard' }} />
          <Stack.Screen name="DisplayNecesidades" component={DisplayNecesidades} options={{ title: 'Necesidades Publicadas' }} />
          <Stack.Screen name="Maps" component={Maps} options={{ title: 'Display Map' }} />
          <Stack.Screen name="DisplayDonors" component={DisplayDonors} options={{ title: 'Agregar Necesidad' }} />
          <Stack.Screen name="AddNecesidad" component={AddNecesidad} options={{ title: 'Organizaciones donantes activas' }} />
        </Stack.Group>
      )}
      {accountType === 'donor company' && (
        <Stack.Group>
          <Stack.Screen name="Company" component={Company} options={{ title: 'Donor Dashboard' }} />
          <Stack.Screen name="DisplayNecesidadesDonor" component={DisplayNecesidadesDonor} options={{ title: 'Necesidades Publicadas' }} />
          <Stack.Screen name="DonorProfile" options={{ title: 'Perfil de Donador' }}>
            {props => <DonorProfile {...props} userId={user.uid} />}
          </Stack.Screen>
          <Stack.Screen name="UpdateLocation" options={{ title: 'Actualizar Ubicación' }}>
            {props => <UpdateLocation {...props} userId={user.uid} />}
          </Stack.Screen>
        </Stack.Group>
      )}
    </Stack.Navigator>
  );
}

export default RootNavigator;