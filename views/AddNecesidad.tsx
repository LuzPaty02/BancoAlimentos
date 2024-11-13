import React, { useState, useContext } from 'react';
import { View, TextInput, StyleSheet, Dimensions, Pressable, Button, Text } from 'react-native';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { AuthContext } from './Authentication';
import DateTimePicker from 'react-native-ui-datepicker';
import dayjs from 'dayjs';
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
  const [caducidad, setCaducidad] = useState(dayjs());
  const [tipo, setTipo] = useState('');
  const [tipoEncoded, setTipoEncoded] = useState('');
  const [fechaCreacion, setFechaCreacion] = useState(dayjs().toISOString());
  const [prioridad, setPrioridad] = useState('');
  const [necesidad, setNecesidad] = useState('');

  const authContext = useContext(AuthContext); // Access context
  const db = authContext ? authContext.db : null; // Safely access db

  const handleDateChange = ({ date }: { date: Date }) => {
    if (date instanceof Date && !isNaN(date.getTime())) {
      setCaducidad(date as any);
    } else {
      console.error("Invalid date selected:", date);
    }
  };


  const addNecesidad = async () => {
    if (!db) {
      console.error("Firestore database not available.");
      return;
    }
    // Validate caducidad and fechaCreacion
    const validCaducidad = caducidad.isValid() ? caducidad.toDate() : new Date();
    const validFechaCreacion = dayjs(fechaCreacion).isValid()
      ? dayjs(fechaCreacion).toDate()
      : new Date();

    try {
      await addDoc(collection(db, 'necesidades'), {
        caducidad: validCaducidad,
        Categoria: {
          Tipo: tipo,
          TipoEncoded: parseInt(tipoEncoded, 10)
        },
        Fecha_de_creacion: Timestamp.fromDate(new Date(validFechaCreacion)),
        Prioridad: parseInt(prioridad, 10),
        Necesidad: necesidad
      });
      alert('Data added successfully');
    } catch (error) {
      console.error('Error adding document: ', error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.box}>
        <View style={styles.group}>
          <Text>Caducidad:</Text>
          <View style={styles.calendarContainer}>
            <DateTimePicker
              date={caducidad.toDate()}
              mode="single"
              selectedItemColor='#FF8400'
              minDate={new Date()}
              headerContainerStyle={{ borderColor: 'grey', borderWidth: 1 }}

              onChange={(params) => {
                if (params?.date) {
                  const normalizedDate = dayjs(params.date); // Ensure properly handled
                  console.log("Valid date selected:", normalizedDate.toISOString());
                  setCaducidad(normalizedDate);
                } else {
                  console.error("Invalid date selected:", params?.date);
                }
              }}
            />
          </View>
        </View>
        <View style={styles.group}>
          <Text>Categoria de la necesidad:</Text>
          <TextInput style={styles.inputField}
            value={tipo}
            onChangeText={setTipo}
            placeholder="Tipo"
          />
        </View>

        <View style={styles.group}>
          <Text>Prioridad:</Text>
          <TextInput style={styles.inputField}
            value={prioridad}
            onChangeText={setPrioridad}
            placeholder="Prioridad"
            keyboardType="numeric"
          />
        </View>
        <View style={styles.group}>
          <Text>Nombre de la necesidad:</Text>
          <TextInput style={styles.inputField}
            value={necesidad}
            onChangeText={setNecesidad}
            placeholder="Necesidad"
          />
        </View>
        <Pressable style={styles.button} onPress={addNecesidad}>
          <Text style={styles.textButton}> Add Necesidad </Text>
        </Pressable>
      </View>
    </View>
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
  title: {
    fontSize: 24,
    marginBottom: 16,

  },
  calendarContainer: {
    borderBlockColor: 'grey',
    borderRadius: 5,
    borderWidth: 1
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
    width: RPW(80),
    borderColor: 'grey',
    lineHeight: 16,
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    width: RPW(80),
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
