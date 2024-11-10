import React, { useState, useContext } from 'react';
import { View, TextInput, StyleSheet, Dimensions, Pressable, Button, Text } from 'react-native';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { AuthContext } from './Authentication';
import Maps from './Map';
import { ScrollView } from 'react-native-gesture-handler';

const screenHeight = Dimensions.get('window').height;
const RPH = (percentage: any) => {
  return (percentage / 100) * screenHeight;
};

const screenWidth = Dimensions.get('window').width;
const RPW = (percentage: any) => {
  return (percentage / 100) * screenWidth;
};

const AddNecesidad = () => {
  const [caducidad, setCaducidad] = useState('');
  const [tipo, setTipo] = useState('');
  const [tipoEncoded, setTipoEncoded] = useState('');
  const [fechaCreacion, setFechaCreacion] = useState('');
  const [prioridad, setPrioridad] = useState('');
  const [necesidad, setNecesidad] = useState('');

  const authContext = useContext(AuthContext); // Access context
  const db = authContext ? authContext.db : null; // Safely access db

  const addNecesidad = async () => {
    if (!db) {
      console.error("Firestore database not available.");
      return;
    }
    try {
      await addDoc(collection(db, 'necesidades'), {
        Caducidad: Timestamp.fromDate(new Date(caducidad)),
        Categoria: {
          Tipo: tipo,
          TipoEncoded: parseInt(tipoEncoded, 10)
        },
        Fecha_de_creacion: Timestamp.fromDate(new Date(fechaCreacion)),
        Prioridad: parseInt(prioridad, 10),
        Necesidad: necesidad
      });
      alert('Data added successfully');
    } catch (error) {
      console.error('Error adding document: ', error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.box}>
        <Text>Caducidad (YYYY-MM-DD):</Text>
        <TextInput
          value={caducidad}
          onChangeText={setCaducidad}
          placeholder="Caducidad"
          keyboardType="numeric"
        />

        <Text>Tipo de Categoria:</Text>
        <TextInput
          value={tipo}
          onChangeText={setTipo}
          placeholder="Tipo"
        />

        <Text>Tipo Encoded:</Text>
        <TextInput
          value={tipoEncoded}
          onChangeText={setTipoEncoded}
          placeholder="Tipo Encoded"
          keyboardType="numeric"
        />

        <Text>Fecha de Creacion (YYYY-MM-DD):</Text>
        <TextInput
          value={fechaCreacion}
          onChangeText={setFechaCreacion}
          placeholder="Fecha de Creacion"
          keyboardType="numeric"
        />

        <Text>Prioridad:</Text>
        <TextInput
          value={prioridad}
          onChangeText={setPrioridad}
          placeholder="Prioridad"
          keyboardType="numeric"
        />

        <Text>Necesidad:</Text>
        <TextInput
          value={necesidad}
          onChangeText={setNecesidad}
          placeholder="Necesidad"
        />

        <Button title="Add Necesidad" onPress={addNecesidad} />
        <Maps />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'left',
    flex: 1,
    fontFamily: 'Roboto',
  },
  box: {
    textAlign: 'left',
    borderColor: '#D9D9D9',
    borderWidth: 2,
    borderRadius: 8,
    padding: 24,
    gap: 24,
  },
  inputField: {
    padding: 10,
    borderWidth: 0.5,
    borderRadius: 5,
    paddingHorizontal: 16,
    paddingVertical: 8,
    width: RPW(60),
    borderColor: 'grey',
    lineHeight: 16,
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    width: RPW(60),
    backgroundColor: '#FF8400',
    borderRadius: 8,
    gap: 16,
    paddingVertical: 10,
  },
  group: {
    gap: 8,
    alignContent: 'center',
  },
  textButton:
  {
    color: 'white',
  },

  switchText: {
    width: RPW(40),
    textAlign: 'left',
    fontSize: 16,
  },

  linkStyle: {
    textAlign: 'left',
    textDecorationLine: 'underline',
    textDecorationStyle: 'solid',
  },

});

export default AddNecesidad;
