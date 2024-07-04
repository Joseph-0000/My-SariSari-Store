import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Button, TouchableOpacity, TextInput, FlatList, Alert } from 'react-native';
import { firebase } from '../config';

const ShoppingCart = () => {
    const [cartItems, setCartItems] = useState([]);
    const [quantityInputs, setQuantityInputs] = useState({});

    const fetchCartItems = async () => {
        try {
            const snapshot = await firebase.firestore().collection('users').doc(firebase.auth().currentUser.uid).collection('CartCollection').get();
            const cartItemsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setCartItems(cartItemsData);
        } catch (error) {
            console.error('Error fetching cart items:', error);
        }
    };

    useEffect(() => {
        fetchCartItems();
    }, []); // Empty dependency array ensures the effect runs once on mount

    const handleAdd = async (itemId, itemName, quantityToAdd) => {
        try {
            const parsedQuantity = parseInt(quantityToAdd, 10);
            if (isNaN(parsedQuantity)) {
                Alert.alert('Error', 'Please enter a valid number.');
                return;
            }

            const itemSnapshot = await firebase.firestore().collection('users').doc(firebase.auth().currentUser.uid).collection('Items').doc(itemId).get();
            const currentItemAmount = parseInt(itemSnapshot.data().itemAmount, 10);

            const updatedItemAmount = (currentItemAmount + parsedQuantity).toString();
            await firebase.firestore().collection('users').doc(firebase.auth().currentUser.uid).collection('Items').doc(itemId).update({
                itemAmount: updatedItemAmount,
            });

            await firebase.firestore().collection('users').doc(firebase.auth().currentUser.uid).collection('CartCollection').doc(itemId).delete();

            const currentDate = new Date();
            const formattedDate = currentDate.toLocaleString('en-US', {
                hour: 'numeric',
                minute: 'numeric',
                hour12: true,
                month: 'numeric',
                day: 'numeric',
                year: 'numeric',
            });
            const inventoryHistoryEntry = {
                event: 'Add Item From Cart',
                description: `Added ${parsedQuantity} ${itemName} to the inventory`,
                date: formattedDate,
            };

            await firebase.firestore().collection('users').doc(firebase.auth().currentUser.uid).collection('InventoryHistory').doc().set(inventoryHistoryEntry);

            fetchCartItems();
        } catch (error) {
            console.error('Error adding to cart:', error);
        }
    };

    const handleDelete = async (itemId) => {
        try {
            await firebase.firestore().collection('users').doc(firebase.auth().currentUser.uid).collection('CartCollection').doc(itemId).delete();
            Alert.alert('Success', 'Item removed from cart.');

            fetchCartItems();
        } catch (error) {
            console.error('Error deleting item:', error);
        }
    };

    const handleAddAll = () => {
        Object.entries(quantityInputs).forEach(([itemId, quantityToAdd]) => {
            handleAdd(itemId, cartItems.find(item => item.id === itemId).itemName, quantityToAdd);
        });
        fetchCartItems();

        setQuantityInputs({});
    };

    const renderItem = ({ item }) => (
        <View style={styles.row}>
            <Text style={styles.column}>{item.itemName}</Text>
            <TextInput
                style={[styles.column, styles.centeredColumn]}
                placeholder="0"
                placeholderTextColor={'#4b2b12'}
                keyboardType="numeric"
                value={quantityInputs[item.id]}
                onChangeText={(text) => setQuantityInputs({ ...quantityInputs, [item.id]: text })}
            />
            <TouchableOpacity style={styles.addToCartButton} onPress={() => handleAdd(item.id, item.itemName, quantityInputs[item.id])}>
                <Text style={styles.addToCartButtonText}>+</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.addToCartButton} onPress={() => handleDelete(item.id)}>
                <Text style={styles.addToCartButtonText}>-</Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.headerText1}>SHOPPING CART</Text>
            <View style={styles.header}>
                <Text style={styles.headerText}>ITEM NAME</Text>
                <Text style={styles.headerText}>QUANTITY</Text>
                <Text style={styles.headerText}>ACTIONS</Text>
            </View>
            <FlatList
                data={cartItems}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
                contentContainerStyle={styles.listContainer}
            />
            <TouchableOpacity style={styles.addToCartButton1} onPress={handleAddAll}>
                <Text style={styles.addToCartButtonText1}>ADD ALL</Text>
            </TouchableOpacity>
        </View>
    );
};

export default ShoppingCart;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#D5CEC9',
        alignItems: 'center', // Center horizontally
        paddingBottom: 35,
    },
    listContainer: {
        alignItems: 'center', // Center the FlatList content
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
        width: 350, // Fixed width
    },
    headerText: {
        fontWeight: 'bold',
        fontSize: 16,
        fontStyle: 'italic',
        color: '#9d5515',
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center', // Center vertically
        marginBottom: 8,
        backgroundColor: '#b2a7a2',
        padding: 15,
        borderRadius: 10,
        width: 350, // Fixed width
    },
    column: {
        flex: 1,
        marginRight: 8,
        color: '#4b2b12',
    },
    centeredColumn: {
        textAlign: 'center', // Center text horizontally
        backgroundColor:'#fffef',
        height:40,
        borderRadius:10
    },
    headerText1: {
        fontWeight: 'bold',
        color: '#4b2b12',
        fontSize: 30,
        textAlign: 'center',
        marginTop: -10,
    },
    addToCartButton: {
        backgroundColor: '#9d5515',
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 10,
        marginLeft:3
    },
    addToCartButton1: {
      backgroundColor: '#9d5515',
      paddingVertical: 10,
      paddingHorizontal: 15,
      borderRadius: 10,
      marginLeft:3,
      width:350
  },
    addToCartButtonText: {
        color: '#4b2b12',
        fontWeight: 'bold',
        fontStyle: 'italic',
        
    },
    addToCartButtonText1: {
      color: '#4b2b12',
      fontWeight: 'bold',
      fontStyle: 'italic',
      textAlign:'center',
      fontSize:16
      
  },
});
