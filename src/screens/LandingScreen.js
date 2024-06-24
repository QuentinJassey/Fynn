import React from 'react';
import { View, Text, ImageBackground, TouchableOpacity, StyleSheet, Image } from 'react-native';

function LandingScreen({ navigation }) {

  return (
    <View style={styles.container}>
      <ImageBackground source={require('../img/Background_Landing_GIF.gif')} style={styles.background}>
      <Image style={styles.gradient} source={require('../img/landing_gradient.png')}></Image>
        <Image style={styles.logo} source={require('../img/Logo_Fynn_header.png')}></Image>
          <TouchableOpacity style={styles.login} onPress={() => navigation.navigate('Login')}>
            <Text style={styles.loginText}>Se connecter</Text>
          </TouchableOpacity>
          <Text style={styles.signin}>Acheter mon CarLink</Text>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  logo: {
    resizeMode: 'contain',
    width: '13%',
    height: '13%',
    alignSelf: 'center',
    marginTop: 75,
  },
  signin: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    textAlign: 'center',
    bottom: 0,
    color: '#fff',
    marginBottom: 70,
  },
  login: {
    alignSelf: 'center',
    backgroundColor: '#037AF9',
    padding: 13,
    borderRadius: 8,
    width: '60%',
    marginTop: 'auto',
    marginBottom: 15,
  },
  loginText: {
    color: '#fff',
    fontSize: 17,
    fontFamily: 'Poppins-SemiBold',
    textAlign: 'center',
  },
  background: {
    resizeMode: 'cover',
    height: '100%',
  },
  gradient: {
    width:'100%',
    height:'35%',
    position:'absolute',
    bottom:0,
    alignSelf:'center',
  }
});

export default LandingScreen;
