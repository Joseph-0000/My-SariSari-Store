import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { firebase } from '../config';

const ItemFieldsScreen = ({ route, navigation }) => {
    const { item } = route.params;
    const [fields, setFields] = useState(item);

    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleString('en-US', {
        hour: 'numeric',
        minute: 'numeric',
        hour12: true,
        month: 'numeric',
        day: 'numeric',
        year: 'numeric',
    });

    const handleSave = () => {
        const nameOfItem = fields.itemName
        
        const parsedPrice = parseFloat(fields.itemPrice);
        const parsedAmount = parseInt(fields.itemAmount);
        const parsedStockWarning = parseInt(fields.itemStockWarning);

        if (isNaN(parsedPrice)) {
            Alert.alert('Error', 'Invalid Price. Please enter a valid number.');
        } else if (isNaN(parsedAmount)) {
            Alert.alert('Error', 'Invalid Amount. Please enter a valid number.');
        } else if (isNaN(parsedStockWarning)) {
            Alert.alert('Error', 'Invalid Stock Warning. Please enter a valid number.');
        } else {
            const changesString = getChangesString(item, fields);
            const changes = 'Changes made for ' + nameOfItem + ' ' + changesString;
            const inventoryHistoryEntry = {
                event: 'Edited Item',
                description: changes,
                date: formattedDate,
            };

            firebase.firestore().collection('users').doc(firebase.auth().currentUser.uid).collection('InventoryHistory').doc().set(inventoryHistoryEntry);

            firebase.firestore().collection('users').doc(firebase.auth().currentUser.uid).collection('Items').doc(item.id).update(fields);

            navigation.goBack();
        }
    };

    const getChangesString = (originalItem, updatedItem) => {
        const changes = [];

        for (const key in updatedItem) {
            if (originalItem[key] !== updatedItem[key]) {
                changes.push(`${key}: ${originalItem[key]} -> ${updatedItem[key]}`);
            }
        }

        return changes.join(', ');
    };

    const handleDelete = () => {
        firebase.firestore().collection('users').doc(firebase.auth().currentUser.uid).collection('Items').doc(item.id).delete();
        navigation.goBack();
    };

    const addToCart = async (itemId, itemName) => {
        try {
            const cartItem = await firebase.firestore().collection('users').doc(firebase.auth().currentUser.uid).collection('CartCollection').doc(itemId).get();

            if (cartItem.exists) {
                Alert.alert('Error', `${itemName} is already in the cart.`);
            } else {
                await firebase.firestore().collection('users').doc(firebase.auth().currentUser.uid).collection('CartCollection').doc(itemId).set({ itemName });
                Alert.alert('Success', `${itemName} added to the cart.`);
            }
        } catch (error) {
            console.error('Error adding to cart:', error);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.titleText}>Name</Text>
            <TextInput
                style={styles.textInput}
                value={fields.itemName}
                onChangeText={(text) => setFields({ ...fields, itemName: text })}
            />
            <Text style={styles.titleText}>Price</Text>
            <TextInput
                style={styles.textInput}
                value={fields.itemPrice}
                onChangeText={(text) => setFields({ ...fields, itemPrice: text })}
            />
            <Text style={styles.titleText}>Quantity</Text>
            <TextInput
                style={styles.textInput}
                value={fields.itemAmount.toString()}
                onChangeText={(text) => setFields({ ...fields, itemAmount: text })}
            />
            <Text style={styles.titleText}>Low Stock Warning</Text>
            <TextInput
                style={styles.lowStockText}
                value={fields.itemStockWarning}
                onChangeText={(text) => setFields({ ...fields, itemStockWarning: text })}
            />

            <TouchableOpacity style={styles.editButtons3} onPress={handleSave}>
                <Text style={styles.editButtonsText}>Save</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.editButtons} onPress={() => addToCart(item.id, item.itemName)}>
                <Text style={styles.editButtonsText}>Add to Cart</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.editButtons1} onPress={handleDelete}>
                <Text style={styles.editButtonsText}>Delete</Text>
            </TouchableOpacity>
        </View>
    );
};

export default ItemFieldsScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        padding: 35,
        backgroundColor: '#D5CEC9',
        marginTop:-30
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
        fontWeight: 'bold',
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
        fontWeight: 'bold',
        backgroundColor: '#fffefb',
        height: 45,
        paddingLeft: 10,
        borderRadius: 10,
        paddingVertical: 10,
        width: 350,
    },
    editButtons: {
        marginTop: 6,
        width: 350,
        paddingTop: 10,
        paddingBottom: 10,
        backgroundColor: '#9d5515',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
    },
    editButtons3: {
        marginTop: 255,
        width: 350,
        paddingTop: 10,
        paddingBottom: 10,
        backgroundColor: '#9d5515',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
    },
    editButtons1: {
        marginTop: 6,
        width: 350,
        paddingTop: 10,
        paddingBottom: 10,
        backgroundColor: '#b2a7a2',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
    },
    editButtonsText: {
        color: '#4b2b12',
        fontSize: 16,
        fontWeight: 'bold',
        fontStyle: 'italic'
    },
});
