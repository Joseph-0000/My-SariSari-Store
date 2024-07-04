import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { firebase } from '../config';

const AddToInventory = () => {
    const [itemName, setItemName] = useState('');
    const [itemAmount, setItemAmount] = useState('');
    const [itemPrice, setItemPrice] = useState('');
    const [itemStockWarning, setItemStockWarning] = useState('');

    const handleAddToInventory = async () => {
        const parsedPrice = parseFloat(itemPrice);
        const parsedAmount = parseInt(itemAmount);
        const parsedStockWarning = parseInt(itemStockWarning);

        if (!itemName) {
            Alert.alert('Error', 'Item Name is required.');
        } else if (isNaN(parsedPrice)) {
            Alert.alert('Error', 'Invalid Price. Please enter a valid number.');
        } else if (isNaN(parsedAmount)) {
            Alert.alert('Error', 'Invalid Amount. Please enter a valid number.');
        } else if (isNaN(parsedStockWarning)) {
            Alert.alert('Error', 'Invalid Stock Warning. Please enter a valid number.');
        } else {
            const user = firebase.auth().currentUser;
            const uid = user.uid;

            // Add the new item to Firebase Firestore
            await firebase.firestore().collection('users').doc(uid).collection('Items').doc().set({
                itemName,
                itemAmount: parsedAmount,
                itemPrice: parsedPrice,
                itemStockWarning: parsedStockWarning,
            });

            setItemName('');
            setItemAmount('');
            setItemPrice('');
            setItemStockWarning('');
            Alert.alert('Success', 'Item added to inventory.');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>ADD ITEM</Text>
            <Text style={styles.titleText}>Name</Text>
            <TextInput
                style={styles.textInput}
                placeholder="Item Name"
                onChangeText={setItemName}
                value={itemName}
            />
            <Text style={styles.titleText}>Price</Text>
            <TextInput
                style={styles.textInput}
                placeholder="Item Price"
                onChangeText={setItemPrice}
                value={itemPrice}
                keyboardType="numeric"
            />
            <Text style={styles.titleText}>Quantity</Text>
            <TextInput
                style={styles.textInput}
                placeholder="Item Amount"
                onChangeText={setItemAmount}
                value={itemAmount}
                keyboardType="numeric"
            />
            <Text style={styles.titleText}>Low Stock Warning</Text>
            <TextInput
                style={styles.lowStockText}
                placeholder="Item Stock Warning"
                onChangeText={setItemStockWarning}
                value={itemStockWarning}
                keyboardType="numeric"
            />

            <TouchableOpacity style={styles.editButtons3} onPress={handleAddToInventory}>
                <Text style={styles.editButtonsText}>Add to Inventory</Text>
            </TouchableOpacity>
        </View>
    );
};

export default AddToInventory;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        padding: 35,
        backgroundColor: '#D5CEC9',
        marginTop: -30,
    },
    title: {
        fontWeight: 'bold',
        color: '#4b2b12',
        marginTop:-15,
        paddingBottom: 20,
        fontSize: 35,
        textAlign: 'center',

    },
    titleText: {
        color: '#4b2b12',
        fontSize: 16,
        fontWeight: 'bold',
        alignSelf: 'flex-start',
    },
    textInput: {
        color: '#4b2b12',
        fontSize: 16,
        marginBottom: 10,
        backgroundColor: '#fffefb',
        height: 45,
        paddingLeft: 10,
        borderRadius: 10,
        paddingVertical: 10,
        width: 350,
    },
    lowStockText: {
        color: '#4b2b12',
        fontSize: 16,
        marginBottom: 10,

        backgroundColor: '#fffefb',
        height: 45,
        paddingLeft: 10,
        borderRadius: 10,
        paddingVertical: 10,
        width: 350,
    },
    editButtons3: {
        marginTop: 300,
        width: 350,
        paddingTop: 10,
        paddingBottom: 10,
        backgroundColor: '#9d5515',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
    },
    editButtonsText: {
        color: '#4b2b12',
        fontSize: 16,
        fontWeight: 'bold',
        fontStyle: 'italic',
    },
});
