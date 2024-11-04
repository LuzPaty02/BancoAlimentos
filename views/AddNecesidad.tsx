import React, { useState, useContext } from 'react';
import { View, TextInput, Button, Text } from 'react-native';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { AuthContext } from './Authentication';

const AddNecesidad = () => {
  const [caducidad, setCaducidad] = useState('');
  const [tipo, setTipo] = useState('');
  const [tipoEncoded, setTipoEncoded] = useState('');
  const [fechaCreacion, setFechaCreacion] = useState('');
  const [prioridad, setPrioridad] = useState('');
  const [necesidad, setNecesidad] = useState('');

  const { db } = useContext(AuthContext) || {}; // Access db from context

  const addNecesidad = async () => {
    if (!db) {
      console.error("Firestore database not available.");
      return;
    }
    try {
      await addDoc(collection(db, 'necesidades'), {
        caducidad: Timestamp.fromDate(new Date(caducidad)),
        categoria: {
          tipo,
          tipoEncoded: parseInt(tipoEncoded, 10)
        },
        fecha_de_creacion: Timestamp.fromDate(new Date(fechaCreacion)),
        prioridad: parseInt(prioridad, 10),
        necesidad
      });
      alert('Data added successfully');
    } catch (error) {
      console.error('Error adding document: ', error);
    }
  };

  return (
    <View>
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
    </View>
  );
};

export default AddNecesidad;
