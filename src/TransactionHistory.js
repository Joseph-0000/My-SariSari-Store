import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { firebase } from '../config';

const TransactionHistory = () => {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const subscriber = firebase
      .firestore()
      .collection('users')
      .doc(firebase.auth().currentUser.uid)
      .collection('TransactionHistory')
      .orderBy('timestamp', 'desc')
      .onSnapshot((querySnapshot) => {
        const transactionArray = [];
        querySnapshot.forEach((doc) => {
          transactionArray.push({ id: doc.id, ...doc.data() });
        });
        setTransactions(transactionArray);
      });

    return () => subscriber();
  }, []);

  const renderTransaction = ({ item }) => (
    <View style={styles.transactionContainer}>
      <Text style={styles.timestamp}>{item.timestamp.toDate().toLocaleString()}</Text>
      <FlatList
        data={item.items}
        keyExtractor={(item) => item.itemName}
        renderItem={({ item: transactionItem }) => (
          <View style={styles.transactionItem}>
            <Text style={styles.itemText}>Item: {transactionItem.itemName}</Text>
            <Text style={styles.itemText}>Quantity: {transactionItem.quantity}</Text>
            <Text style={styles.itemText1}>Price: ₱{transactionItem.itemPrice}</Text>
          </View>
        )}
      />

      <Text style={styles.totalText}>Total: ₱{item.totalPrice.toFixed(2)}</Text>
      <Text style={styles.totalText}>Payment Amount: ₱{item.paymentAmount.toFixed(2)}</Text>
      <Text style={styles.totalText}>Change: ₱{item.change.toFixed(2)}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>TRANSACTION HISTORY</Text>
      <FlatList
        data={transactions}
        keyExtractor={(item) => item.id}
        renderItem={renderTransaction}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#D5CEC9',
    alignItems: 'center',
    marginTop:-15,
    paddingBottom: 35,
  },
  listContainer: {
    alignItems: 'center',
  },
  headerText: {
    fontWeight: 'bold',
    color: '#4b2b12',
    fontSize: 30,
    textAlign: 'center',
    paddingBottom:5,
    width: 350,
    paddingTop:5,
    borderRadius: 10,
  },
  transactionContainer: {
    borderBottomWidth: 1,
    borderColor: '#5F6C37',
    padding: 10,
    backgroundColor: '#b2a7a2',
    borderRadius: 10,
    width: 350,
    marginBottom: 8,
  },
  timestamp: {
    fontWeight: 'bold',
    color: '#4b2b12',
    marginBottom: 5,
  },
  transactionItem: {
    marginBottom: 5,
  },
  itemText: {
    fontWeight: 'bold',
    color: '#4b2b12',
  },
  itemText1: {
    fontWeight: 'bold',
    color: '#4b2b12',
    borderBottomWidth:1,

  },
  totalText: {
    fontWeight: 'bold',
    color: '#4b2b12',
  },
});

export default TransactionHistory;
