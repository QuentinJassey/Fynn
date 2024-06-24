// src/screens/HomeScreen.js
import React from 'react';
import { View, StyleSheet, ScrollView, Text } from 'react-native';
import VehicleSection from '../components/VehicleSection';
import DriverProfileSection from '../components/DriverProfileSection';
import EcoDrivingSection from '../components/EcoDrivingSection';
import VehicleHealthSection from '../components/VehicleHealthSection';
import Header from '../components/Header';
import { ApolloProvider } from '@apollo/client';
import client from '../ApolloClient';

function HomeScreen() {
  return (
    <ApolloProvider client={client}>
      <View style={styles.container}>
        <Header />
        <ScrollView contentContainerStyle={styles.contentContainer}>
          <VehicleSection />
          <Text style={styles.title}>Point clés de la semaine</Text>
          <DriverProfileSection />
          <EcoDrivingSection />
          <VehicleHealthSection />
        </ScrollView>
      </View>
    </ApolloProvider>
  );
}

const styles = StyleSheet.create({
title : {
  paddingTop:0,
  padding:16,
  fontSize:23,
  fontFamily:'Poppins-Bold',
  color:'#2B3240'
}, 
container: {
  flex: 1,
},
});

export default HomeScreen;
