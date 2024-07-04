import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { firebase } from '../config';

const Registration = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [verifyPassword, setVerifyPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [shopName, setShopName] = useState('');

  const registerUser = async () => {
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d!@#$%^&*()_+]{8,}$/;

    if (password !== verifyPassword) {
      alert('Passwords do not match');
      return;
    }

    if (!passwordRegex.test(password)) {
      alert(
        'Password must be 8 characters long and contain at least one uppercase letter, one number, and one special character (!@#$%^&*()_+)'
      );
      return;
    }

    try {
      await firebase.auth().createUserWithEmailAndPassword(email, password);

      await firebase.auth().currentUser.sendEmailVerification({
        handleCodeInApp: true,
        url: 'https://mysarisaristore-bc480.firebaseapp.com',
      });
      firebase.auth().signOut();
      alert('Verification email sent');

      await firebase.firestore().collection('users').doc(firebase.auth().currentUser.uid).set({
        firstName,
        lastName,
        email,
        shopName,
      });
    } catch (error) {
      console.error('Firebase Authentication Error:', error);
      alert('Registration failed. Please try again later.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Text style={styles.registerText}>REGISTRATION</Text>
        <KeyboardAvoidingView behavior="padding" style={styles.keyboardAvoidingView}>
          <TextInput
            style={styles.textInput}
            placeholder="First Name"
            placeholderTextColor={'#4b2b12'}
            onChangeText={(firstName) => setFirstName(firstName)}
            autoCorrect={false}
          />
          <TextInput
            style={styles.textInput}
            placeholder="Last Name"
            placeholderTextColor={'#4b2b12'}
            onChangeText={(lastName) => setLastName(lastName)}
            autoCorrect={false}
          />
          <TextInput
            style={styles.textInput}
            placeholder="Shop Name"
            placeholderTextColor={'#4b2b12'}
            onChangeText={(shopName) => setShopName(shopName)}
            autoCorrect={false}
          />
          <TextInput
            style={styles.textInput}
            placeholder="Email"
            placeholderTextColor={'#4b2b12'}
            onChangeText={(email) => setEmail(email)}
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="email-address"
          />
          <TextInput
            style={styles.textInput}
            placeholder="Password"
            placeholderTextColor={'#4b2b12'}
            onChangeText={(password) => setPassword(password)}
            autoCorrect={false}
            autoCapitalize="none"
            secureTextEntry
          />
          <TextInput
            style={styles.textInput}
            placeholder="Verify Password"
            placeholderTextColor={'#4b2b12'}
            onChangeText={(verifyPassword) => setVerifyPassword(verifyPassword)}
            autoCorrect={false}
            autoCapitalize="none"
            secureTextEntry
          />
          <TouchableOpacity onPress={() => registerUser()} style={styles.button}>
            <Text style={{ fontWeight: 'bold', fontSize: 16, color: '#4b2b12', fontStyle: 'italic' }}>Register</Text>
          </TouchableOpacity>
        </KeyboardAvoidingView>
      </View>
    </ScrollView>
  );
};

export default Registration;


const styles = StyleSheet.create({
    container: {
        flex:1,
        alignItems:'center',
        backgroundColor: '#D5CEC9',
        marginTop:-100,
      },
    textInput: {
        paddingTop: 10,
        paddingBottom: 10,
        paddingLeft: 20,
        width: '80%',
        margin: 5,
        borderRadius: 10,
        backgroundColor: '#fffefb',

    },
    button: {
        justifyContent:'center',
        width: '80%',
        padding: 15,
        borderRadius: 10,
        backgroundColor: '#9d5515',
        alignItems: 'center',
        marginTop: 200,
        marginBottom: 1000,
    },
    keyboardAvoidingView: {
        width: '100%',
        alignItems: 'center',
      },
    registerText: {
        fontWeight: 'bold',
        color: '#4b2b12',
        marginTop: 60,
        paddingTop: 70,
        paddingBottom:20,
        fontSize: 35
    },

    scrollContainer: {
        marginTop:-10,
    }
});
