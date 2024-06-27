import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const Header = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.headerWrapper}>
      <View style={styles.headerContainer}>
        <Image 
          source={require('../img/Logo_Fynn_header.png')}
          style={styles.logo} 
        />
        <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
          <Image 
            source={require('../img/Intersectprofile.png')} 
            style={styles.profileIcon} 
          />
        </TouchableOpacity>
      </View>
      <View style={styles.navBar}>
        <TouchableOpacity style={styles.navItems}>
          <Image source={require('../img/navbar_profile_logo.png')} style={styles.navbarIcons}></Image>
          <View style={styles.underline}></View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItems}>
        <Image source={require('../img/navbar_eco_logo.png')} style={styles.navbarIcons}></Image>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItems} onPress={() => navigation.navigate('ChatBot')}>
        <Image source={require('../img/navbar_health_logo.png')} style={styles.navbarIcons}></Image>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerWrapper: {
    width: '100%',
    backgroundColor: '#fff',
    borderBottomLeftRadius : 14,
    borderBottomRightRadius : 14,
    paddingTop: 80,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  headerContainer: {
    alignItems: 'flex-end',
    justifyContent:'flex-end',
    width:'100%',
    position:'relative',
    marginBottom:20,
  },
  logo: {
    width: 50,
    height: 50,
    position:'absolute',
    alignSelf:'center',
  },
  profileIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight:10,
  },
  navBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  navbarIcons: {
    width:20,
    resizeMode:'contain',
    marginBottom:-15,
  },
  navItems: {
    width:'28%',
    alignItems:'center',
  },
  underline: {
    height: 5,
    width:'100%',
    backgroundColor:'#2B3240',
    borderRadius:3,
    marginBottom:-2.5,
  }
});

export default Header;