import React, { useState, useContext } from 'react';
import { View, TextInput, Text, Button, Dimensions, StyleSheet, Pressable } from 'react-native';
import { getAuth, signOut } from 'firebase/auth';
import { AuthContext } from './Authentication';

const screenHeight = Dimensions.get('window').height;
const RPH = (percentage: any) => {
    return (percentage / 100) * screenHeight;
};

const screenWidth = Dimensions.get('window').width;
const RPW = (percentage: any) => {
    return (percentage / 100) * screenWidth;
};

export default function NecesityCreation() {
    return (
        <View style={styles.container}>
            <Text style={styles.header}>Crear Donacion</Text>
            <View style={styles.button}>
                <Pressable onPress={console.log}>
                    <Text> Realizar Donacion</Text>
                </Pressable>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        fontFamily: 'Roboto',
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 16,
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
        margin: 20,
        width: RPW(80),
        backgroundColor: '#FF8400',
        borderRadius: 100,
        paddingVertical: 10,
    },

    textButton:
    {
        color: 'white',
    },

    switchText: {
        marginVertical: 10,
    },

});