import { StyleSheet, Text, View, TouchableOpacity, TextInput, Image } from 'react-native';
import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import Carousel from 'react-native-snap-carousel';
import { firebase } from "../config"; 

const Login = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const loginUser = async (email, password) => {
    try {
      await firebase.auth().signInWithEmailAndPassword(email, password);
      if (!firebase.auth().currentUser.emailVerified) {
        alert('Please verify your account by clicking the link in your verification email');
        firebase.auth().signOut();
      }
    } catch (error) {
      alert(error.message);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.carouselItem}>
      <Image source={item.image} style={styles.image} />
    </View>
  );

  const carouselItems = [
    { image: require('../assets/track.png') }, 
    { image: require('../assets/profit.png') },
    { image: require('../assets/record.png') },
  ];

  return (
    <View style={styles.container}>
      <Carousel
        data={carouselItems}
        renderItem={renderItem}
        sliderWidth={400}
        itemWidth={400}
        loop
        autoplay
      />
      <View style={styles.content}>
        <TextInput
          style={styles.textInput}
          placeholder='Email'
          placeholderTextColor='#4b2b12'
          onChangeText={(email) => setEmail(email)}
          autoCapitalize='none'
          autoCorrect={false}
        />
        <TextInput
          style={styles.textInput}
          placeholder='Password'
          placeholderTextColor='#4b2b12'
          onChangeText={(password) => setPassword(password)}
          autoCapitalize='none'
          autoCorrect={false}
          secureTextEntry={true}
        />
        <TouchableOpacity
          onPress={() => loginUser(email, password)}
          style={styles.button}
        >
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
        <View style={{ flexDirection: 'row', marginTop: 10 }}>
          <Text style={{ fontWeight: 'bold', fontSize: 16, textDecorationColor:'#4b2b12'}}>
            Don't have an account?{' '}
          </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Registration')}>
            <Text style={styles.registerText}>
              Register now!
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#D5CEC9',
  },
  carouselItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#D5CEC9',
    paddingBottom: 200,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    backgroundColor: '#D5CEC9',
  },
  content: {
    position: 'absolute',
    bottom: 50,
    width: '100%',
    alignItems: 'center',
  },
  textInput: {
    width: '80%',
    padding: 10,
    marginBottom: 10,
    borderRadius: 10,
    backgroundColor: '#fffefb',
  },
  button: {
    width: '80%',
    padding: 15,
    borderRadius: 10,
    backgroundColor: '#9d5515',
    alignItems: 'center',
  },
  buttonText: {
    color: '#4b2b12',
    fontWeight: 'bold',
    fontSize: 16,
    fontStyle: 'italic',
  },
  registerText: {
    color: '#9d5515',
    fontWeight: 'bold',
    fontSize: 16,
    textDecorationLine: 'underline',
  },
});
