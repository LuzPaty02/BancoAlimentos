import React, { useState, useContext } from 'react';
import { View, TextInput, Text, StyleSheet, Image, Dimensions, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const screenHeight = Dimensions.get('window').height;
const RPH = (percentage: any) => {
  return (percentage / 100) * screenHeight;
};

const screenWidth = Dimensions.get('window').width;
const RPW = (percentage: any) => {
  return (percentage / 100) * screenWidth;
};

const logo = {
  uri: 'https://bamx.org.mx/wp-content/uploads/2023/12/Logo-RED-BAMX_Mesa-de-trabajo-1.png',
  width: RPW(90),
  height: RPH(20),
};

const Entry: React.FC = () => {
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <Image source={logo} style={{ resizeMode: 'contain' }}></Image>
      <Pressable style={styles.button} onPress={() => {
        navigation.navigate('Login');
      }}>
        <Text style={styles.textButton}> Login </Text>
      </Pressable>
      <Pressable style={styles.button2} onPress={() => {
        navigation.navigate('SignIn');
      }}>
        <Text style={styles.textButton2}> Sign Up </Text>
      </Pressable>
    </View >
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    fontFamily: 'Roboto',
  },
  inputField: {
    margin: 5,
    padding: 10,
    borderWidth: 0.5,
    borderRadius: 5,
    width: 200,
    borderColor: 'grey',
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    width: RPW(80),
    backgroundColor: '#FF8400',
    borderRadius: 100,
    paddingVertical: 10,
  },
  button2: {
    alignItems: 'center',
    justifyContent: 'center',
    margin: 20,
    width: RPW(80),
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: '#FF8400',
    borderRadius: 100,
    paddingVertical: 10,
  },
  textButton:
  {
    color: 'white',
  },
  textButton2:
  {
    color: '#FF8400',
  },

  switchText: {
    marginVertical: 10,
  },
});

export default Entry;
