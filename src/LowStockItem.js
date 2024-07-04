import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity, Alert } from 'react-native';
import { firebase } from '../config';

const LowStockItem = () => {
    const [items, setItems] = useState([]);

    useEffect(() => {
        // Fetch items from Firebase and filter based on the condition
        const fetchItems = async () => {
            try {
                const snapshot = await firebase.firestore().collection('users').doc(firebase.auth().currentUser.uid).collection('Items').get();

                const filteredItems = snapshot.docs
                    .filter(doc => {
                        const itemAmount = parseInt(doc.data().itemAmount, 10);
                        const itemStockWarning = parseInt(doc.data().itemStockWarning, 10);
                        return itemAmount < itemStockWarning;
                    })
                    .map(doc => ({ id: doc.id, ...doc.data() }));

                setItems(filteredItems);
            } catch (error) {
                console.error('Error fetching items:', error);
            }
        };

        fetchItems();
    }, []);

    const addToCart = async (itemId, itemName) => {
        try {
            // Check if the item is already in the CartCollection
            const cartItem = await firebase.firestore().collection('users').doc(firebase.auth().currentUser.uid).collection('CartCollection').doc(itemId).get();

            if (cartItem.exists) {
                Alert.alert('Error', `${itemName} is already in the cart.`);
            } else {
                // Add the item to the CartCollection
                await firebase.firestore().collection('users').doc(firebase.auth().currentUser.uid).collection('CartCollection').doc(itemId).set({ itemName });
                Alert.alert('Success', `${itemName} added to the cart.`);
            }
        } catch (error) {
            console.error('Error adding to cart:', error);
        }
    };

    const renderItem = ({ item }) => (
        <View style={styles.row}>
            <Text style={styles.column}>{item.itemName}</Text>
            <Text style={[styles.column, styles.centeredColumn]}>{item.itemAmount}</Text>
            <TouchableOpacity style={styles.addToCartButton} onPress={() => addToCart(item.id, item.itemName)}>
                <Text style={styles.addToCartButtonText}>+</Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.headerText1}>LOW STOCK ITEMS</Text>
            <View style={styles.header}>
                <Text style={styles.headerText}>ITEM NAME</Text>
                <Text style={styles.headerText}>AMOUNT</Text>
                <Text style={styles.headerText}>CART</Text>
            </View>
            <FlatList
                data={items}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.listContainer}
            />
        </View>
    );
};

export default LowStockItem;

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
    },
    addToCartButtonText: {
        color: '#4b2b12',
        fontWeight: 'bold',
        fontStyle: 'italic',
    },
});
