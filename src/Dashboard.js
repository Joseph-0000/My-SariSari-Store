import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Modal, Image } from 'react-native';
import { firebase } from '../config';
import { createStackNavigator } from '@react-navigation/stack';
import { SearchBar } from 'react-native-elements';

// Import the local image
import welcomeImage from '../assets/welcome.png';

const Stack = createStackNavigator();

const Dashboard = ({ navigation }) => {
  const [welcomeVisible, setWelcomeVisible] = useState(true);

  const handleButtonClick = (screen) => {
    navigation.navigate(screen);
  };

  const handleCloseWelcome = () => {
    setWelcomeVisible(false);
  };

  return (
    <View style={styles.container}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={welcomeVisible}
        onRequestClose={handleCloseWelcome}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Image
              source={welcomeImage} // Use the imported local image
              style={styles.welcomeImage}
            />
            <TouchableOpacity onPress={handleCloseWelcome} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>Start!</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Text style={styles.title}>MENU</Text>

      <TouchableOpacity
        style={styles.menuButton}
        onPress={() => handleButtonClick('Dashboard2')}
      >
        <Text style={styles.buttonText}>Make a Transaction</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.menuButton}
        onPress={() => handleButtonClick('Inventory')}
      >
        <Text style={styles.buttonText}>Inventory</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.menuButton}
        onPress={() => handleButtonClick('InventoryHistory')}
      >
        <Text style={styles.buttonText}>Inventory History</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.menuButton}
        onPress={() => handleButtonClick('TransactionHistory')}
      >
        <Text style={styles.buttonText}>Transaction History</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.menuButton}
        onPress={() => handleButtonClick('Sales')}
      >
        <Text style={styles.buttonText}>Sales</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.menuButton}
        onPress={() => handleButtonClick('AddToInventory')}
      >
        <Text style={styles.buttonText}>New Item</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.menuButton}
        onPress={() => handleButtonClick('LowStockItem')}
      >
        <Text style={styles.buttonText}>Low Stock</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.menuButton}
        onPress={() => handleButtonClick('ShoppingCart')}
      >
        <Text style={styles.buttonText}>Shopping Cart</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => {
          firebase.auth().signOut();
        }}
        style={styles.menuButton1}
      >
        <Text style={styles.buttonText}>Sign Out</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Dashboard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#D5CEC9',
    marginTop: -100,
  },
  title: {
    fontWeight: 'bold',
    color: '#4b2b12',
    fontSize: 30,
    paddingBottom: 10,
    paddingTop: 100,
  },
  menuButton: {
    marginTop: 6,
    width: 350,
    paddingTop: 10,
    paddingBottom: 10,
    backgroundColor: '#9d5515',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
  },
  buttonText: {
    color: '#4b2b12',
    fontSize: 16,
    fontWeight: 'bold',
    fontStyle: 'italic',
  },
  menuButton1: {
    marginTop: 32,
    width: 350,
    paddingTop: 10,
    paddingBottom: 10,
    backgroundColor: '#b2a7a2',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: 300,
    backgroundColor: '#D5CEC9',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  welcomeImage: {
    width: 250,
    height: 250,
    marginBottom: 20,
  },
  closeButton: {
    backgroundColor: '#9d5515',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  closeButtonText: {
    color: '#4b2b12',
    fontWeight: 'bold',
    fontStyle:'italic'
  },
});
