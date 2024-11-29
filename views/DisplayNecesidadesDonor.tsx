import React, { useEffect, useState, useContext } from 'react';
import { View, Text, ScrollView, Image, StyleSheet, Dimensions, Pressable, Modal, TextInput } from 'react-native';
import { collection, getDocs, getDoc, doc, addDoc, Timestamp } from 'firebase/firestore';
import { AuthContext } from './Authentication';
import { useSubmissionTrigger } from './SubmissionContext'; 
import { encryptData } from '../encrypt';


interface Necesidad {
  id: string;
  Necesidad: string;
  Categoria?: {
    Tipo: string;
    TipoEncoded: number;
  };
  Prioridad: number;
  Caducidad?: any;
  Fecha_de_creacion?: any;
  Descripcion?: string;
  Cantidad_requerida?: number;
}

interface DonationRequest {
  necesidadId: string;
  necesidadName: string;
  donorId: string;
  cantidad: number;
  estado: string;
  fechaSolicitud: Timestamp;
  ubicacion: string;
}

const screenHeight = Dimensions.get('window').height;
const RPH = (percentage: number) => (percentage / 100) * screenHeight;

const screenWidth = Dimensions.get('window').width;
const RPW = (percentage: number) => (percentage / 100) * screenWidth;

const placeholder = {
  uri: 'https://media.licdn.com/dms/image/v2/D560BAQH0lQq_4TEh4g/company-logo_200_200/company-logo_200_200/0/1712160830518/redbamx_logo?e=2147483647&v=beta&t=96GI1KFEMnrHFqdQU0TZJRcc1WpbvYC7FN-hfB-HKh0',
};

const DisplayNecesidadesDonor = () => {
  const [necesidades, setNecesidades] = useState<Necesidad[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedNecesidad, setSelectedNecesidad] = useState<Necesidad | null>(null);
  const [donationQuantity, setDonationQuantity] = useState('');
  const [submitting, setSubmitting] = useState(false);

 
  const [location, setLocation] = useState<Location | null>(null);
  
  const authContext = useContext(AuthContext);
  const db = authContext?.db;
  const currentUser = authContext?.user;

  useEffect(() => {
    const fetchNecesidades = async () => {
      if (!db) {
        console.error('Firestore database not available.');
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

    fetchNecesidades();
  }, [db]);

  const handleNecesidadPress = (necesidad: Necesidad) => {
    setSelectedNecesidad(necesidad);
    setModalVisible(true);
  };

  useEffect(() => {
    const fetchUserLocation = async () => {
      if (!db || !currentUser) return;

      try {
        const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
        // console.log('UserDoc:', userDoc.data());
        if (userDoc.exists()) {
          const encryptedData = userDoc.data().ubicacion;
          setLocation(encryptedData); // Store the user's location in state
          console.log('User location:', encryptedData);
        }
      } catch (error) {
        console.error('Error fetching user location:', error);
      }
    };

    fetchUserLocation();
  }, [db, currentUser]);

  const { setTrigger } = useSubmissionTrigger();

  const handleDonationSubmit = async () => {
    if (!db || !currentUser || !selectedNecesidad || !donationQuantity) {
      console.error('Missing required information for donation');
      return;
    }

    setSubmitting(true);


    try {
      // Fetch the user's location directly during submission
      const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
      let userUbicacion: { latitude: number; longitude: number } | null = null;
  
      if (userDoc.exists()) {
        userUbicacion = userDoc.data().ubicacion || { latitude: 0, longitude: 0 }; // Default to 0 if no location
      } else {
        console.warn("User document does not exist or missing ubicacion field.");
      }

      const encryptedUbicacion = await encryptData(JSON.stringify(userUbicacion || { latitude: 0, longitude: 0 }));

      const donationRequest: DonationRequest = {
        necesidadId: selectedNecesidad.id,
        necesidadName: selectedNecesidad.Necesidad,
        donorId: currentUser.uid,
        cantidad: Number(donationQuantity),
        estado: 'pendiente',
        fechaSolicitud: Timestamp.now(),
        ubicacion: encryptedUbicacion,
      };

      await addDoc(collection(db, 'donationRequests'), donationRequest);
      setModalVisible(false);
      setDonationQuantity('');
      alert('Donation request submitted successfully!');
      setTrigger(true);
    } catch (error) {
      console.error('Error submitting donation request:', error);
      alert('Error submitting donation request. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };



  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={{ padding: 12 }}>
        {loading ? (
          <Text>Loading...</Text>
        ) : necesidades.length > 0 ? (
          necesidades.map((necesidad) => (
            <Pressable key={necesidad.id} onPress={() => handleNecesidadPress(necesidad)}>
              <View style={styles.list}>
                <View style={styles.listItem}>
                  <Image source={placeholder} style={styles.imgstyle} />
                  <View style={styles.group}>
                    <Text style={styles.necesidadTitle}>{necesidad.Necesidad}</Text>
                    <Text>Tipo: {necesidad.Categoria?.Tipo || 'No especificado'}</Text>
                    <Text>Prioridad: {necesidad.Prioridad}</Text>
                  </View>
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
            {selectedNecesidad && (
              <>
                <Text style={styles.modalTitle}>{selectedNecesidad.Necesidad}</Text>
                <Image source={placeholder} style={styles.modalImage} />
                <View style={styles.modalInfo}>
                  <Text>Tipo: {selectedNecesidad.Categoria?.Tipo || 'No especificado'}</Text>
                  <Text>Prioridad: {selectedNecesidad.Prioridad}</Text>
                  <Text>
                    Cantidad Requerida: {selectedNecesidad.Cantidad_requerida || 'No especificada'}
                  </Text>

                  <TextInput
                    style={styles.quantityInput}
                    placeholder="Cantidad a donar"
                    keyboardType="numeric"
                    value={donationQuantity}
                    onChangeText={setDonationQuantity}
                  />

                  <Pressable
                    style={[styles.button, submitting && styles.buttonDisabled]}
                    onPress={handleDonationSubmit}
                    disabled={submitting}
                  >
                    <Text style={styles.buttonText}>
                      {submitting ? 'Submitting...' : 'Subir solicitud de donación'}
                    </Text>
                  </Pressable>

                  <Pressable
                    style={styles.closeButton}
                    onPress={() => setModalVisible(false)}
                  >
                    <Text style={styles.closeButtonText}>Cerrar</Text>
                  </Pressable>
                </View>
              </>
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

    group: {
        gap: 8,
        alignContent: 'center',
      },
    
    listItem: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        paddingHorizontal: 16,
        paddingVertical: 12,
        width: RPW(70),
        gap: 12,
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
    marginBottom: 15,
    textAlign: 'center',
  },
  modalImage: {
    width: '100%',
    height: RPH(20),
    borderRadius: 10,
    marginBottom: 15,
  },
  modalInfo: {
    gap: 10,
  },
  quantityInput: {
    borderWidth: 1,
    borderColor: '#D9D9D9',
    borderRadius: 8,
    padding: 10,
    marginTop: 10,
  },
  button: {
    backgroundColor: '#FF8400',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 15,
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  closeButton: {
    backgroundColor: '#f0f0f0',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  closeButtonText: {
    color: '#333',
    fontWeight: 'bold',
  },
});

export default DisplayNecesidadesDonor;