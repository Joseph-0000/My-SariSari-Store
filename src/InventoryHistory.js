import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { firebase } from '../config';

const InventoryHistory = () => {
  const [inventoryHistory, setInventoryHistory] = useState([]);

  useEffect(() => {
    // Fetch data from Firestore when the component mounts
    const fetchData = async () => {
      const userId = firebase.auth().currentUser.uid;
      const snapshot = await firebase.firestore()
        .collection('users')
        .doc(userId)
        .collection('InventoryHistory')
        .orderBy('date', 'desc')  // Sort by 'date' in descending order
        .get();

      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setInventoryHistory(data);
    };

    fetchData();
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.row}>
      <Text style={styles.column}>{item.event}</Text>
      <Text style={styles.column}>{item.description}</Text>
      <Text style={styles.column}>{item.date}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.headerText1}>INVENTORY HISTORY</Text>
      <View style={styles.header}>
        <Text style={styles.headerText}>EVENT</Text>
        <Text style={styles.headerText}>DESCRIPTION</Text>
        <Text style={styles.headerText}>DATE</Text>
      </View>
      <FlatList
        data={inventoryHistory}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer} // Added this to center the list content
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#D5CEC9',
    alignItems: 'center', // Center horizontally
    paddingBottom:35
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
    color:'#9d5515'

  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
    backgroundColor: '#b2a7a2',
    padding: 15,
    borderRadius: 10,
    width: 350, // Fixed width

  },
  column: {
    flex: 1,
    marginRight: 8,
    color: '#4b2b12'
  },
  headerText1: {
    fontWeight: 'bold',
    color: '#4b2b12',
    fontSize: 30,
    textAlign: 'center',
    marginTop:-10
  },
});

export default InventoryHistory;
