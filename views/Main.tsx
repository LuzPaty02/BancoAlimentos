// screens/Main.tsx
import React from 'react';
import { View, Text, StyleSheet, Pressable, Image, Dimensions } from 'react-native';
import { SwiperFlatList } from 'react-native-swiper-flatlist';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { getAuth, signOut } from 'firebase/auth';

// Define types
type RootStackParamList = {
  Login: undefined;
  Main: undefined;
  Maps: undefined;
  DisplayNecesidades: undefined;
  AddNecesidad: undefined;
  DonorProfile: undefined;
};

type ImageType = number; // for require('./slider/1.png')

const ImageSlider: React.FC<{ images: ImageType[] }> = ({ images }) => {
  return (
    <View style={styles.sliderContainer}>
      <SwiperFlatList
        showPagination
        paginationStyleItem={{ width: 8, height: 8 }}
        paginationActiveColor="#FF8400"
        paginationDefaultColor="#CCC"
        autoplay
        autoplayDelay={3000} // 3 seconds
        autoplayLoop
        data={images}
        renderItem={({ item }) => (
          <View style={[styles.slide, { width: Dimensions.get('window').width - 40 }]}>
            <Image source={item} style={styles.image} />
          </View>
        )}
      />
    </View>
  );
};

export default function Main() {
  const auth = getAuth();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      console.log('User signed out');
      navigation.navigate('Login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const images: ImageType[] = [
    require('./slider/1.png'),
    require('./slider/2.png')
  ];

  return (
    <View style={styles.container}>
      <ImageSlider images={images} />
      <View style={styles.buttonContainer}>
        <Pressable 
          style={({ pressed }) => [
            styles.button,
            pressed && styles.buttonPressed
          ]} 
          onPress={() => navigation.navigate('Maps')}
        >
          <Text style={styles.buttonText}>Display Map</Text>
        </Pressable>
        
        <Pressable 
          style={({ pressed }) => [
            styles.button,
            pressed && styles.buttonPressed
          ]} 
          onPress={() => navigation.navigate('DisplayNecesidades')}
        >
          <Text style={styles.buttonText}>Necesidades</Text>
        </Pressable>
        
        <Pressable 
          style={({ pressed }) => [
            styles.button,
            pressed && styles.buttonPressed
          ]} 
          onPress={() => navigation.navigate('AddNecesidad')}
        >
          <Text style={styles.buttonText}>Agregar Necesidad</Text>
        </Pressable>
        
        <Pressable 
          style={({ pressed }) => [
            styles.button,
            pressed && styles.buttonPressed
          ]} 
          onPress={() => navigation.navigate('DonorProfile')}
        >
          <Text style={styles.buttonText}>Donor Profile</Text>
        </Pressable>
        
        <Pressable 
          style={({ pressed }) => [
            styles.button,
            pressed && styles.buttonPressed
          ]} 
          onPress={handleSignOut}
        >
          <Text style={styles.buttonText}>Sign Out</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'space-between',
    backgroundColor: '#ffffff',
  },
  sliderContainer: {
    height: 200,
    marginVertical: 20,
  },
  buttonContainer: {
    marginTop: 20,
    marginBottom: 40,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 0,
    marginTop: 20,
    color: '#333',
  },
  button: {
    marginBottom: 15,
    backgroundColor: '#FF8400',
    borderRadius: 8,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  buttonPressed: {
    backgroundColor: '#E67600',
    transform: [{ scale: 0.98 }],
  },
  buttonText: {
    color: '#ffffff',
    textAlign: 'center',
    padding: 12,
    fontSize: 16,
    fontWeight: 'bold',
  },
  slide: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    borderRadius: 8,
  },
});