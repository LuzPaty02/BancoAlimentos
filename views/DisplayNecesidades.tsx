import React, { useEffect, useState, useContext } from 'react';
import { View, Text, ScrollView, Image, StyleSheet, Dimensions, Pressable, Modal, TextInput, Alert } from 'react-native';
import { collection, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { AuthContext } from './Authentication';

interface Necesidad {
  id: string;
  Necesidad: string;
  Categoria?: {
    Tipo: string;
  };
  Prioridad: number;
  Caducidad?: any;
  Fecha_de_creacion?: any;
}

const screenHeight = Dimensions.get('window').height;
const RPH = (percentage: any) => (percentage / 100) * screenHeight;
const screenWidth = Dimensions.get('window').width;
const RPW = (percentage: any) => (percentage / 100) * screenWidth;

const placeholder = {
  uri: 'https://media.licdn.com/dms/image/v2/D560BAQH0lQq_4TEh4g/company-logo_200_200/company-logo_200_200/0/1712160830518/redbamx_logo?e=2147483647&v=beta&t=96GI1KFEMnrHFqdQU0TZJRcc1WpbvYC7FN-hfB-HKh0',
};

const DisplayNecesidades = () => {
  const [necesidades, setNecesidades] = useState<Necesidad[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedNecesidad, setSelectedNecesidad] = useState<Necesidad | null>(null);
  const [editedNecesidad, setEditedNecesidad] = useState<Necesidad | null>(null);
  
  const authContext = useContext(AuthContext);
  const db = authContext?.db;

  const fetchNecesidades = async () => {
    if (!db) {
      console.error("Firestore database not available.");
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, 'necesidades'));
      const necesidadesData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Necesidad[];
      setNecesidades(necesidadesData);
    } catch (error) {
      console.error('Error fetching necesidades:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNecesidades();
  }, [db]);

  const handleNecesidadSelect = (necesidad: Necesidad) => {
    setSelectedNecesidad(necesidad);
    setEditedNecesidad({ ...necesidad });
    setModalVisible(true);
  };

  const handleUpdate = async () => {
    if (!db || !editedNecesidad) return;

    try {
      const necesidadRef = doc(db, 'necesidades', editedNecesidad.id);
      await updateDoc(necesidadRef, {
        Necesidad: editedNecesidad.Necesidad,
        Prioridad: editedNecesidad.Prioridad,
        Categoria: editedNecesidad.Categoria,
      });
      
      await fetchNecesidades();
      setModalVisible(false);
      Alert.alert('Success', 'Necessity updated successfully');
    } catch (error) {
      console.error('Error updating necessity:', error);
      Alert.alert('Error', 'Failed to update necessity');
    }
  };

  const handleDelete = async () => {
    if (!db || !selectedNecesidad) return;

    Alert.alert(
      'Confirm Deletion',
      'Are you sure you want to delete this necessity?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteDoc(doc(db, 'necesidades', selectedNecesidad.id));
              await fetchNecesidades();
              setModalVisible(false);
              Alert.alert('Success', 'Necessity deleted successfully');
            } catch (error) {
              console.error('Error deleting necessity:', error);
              Alert.alert('Error', 'Failed to delete necessity');
            }
          },
        },
      ]
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={{ padding: 12 }}>
        {loading ? (
          <Text>Loading...</Text>
        ) : necesidades.length > 0 ? (
          necesidades.map((necesidad) => (
            <Pressable 
              key={necesidad.id} 
              onPress={() => handleNecesidadSelect(necesidad)}
              style={({ pressed }) => [
                styles.list,
                pressed && { opacity: 0.7 }
              ]}
            >
              <View style={styles.listItem}>
                <Image source={placeholder} style={styles.imgstyle} />
                <View style={styles.group}>
                  <Text style={styles.necesidadTitle}>{necesidad.Necesidad}</Text>
                  <Text>Tipo: {necesidad.Categoria?.Tipo}</Text>
                  <Text>Prioridad: {necesidad.Prioridad}</Text>
                </View>
              </View>
            </Pressable>
          ))
        ) : (
          <Text>No necesidades found.</Text>
        )}
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit Necessity</Text>
            
            {editedNecesidad && (
              <View style={styles.formContainer}>
                <TextInput
                  style={styles.input}
                  value={editedNecesidad.Necesidad}
                  onChangeText={(text) => 
                    setEditedNecesidad({ ...editedNecesidad, Necesidad: text })}
                  placeholder="Necessity Name"
                />
                
                <TextInput
                  style={styles.input}
                  value={editedNecesidad.Prioridad.toString()}
                  onChangeText={(text) => 
                    setEditedNecesidad({ 
                      ...editedNecesidad, 
                      Prioridad: parseInt(text) || 0 
                    })}
                  placeholder="Priority"
                  keyboardType="numeric"
                />

                <TextInput
                  style={styles.input}
                  value={editedNecesidad.Categoria?.Tipo}
                  onChangeText={(text) => 
                    setEditedNecesidad({
                      ...editedNecesidad,
                      Categoria: { 
                        ...editedNecesidad.Categoria,
                        Tipo: text 
                      }
                    })}
                  placeholder="Category Type"
                />

                <View style={styles.modalButtons}>
                  <Pressable 
                    style={[styles.button, styles.updateButton]} 
                    onPress={handleUpdate}
                  >
                    <Text style={styles.buttonText}>Update</Text>
                  </Pressable>

                  <Pressable 
                    style={[styles.button, styles.deleteButton]} 
                    onPress={handleDelete}
                  >
                    <Text style={styles.buttonText}>Delete</Text>
                  </Pressable>

                  <Pressable 
                    style={[styles.button, styles.cancelButton]} 
                    onPress={() => setModalVisible(false)}
                  >
                    <Text style={styles.buttonText}>Cancel</Text>
                  </Pressable>
                </View>
              </View>
            )}
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    textAlign: 'left',
  },
  imgstyle:{
    borderRadius: 20,
    resizeMode: 'cover',
    width: RPW(20),
    height: RPH(10),
  },
  list: {
    textAlign: 'left',
    flexDirection: 'row',
    borderColor: '#D9D9D9',
    borderBottomWidth: 1,
    paddingBottom: 16,
    gap: 16,
  },
  necesidadTitle: {
    fontFamily: 'Roboto',
    fontWeight: 'bold',
    fontSize: 24,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 12,
    width: RPW(70),
    gap: 12,
  },
  button: {
    padding: 12,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 5,
  },
  group: {
    gap: 8,
    alignContent: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    width: RPW(90),
    maxHeight: RPH(80),
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  formContainer: {
    gap: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#D9D9D9',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  updateButton: {
    backgroundColor: '#FF8400',
  },
  deleteButton: {
    backgroundColor: '#FF0000',
  },
  cancelButton: {
    backgroundColor: '#666',
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

export default DisplayNecesidades;
