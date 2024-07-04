import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, SafeAreaView, TouchableOpacity, Modal, FlatList, ScrollView, TextInput } from 'react-native';
import { firebase } from '../config';
import { Ionicons } from '@expo/vector-icons';
import { createStackNavigator } from '@react-navigation/stack';
import { SearchBar } from 'react-native-elements';


const Dashboard2 = ({ navigation }) => {
  const [name, setName] = useState('');
  const [isMenuVisible, setMenuVisible] = useState(false);
  const [isSearchModalVisible, setSearchModalVisible] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [inventory, setInventory] = useState([]);
  const [numColumns, setNumColumns] = useState(1);
  const [selectedItems, setSelectedItems] = useState([]);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [change, setChange] = useState(0);
  const [isSaveTransaction, setSaveTransaction] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleItemSelect = (item) => {
    // Check if the item is already selected
    const index = selectedItems.findIndex((selectedItem) => selectedItem.id === item.id);

    if (index !== -1) {
      // Item is already selected, update the quantity or remove it if quantity is 0
      const updatedItems = [...selectedItems];

      // Validate if the entered quantity is within the available stock
      const remainingStock = item.itemAmount;
      if (updatedItems[index].quantity >= remainingStock) {
        // Display an alert
        alert(`I'm sorry, but the remaining stock of this item is ${remainingStock}`);
        return;
      }

      updatedItems[index].quantity = updatedItems[index].quantity + 1;
      setSelectedItems(updatedItems);
    } else {
      // Item is not selected, add it to the selected items list
      setSelectedItems([...selectedItems, { ...item, quantity: 1 }]);
    }
  };

  const filteredItems = inventory.filter((item) => {
    const itemName = String(item.itemName).toLowerCase();
    const query = searchQuery.toLowerCase();
    return itemName.includes(query);
  });
  const handleRemoveItem = (itemId) => {
    const updatedItems = selectedItems.filter((item) => item.id !== itemId);
    setSelectedItems(updatedItems);
  };

  const handleFinishTransaction = async () => {
    // Calculate the total price
    const totalPrice = selectedItems.reduce((total, item) => total + item.itemPrice * item.quantity, 0);

    // Now, you can access the paymentAmount state to get the entered payment amount
    const paymentAmountFloat = parseFloat(paymentAmount);

    console.log('Total Price:', totalPrice);
    console.log('Payment Amount:', paymentAmountFloat);

    // Ensure paymentAmountFloat is a valid number
    if (!isNaN(paymentAmountFloat)) {
      // Calculate the change after the selected items state is updated
      const calculatedChange = paymentAmountFloat - totalPrice;
      setChange(calculatedChange);
      console.log('Change:', calculatedChange);
      setSaveTransaction(true);
    } else {
      console.log('Invalid payment amount');
    }
  };

  const handleSaveTransaction = async () => {
    // Calculate the total price
    const totalPrice = selectedItems.reduce((total, item) => total + item.itemPrice * item.quantity, 0);

    // Now, you can access the paymentAmount state to get the entered payment amount
    const paymentAmountFloat = parseFloat(paymentAmount);
    setSaveTransaction(false);

    console.log('Total Price:', totalPrice);
    console.log('Payment Amount:', paymentAmountFloat);

    // Ensure paymentAmountFloat is a valid number
    if (!isNaN(paymentAmountFloat)) {
      // Calculate the change after the selected items state is updated
      const calculatedChange = paymentAmountFloat - totalPrice;
      setChange(calculatedChange);
      console.log('Change:', calculatedChange);

      // Save transaction details in the transaction history collection
      try {
        const batch = firebase.firestore().batch();

        selectedItems.forEach((item) => {
          const itemRef = firebase
            .firestore()
            .collection('users')
            .doc(firebase.auth().currentUser.uid)
            .collection('Items')
            .doc(item.id);

          // Deduct the quantity in the database
          batch.update(itemRef, { itemAmount: item.itemAmount - item.quantity });
        });

        // Commit the batched updates
        await batch.commit();

        const transactionDetails = selectedItems.map((item) => ({
          itemName: item.itemName,
          quantity: item.quantity,
          itemPrice: item.itemPrice,
        }));

        // Save transaction details in the transaction history collection
        await firebase
          .firestore()
          .collection('users')
          .doc(firebase.auth().currentUser.uid)
          .collection('TransactionHistory')
          .add({
            items: transactionDetails,
            totalPrice,
            paymentAmount: paymentAmountFloat,
            change: calculatedChange,
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
          });

        // Clear the selected items
        ClearTransaction();

        // Navigate to TransactionHistory screen
        navigation.navigate('TransactionHistory');
      } catch (error) {
        console.error('Error saving transaction:', error);
      }
    } else {
      console.log('Invalid payment amount');
    }
  };

  const ClearTransaction = () => {
    setSelectedItems([]);
    setPaymentAmount('');
    setChange(0)
  }
  const toggleSearchModal = () => {
    setSearchModalVisible(!isSearchModalVisible);
  };
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
  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <TouchableOpacity>
        <Text style={styles.title}>Product: {item.itemName}</Text>
        <Text style={styles.title}>Price: ₱{item.itemPrice}</Text>
        <Text style={styles.title}>On Stock: {item.itemAmount}</Text>
      </TouchableOpacity>
    </View>
  );
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.helloText}>TRANSACTION{name.firstName}</Text>
      {/*
      <TouchableOpacity onPress={toggleMenu} style={styles.menuIcon}>
        <Ionicons name="ios-menu" size={30} color="black" />
      </TouchableOpacity>
       */}

      {/* Menu Modal */}
      {/*
  <Modal style={styles.menuContainer} visible={isMenuVisible} animationType="slide">
        <View style={styles.menuContainer}>
          <TouchableOpacity onPress={toggleMenu} style={styles.menuCloseButton}>
            <Text style={styles.menuCloseButtonText}>X</Text>
          </TouchableOpacity>
          <FlatList style={styles.menuModal}
            data={menuItems}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => navigateToScreen(item.screen)} style={styles.menuItem}>
                <Text style={styles.menuItemText}>{item.name}</Text>
              </TouchableOpacity>
            )}
          />
          <TouchableOpacity
            onPress={() => {
              firebase.auth().signOut();
              setMenuVisible(false); // Close the menu after signing out
            }}
            style={styles.signOutButton}
          >
            <Text style={styles.signOutButtonText}>Sign Out</Text>
          </TouchableOpacity>
        </View>
      </Modal>

 */}


      {/* Search Modal */}
      <Modal style={styles.searchModalContainer} visible={isSearchModalVisible} animationType="slide">
        <View style={styles.searchModalContainer}>
          <View style={styles.searchModal}>
            <TextInput
              style={styles.searchInput}
              placeholder="Search"
              placeholderTextColor={'#4b2b12'}
              value={searchQuery}
              onChangeText={(text) => setSearchQuery(text)}
            />
<FlatList 
  style={styles.listContainer}
  data={filteredItems}
  keyExtractor={(item) => item.id}
  renderItem={({ item }) => (
    <TouchableOpacity
      style={styles.item}
      onPress={() => handleItemSelect(item)}
    >
      <Text style={styles.buttonTextItem}>{item.itemName}</Text>
      <View style={styles.priceQuantityContainer}>
        <Text style={styles.buttonText}>₱ {item.itemPrice}</Text>
        <Text style={styles.buttonText}>Stock: {item.itemAmount}</Text>
      </View>
    </TouchableOpacity>
  )}
/>


            <View style={styles.closeButtonContainer}>
              <TouchableOpacity onPress={toggleSearchModal} style={styles.closeButton}>
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      {/* Display Selected Items on Main Screen */}
      <ScrollView style={styles.selectedItemsContainer}>
      <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 10,color:'#D5CEC9', textAlign:'center' }}>
          SELECTED ITEM/S
        </Text>
        {selectedItems.map((selectedItem, index) => (
  <View key={index} style={styles.selectedItem}>
    <View style={styles.namePriceContainer}>
      <Text style={{ fontSize: 16, color: '#D5CEC9', fontWeight: 'bold', marginTop: 10 }}>
        {selectedItem.itemName}
      </Text>
      <Text style={[styles.selectedItemText, { marginLeft: 10, marginTop: 10 }]}>
        ₱{selectedItem.itemPrice}.00
      </Text>
    </View>
    <View style={styles.quantityContainer}>
      <Text style={styles.selectedItemText}>Quantity:</Text>
      <TextInput
        style={styles.quantityInput}
        value={selectedItem.quantity.toString()}
        onChangeText={(text) => {
          const enteredQuantity = parseInt(text, 10) || 0;
          const updatedItems = [...selectedItems];

          if (enteredQuantity > selectedItem.itemAmount) {
            alert(
              `The remaining stock of this item is ${selectedItem.itemAmount}`
            );
            updatedItems[index].quantity = 0;
          } else {
            updatedItems[index].quantity = enteredQuantity;
          }

          setSelectedItems(updatedItems);
        }}
        keyboardType="numeric"
      />
      {/* Remove button for each selected item */}
      <TouchableOpacity
        onPress={() => handleRemoveItem(selectedItem.id)}
        style={styles.removeButton}
      >
        <Text style={styles.removeButtonText}>X</Text>
      </TouchableOpacity>
    </View>
  </View>
))}


{selectedItems.length > 0 && (
  <View style={styles.totalPriceTouchable}>
    <Text style={styles.totalPriceText}>
      TOTAL: ₱
      {selectedItems
        .reduce((total, item) => total + item.itemPrice * item.quantity, 0)
        .toFixed(2)}
    </Text>
  </View>
)}

        {/* Input for Payment Amount */}
        <Text style={styles.paymentText}>Payment</Text>
        <TextInput
          style={styles.paymentInput}
          placeholder="Enter Payment Amount"
          placeholderTextColor={'#4b2b12'}
          keyboardType="numeric"
          value={paymentAmount}
          onChangeText={(text) => setPaymentAmount(text)}
        />
        {/* Display Change */}
        <Text style={styles.changeText}>
          CHANGE: ₱{change.toFixed(2)}
        </Text>
        {isSaveTransaction ? (
          // Save Transaction Button
          <TouchableOpacity onPress={handleSaveTransaction}>
            <Text style={styles.FnshTrnsc}>Save</Text>
          </TouchableOpacity>
        ) : (
          // Finish Transaction Button
          <TouchableOpacity onPress={handleFinishTransaction}>
            <Text style={styles.FnshTrnsc}>Calculate</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity>
          <Text style={styles.FnshTrnsc2} onPress={ClearTransaction}>
            Clear
          </Text>
        </TouchableOpacity>
        <Text style={{ fontSize: 30 }}></Text>
      </ScrollView>
      <TouchableOpacity onPress={toggleSearchModal}>
        <Text style={styles.addButton}>Add Item</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default Dashboard2;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignSelf:'center',
    marginTop: -120,
    backgroundColor: '#D5CEC9',
    paddingTop:100,
    padding: 35,

  },
  menuIcon: {
    position: 'absolute',
    left: 325,
    top: 100,
    zIndex: 1,
  },
  addButton: {
    fontWeight:'bold', fontSize:16, color:'#4b2b12',
    marginTop:0,
    width:350,
    paddingTop: 10,
    paddingBottom: 10,
    backgroundColor:'#9d5515',
    alignItems:'center',
    justifyContent:'center',
    textAlign: 'center',
    borderRadius: 10,
    fontStyle:'italic'
  },
  signOutButton: {
    textAlign: 'center',
    backgroundColor: '#00668c',
    marginVertical: 20,
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 25,
  },
  signOutButtonText: {
    fontSize: 16,
    color: '#1d1c1c',
  },
  menuModal: {
    marginTop: 40,
    paddingVertical: 10,
    paddingHorizontal: 10,
    
    
  },
  menuContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 10,
    width: 350,
    alignSelf: 'center',
    top: 100,
    borderRadius: 10,
  },
  menuItem: {
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 50,
    marginVertical: 5,
    fontSize: 16,
    borderRadius: 10,
    borderColor: '#71c4ef'
  },
  menuItemText: {
    fontSize: 18,
    color: '#1d1c1c',
    
  },
  menuCloseButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    color: '#1d1c1c',
    textAlign: 'center',
    backgroundColor:'#ffff',
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 25,
    
  },
  menuCloseButtonText: {
    fontSize: 18,
    color: 'white',
    textAlign: 'center',
  },
  searchModalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#D5CEC9' //remove
  },
  searchModal: {
    backgroundColor: '#fffefb',
    width: '85%',
    height: '90%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 45,
    backgroundColor:'#4b2b12'
    
  },
  searchBarContainer: {
    width: '100%',
    borderTopWidth: 0,
    borderBottomWidth: 0,
    padding: 12,
    margin: 0,
    flex: 0,
    
  },
  searchBarInputContainer: {
    backgroundColor: '#1d1c1c',
    width: '95%',
    alignSelf: 'center',
    borderRadius: 8,
    marginVertical: 10,
    paddingHorizontal: 10,
  },
  priceQuantityContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
  },
  closeButtonContainer: {
    justifyContent: 'flex-end',
    marginVertical: 20,
  },
  closeButton: {
    backgroundColor: '#b2a7a2',
    marginVertical: 10,
    paddingVertical: 10,
    borderRadius: 10,
    width:300
  },
  closeButtonText: {
    fontSize: 16,
    color: '#4b2b12',
    textAlign: 'center',
    fontWeight: 'bold',
    fontStyle:'italic'
  },
  menuContainer2: {
    flexDirection: 'column',
    justifyContent: 'space-evenly',
    alignItems: 'space',
    width: '80%',
    height: '70%',
    paddingVertical: 10,
    borderRadius: 10,
    
  },
  title: {
    fontSize: 16,
  },
  item: {
    backgroundColor: '#9d5515',
    marginTop:5,
    paddingVertical: 5,
    paddingHorizontal: 25,
    borderRadius: 10,
  },
  selectedItemsContainer: {
    paddingVertical: 25,
    paddingHorizontal: 20,
    width: 350,
    backgroundColor: '#4b2b12',
    borderRadius: 10,
    marginBottom:10,
  },
  selectedItem: {
    marginVertical: 5,
    borderTopWidth: 1,
    borderTopColor: '#D5CEC9',
  },
  namePriceContainer: {
    flexDirection: 'row',
    alignItems: 'center',

  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityInput: {
    color: '#1d1c1c',
    fontSize: 16,
    backgroundColor:'#fffefb',
    height:30,
    paddingLeft:15,
    borderRadius:10,
    marginLeft: 155,
    paddingRight: 20,
  },
  FnshTrnsc: {
    color: '#4b2b12',
    textAlign: 'center',
    backgroundColor: '#9d5515',
    marginVertical: 3,
    paddingVertical: 7,
    paddingHorizontal: 30,
    borderRadius: 10,
    fontWeight: 'bold',
    fontSize: 16,
    fontStyle:'italic'
  },
  FnshTrnsc2: {
    color: '#4b2b12',
    textAlign: 'center',
    backgroundColor: '#b2a7a2',
    marginVertical: 3,
    paddingVertical: 7,
    paddingHorizontal: 30,
    borderRadius: 10,
    fontWeight: 'bold',
    fontSize: 16,
    fontStyle:'italic'
  },
  selectedItemText: {
    color: '#D5CEC9',
    fontSize: 16,
    
  },
  totalPriceText: {
    color: '#D5CEC9',
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 8,
    textAlign:'center',
    marginBottom:10,
    borderTopWidth: 1,
    borderTopColor: '#D5CEC9',
    paddingTop:10,
  },
  paymentText: {
    color: '#D5CEC9',
    fontSize: 16,
    fontWeight: 'bold',
    paddingBottom: 5
  },
  changeText: {
    color: '#D5CEC9',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    marginTop:8,
    textAlign: 'center'
  },
  paymentInput: {
    color: '#1d1c1c',
    fontSize: 16,
    backgroundColor:'#fffefb',
    height:35,
    paddingLeft:8,
    borderRadius:10
  },
  helloText: {
    color: '#4b2b12',
    fontSize: 30,
    fontWeight: 'bold',
    marginVertical: 10,
    textAlign: 'center'
  },
  removeButton: {
    textAlign: 'center',
    backgroundColor: '#b2a7a2',
    marginVertical: 3,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 10,
    fontWeight: 'bold',
    marginLeft: 5,
  },
  removeButtonText: {
    fontSize: 16,
    color: '#4b2b12',
    textAlign: 'center',
    fontWeight: 'bold'
  },
  searchInput: {
    backgroundColor: '#FEF9E0',
    marginTop:35,
    height:40,
    width:300,
    borderRadius:10,
    paddingLeft:10,
    marginBottom:10,
    fontSize:16
  },
  buttonTextItem: {
    color: '#D5CEC9',
    fontWeight:'bold',
    fontSize:16
  },
  buttonText: {
    color: '#D5CEC9',
    fontSize:16
  }
});
