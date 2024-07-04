import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { firebase } from '../config';

const Sales = () => {
  const [salesData, setSalesData] = useState([]);

  useEffect(() => {
    const subscriber = firebase
      .firestore()
      .collection('users')
      .doc(firebase.auth().currentUser.uid)
      .collection('TransactionHistory')
      .orderBy('timestamp', 'desc')
      .onSnapshot((querySnapshot) => {
        const salesMap = new Map();

        querySnapshot.forEach((doc) => {
          const transaction = doc.data();
          const date = transaction.timestamp.toDate().toLocaleDateString();

          if (salesMap.has(date)) {
            // Update total sales for the existing date
            salesMap.set(date, salesMap.get(date) + transaction.totalPrice);
          } else {
            // Initialize total sales for a new date
            salesMap.set(date, transaction.totalPrice);
          }
        });

        const salesArray = Array.from(salesMap, ([date, totalSales]) => ({ date, totalSales }));
        setSalesData(salesArray);
      });

    return () => subscriber();
  }, []);

  const renderSalesItem = ({ item }) => (
    <View style={styles.row}>
      <Text style={styles.column}>{item.date}</Text>
      <Text style={[styles.column, styles.totalColumn]}>₱{item.totalSales ? item.totalSales.toFixed(2) : 0}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.headerText1}>SALES</Text>
      <View style={styles.header}>
        <Text style={styles.headerText}>DATE</Text>
        <Text style={[styles.headerText, styles.totalHeaderText]}>TOTAL</Text>
      </View>
      <FlatList
        data={salesData}
        keyExtractor={(item) => item.date}
        renderItem={renderSalesItem}
        contentContainerStyle={styles.listContainer} // Center the list content
      />
    </View>
  );
};

export default Sales;

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
  totalHeaderText: {
    textAlign: 'right', // Align the TOTAL header text to the right
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
    color: '#4b2b12',
  },
  totalColumn: {
    textAlign: 'right', // Align the TOTAL column text to the right
  },
  headerText1: {
    fontWeight: 'bold',
    color: '#4b2b12',
    fontSize: 30,
    textAlign: 'center',
    marginTop: -10,
  },
});
