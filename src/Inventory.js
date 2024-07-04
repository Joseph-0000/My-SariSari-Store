import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Dimensions, TextInput, TouchableOpacity } from 'react-native';
import { firebase } from '../config';
import ItemFieldsScreen from './ItemFieldsScreen';
import { createStackNavigator } from '@react-navigation/stack';
const Stack = createStackNavigator();

const Inventory = ({ navigation }) => {
  const [inventory, setInventory] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const { width } = Dimensions.get('window');
  const columns = 2;
  const buttonWidth = width / columns;

  useEffect(() => {
    const subscriber = firebase
      .firestore()
      .collection('users')
      .doc(firebase.auth().currentUser.uid)
      .collection('Items')
      .onSnapshot((querySnapshot) => {
        const inventoryArray = [];
        querySnapshot.forEach((doc) => {
          inventoryArray.push({ ...doc.data(), id: doc.id });
        });
        setInventory(inventoryArray);
      });

    return () => subscriber();
  }, []);

  const handleItemClick = (item) => {
    navigation.navigate('ItemFieldsScreen', { item });
  };

  const addToCart = async (itemId, itemName) => {
    try {
      // Check if the item is already in the CartCollection
      const cartItem = await firebase
        .firestore()
        .collection('users')
        .doc(firebase.auth().currentUser.uid).collection('CartCollection').doc(itemId).get();

      if (cartItem.exists) {
        Alert.alert('Error', `${itemName} is already in the cart.`);
      } else {
        // Add the item to the CartCollection
        await firebase
          .firestore()
          .collection('users')
          .doc(firebase.auth().currentUser.uid).collection('CartCollection').doc(itemId).set({ itemName });
        Alert.alert('Success', `${itemName} added to the cart.`);
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  const filteredItems = inventory.filter((item) => {
    const itemName = String(item.itemName).toLowerCase();
    const query = searchQuery.toLowerCase();
    return itemName.includes(query);
  });

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>INVENTORY</Text>
      <TextInput
        style={styles.searchInput}
        placeholder="Search"
        placeholderTextColor={'#4b2b12'}
        value={searchQuery}
        onChangeText={(text) => setSearchQuery(text)}
      />
      <View style={styles.listContainer}>
        <FlatList 
          data={filteredItems}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.item}
            onPress={() => handleItemClick(item)}
          >
            <Text style={styles.buttonTextItem}>{item.itemName}</Text>
            <View style={styles.priceStockContainer}>
              <Text style={styles.buttonText}>Price: ₱{item.itemPrice}</Text>
              <Text style={[styles.buttonText, styles.stockText]}>Stock: {item.itemAmount}</Text>
            </View>
          </TouchableOpacity>

          )}
        />
      </View>
    </View>
  );
  
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: -130,
    paddingVertical: 30,
    backgroundColor: '#D5CEC9'
  },
  listContainer: {
    paddingVertical: 10,
    marginBottom: 115
  },
  item: {
    flex: 1,
    justifyContent: 'center',
    marginVertical: 3,
    backgroundColor: '#b2a7a2',
    width: 350,
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
   headerText: {
    fontWeight: 'bold',
    color: '#4b2b12',
    fontSize: 30,
    textAlign: 'center',
    paddingTop:80

  },
  searchInput:{
    backgroundColor: '#fffefb',
    width: 350,
    alignSelf: 'center',
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginBottom: 3,
    marginTop:5,
    fontSize:16
  },
  title: {
    fontSize: 12,
    textAlign: 'center',
  },
  columnWrapper: {
    justifyContent: 'space-evenly',
  },
  button: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#5F6C37',
    borderRadius: 18,
  },
  buttonText: {
    color: '#4b2b12',
    fontSize: 16,
  },
  buttonTextItem: {
    color: '#4b2b12',
    fontSize: 16,
    fontWeight: 'bold',
    fontStyle:'italic'
  },
  container: {
    flex: 1,
    justifyContent: 'center', // Center vertically
    alignItems: 'center', // Center horizontally
    backgroundColor: '#D5CEC9'
  },
  priceStockContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between', // Align items with space between them
    alignItems: 'center',
  },
});

export default Inventory;