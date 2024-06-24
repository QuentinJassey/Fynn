// src/screens/LoginScreen.js
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const response = await axios.post('https://connect.integration.munic.io/oauth/token', {
        grant_type: 'password',
        username: email,
        password: password,
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });

      const { access_token } = response.data;
      await AsyncStorage.setItem('access_token', access_token);
      navigation.navigate('Home');
    } catch (error) {
      console.error(error);
      alert('Login failed');
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()}><Image style={styles.back} source={require('../img/arrow_back.png')} /></TouchableOpacity>
      <Image style={styles.logo} source={require('../img/logo_fynn_login.png')}></Image>
      <Text style={styles.title}>Se connecter</Text>
      <View style={styles.form}>
      <Text style={styles.text}>Adresse e-mail</Text>
      <TextInput
        style={styles.input}
        placeholder="email@exemple.com"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <Text style={styles.text}>Mot de passe</Text>
      <TextInput
        style={styles.input}
        placeholder="••••••••••••"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      </View>
      <Text style={styles.link} onPress={() => { /* Ajoutez une fonction de mot de passe oublié */ }}>Mot de passe oublié ?</Text>
      <TouchableOpacity style={styles.submit} onPress={handleLogin}>
        <Text style={styles.submitText}>Se connecter</Text>
      </TouchableOpacity>
      <Text style={styles.signin}>Créer un compte</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    paddingTop: 75,
  },
  title: {
    fontSize: 36,
    marginBottom: 30,
    textAlign: 'center',
    fontFamily:'Poppins-Bold',
    color:'#2B3240',
  },
  input: {
    alignSelf:'center',
    height: 40,
    borderRadius:9,
    marginBottom: 15,
    paddingHorizontal: 8,
    backgroundColor:'#fff',
    width:'100%',
    fontSize:14,
    fontFamily:'Poppins-Light'
  },
  link: {
    color: '#0064D1',
    textAlign: 'center',
    fontFamily:'Poppins-Regular',
    fontSize:'15',
    marginTop:10,
  },
  logo : {
    resizeMode:'contain',
    width:'20%',
    height:'20%',
    alignSelf:'center',
  },
  text : {
    fontSize:17,
    fontFamily:'Poppins-SemiBold',
    color:'#2B3240',
    marginBottom: 5,
  },
  form : {
    alignSelf:'center',
    width:'100%',
  },
  back : {
    resizeMode:'contain',
    height:21,
    width:12,
    marginLeft:10,
  },
  signin : {
    fontFamily:'Poppins-SemiBold',
    fontSize:17,
    textAlign:'center',
    bottom:0,
    color:'#2B3240',
    marginBottom:40,
  },
  submit : {
    alignSelf:'center',
    backgroundColor:'#037AF9',
    padding : 13,
    borderRadius:8,
    width:'70%',
    marginTop:'auto',
    marginBottom:60,
  },
  submitText : {
    color:'#fff',
    fontSize:17,
    fontFamily:'Poppins-SemiBold',
    textAlign:'center',
  }
});

export default LoginScreen;
