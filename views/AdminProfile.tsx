import React, { useState, useContext } from 'react';
import { View, TextInput, Text, StyleSheet, Pressable } from 'react-native';
import { AuthContext } from './Authentication';
import AddNecesidad from './AddNecesidad';
import { collection, addDoc } from 'firebase/firestore';

const AdminProfile: React.FC = () => {
  const authContext = useContext(AuthContext);
  if (!authContext) {
    throw new Error("AuthContext is null");
  }

  const { db, user } = authContext;
  const [necesidad, setNecesidad] = useState('');
  const [tipo, setTipo] = useState('');
  const [tipoEncoded, setTipoEncoded] = useState('');
  const [prioridad, setPrioridad] = useState('');
  const [caducidad, setCaducidad] = useState('');

  const [error, setError] = useState<string | null>(null);
  const handleError = (err: unknown) => {
    const errorMessage = (err as Error).message;
    setError(errorMessage);
  };

  const handleAddNecesidad = async () => {
    if (!necesidad || !tipo || !tipoEncoded || !prioridad || !caducidad) {
      alert("Por favor, completa todos los campos.");
      return;
    }

    try {
      const docRef = await addDoc(collection(db, 'necesidades'), {
        necesidad: necesidad,
        categoria: {
          tipo: tipo,
          tipoEncoded: parseInt(tipoEncoded),
        },
        prioridad: parseInt(prioridad),
        caducidad: new Date(caducidad),
        'fecha de creacion': new Date(),
      });
      alert(`Necesidad añadida con ID: ${docRef.id}`);
      setNecesidad('');
      setTipo('');
      setTipoEncoded('');
      setPrioridad('');
      setCaducidad('');
    } catch (error) {
      handleError(error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Admin Profile - Añadir Necesidad</Text>
      <TextInput
        style={styles.input}
        placeholder="Necesidad"
        value={necesidad}
        onChangeText={setNecesidad}
      />
      <TextInput
        style={styles.input}
        placeholder="Tipo"
        value={tipo}
        onChangeText={setTipo}
      />
      <TextInput
        style={styles.input}
        placeholder="Tipo Encoded (número)"
        keyboardType="numeric"
        value={tipoEncoded}
        onChangeText={setTipoEncoded}
      />
      <TextInput
        style={styles.input}
        placeholder="Prioridad (número)"
        keyboardType="numeric"
        value={prioridad}
        onChangeText={setPrioridad}
      />
      <TextInput
        style={styles.input}
        placeholder="Caducidad (YYYY-MM-DD)"
        value={caducidad}
        onChangeText={setCaducidad}
      />
      <Pressable style={styles.button} onPress={handleAddNecesidad}>
        <Text style={styles.buttonText}>Añadir Necesidad</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
  },
  input: {
    width: '80%',
    padding: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    marginBottom: 12,
  },
  button: {
    backgroundColor: '#FF8400',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default AdminProfile;