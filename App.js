import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import React, { useState, useEffect} from "react";
import {firebase} from './config';
import { View, Text, Image, StyleSheet } from 'react-native';

import Login from "./src/Login";
import Registration from "./src/Registration";
import Dashboard from "./src/Dashboard";
import Dashboard2 from "./src/Dashboard2";
import Header from "./components/Header";
import Inventory from './src/Inventory';
import InventoryHistory from './src/InventoryHistory';
import LowStockItem from './src/LowStockItem';
import ShoppingCart from './src/ShoppingCart';
import Sales from './src/Sales';
import TransactionHistory from './src/TransactionHistory';
import AddToInventory from "./src/AddToInventory";
import ItemFieldsScreen from "./src/ItemFieldsScreen";

const Stack = createStackNavigator();

function App(){
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();
  
  function onAuthStateChanged(user){
    setUser(user);
    if(initializing) setInitializing(false);  
  }

  useEffect(() => {
    const subscriber = firebase.auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber
  }, []);

  if(initializing) return null;


  if(!user){
    return(
      <Stack.Navigator>
        <Stack.Screen
        name="Login"
        component={Login}
        options={{
          headerTitle: () => (
            <View style={{ flexDirection: 'row', alignItems:'center', justifyContent:'center'}}>
              <Image
                source={require('./assets/sari-sari1.png')}
                style={{ width: '100%', height: 120}}
              />
            </View>
          ),
          headerStyle: {
            height: 150,
            borderBottomLeftRadius: 0,
            borderBottomRightRadius: 0,
            backgroundColor: '#D5CEC9',
          },
          headerTitleContainerStyle: {
            alignItems: 'center',
            justifyContent: 'center',
            flex: 10,
            marginLeft: 45
          },
        }}
        />
        <Stack.Screen
        name="Registration"
        component={Registration}
        options={{
          headerTitle: () => (
            <View style={{ flexDirection: 'row', alignItems:'center', justifyContent:'center'}}>
              <Image
                source={require('./assets/sari-sari1.png')}
                style={{ width: '100%', height: 120}}
              />
            </View>
          ),
          headerStyle: {
            height: 150,
            borderBottomLeftRadius: 0,
            borderBottomRightRadius: 0,
            backgroundColor: '#D5CEC9',
          },
          headerTitleContainerStyle: {
            alignItems: 'center',
            justifyContent: 'center',
            flex: 10,
          },
        }}
        />
      </Stack.Navigator>
    );
  }

  return(
    <Stack.Navigator>
        <Stack.Screen
        name="Dashboard"
        component={Dashboard}
        options={{
          headerTitle: () => (
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Image
              source={require('./assets/sari-sari1.png')} // Adjust the path to your image
              style={{ width: 368, height: 80 }}
            />
          </View>
          ),
          headerStyle:{
            height:150,
            backgroundColor: '#D5CEC9',
          }
        }}
        />
        <Stack.Screen
        name="Inventory"
        component={Inventory}
        options={{
          headerTitle: () => (
            <Image
              source={require('./assets/sari-sari1.png')} // Adjust the path to your image
              style={{ width: 295, height: 68 }}
            />
          ),
          headerStyle:{
            height:150,
            backgroundColor: '#D5CEC9',
          }
        }}
        />
        <Stack.Screen
        name="InventoryHistory"
        component={InventoryHistory}
        options={{
          headerTitle: () => (
            <Image
              source={require('./assets/sari-sari1.png')} // Adjust the path to your image
              style={{ width: 295, height: 68 }}
            />
          ),
          headerStyle:{
            height:150,
            backgroundColor: '#D5CEC9',
          }
        }}
        />
        <Stack.Screen
        name="LowStockItem"
        component={LowStockItem}
        options={{
          headerTitle: () => (
            <Image
              source={require('./assets/sari-sari1.png')} // Adjust the path to your image
              style={{ width: 295, height: 68 }}
            />
          ),
          headerStyle:{
            height:150,
            backgroundColor: '#D5CEC9',
          }
        }}
        />
        <Stack.Screen
        name="ShoppingCart"
        component={ShoppingCart}
        options={{
          headerTitle: () => (
            <Image
              source={require('./assets/sari-sari1.png')} // Adjust the path to your image
              style={{ width: 295, height: 68 }}
            />
          ),
          headerStyle:{
            height:150,
            backgroundColor: '#D5CEC9',
          }
        }}
        />
        <Stack.Screen
        name="TransactionHistory"
        component={TransactionHistory}
        options={{
          headerTitle: () => (
            <Image
              source={require('./assets/sari-sari1.png')} // Adjust the path to your image
              style={{ width: 295, height: 68 }}
            />
          ),
          headerStyle:{
            height:150,
            backgroundColor: '#D5CEC9',
          }
        }}
        />
        <Stack.Screen
        name="AddToInventory"
        component={AddToInventory}
        options={{
          headerTitle: () => (
            <Image
              source={require('./assets/sari-sari1.png')} // Adjust the path to your image
              style={{ width: 295, height: 68 }}
            />
          ),
          headerStyle:{
            height:150,
            backgroundColor: '#D5CEC9',
          }
        }}
        />
        <Stack.Screen
        name="Sales"
        component={Sales}
        options={{
          headerTitle: () => (
            <Image
              source={require('./assets/sari-sari1.png')} // Adjust the path to your image
              style={{ width: 295, height: 68 }}
            />
          ),
          headerStyle:{
            height:150,
            backgroundColor: '#D5CEC9',
          }
        }}
        />
        <Stack.Screen
          name="ItemFieldsScreen"
          component={ItemFieldsScreen}
          options={{
            headerTitle: () => (
              <Image
                source={require('./assets/sari-sari1.png')} // Adjust the path to your image
                style={{ width: 332, height: 77 }}
              />
            ),
            headerStyle:{
              height:150,
              backgroundColor: '#D5CEC9',
            }
          }}
        />
        <Stack.Screen
          name="Dashboard2"
          component={Dashboard2}
          options={{
            headerTitle: () => (
              <Image
                source={require('./assets/sari-sari1.png')} // Adjust the path to your image
                style={{ width: 300, height: 77 }}
              />
            ),
            headerStyle:{
              height:150,
              backgroundColor: '#D5CEC9',
            }
          }}
        />
    </Stack.Navigator>
  );
}

export default () => {
  return(
    <NavigationContainer>
      <App />
    </NavigationContainer>
  )
}