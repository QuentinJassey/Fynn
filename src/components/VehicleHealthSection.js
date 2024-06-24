// src/components/VehicleHealthSection.js
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { useQuery, gql } from '@apollo/client';

const GET_VEHICLE_HEALTH = gql`
  query Vehicles {
    vehicles {
      list {
        alerts(is_active: true) {
          count
        }
      }
    }
  }
`;

function VehicleHealthSection() {
  const { loading, error, data } = useQuery(GET_VEHICLE_HEALTH);
  const [alertCount, setAlertCount] = useState(null);

  useEffect(() => {
    if (data && data.vehicles && data.vehicles.list.length > 0) {
      const firstVehicle = data.vehicles.list[0];
      const alerts = firstVehicle.alerts;
      if (alerts && alerts.count !== null) {
        setAlertCount(alerts.count);
      }
    }
  }, [data]);

  if (loading) return <Text>Loading...</Text>;
  if (error) return <Text>Error: {error.message}</Text>;

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
      <Image style={styles.profileIcon} source={require('../img/health_logo.png')}></Image>
      <Text style={styles.title}>Santé du véhicule</Text>
      <Image style={styles.arrow} source={require('../img/click_arrow.png')}></Image>
      </View>
      <View style={styles.content}>
        <View style={styles.eco}>
        <Text style={styles.ecoTitle}>• Erreurs DTC</Text>
      <Text style={styles.score}>{alertCount !== null ? alertCount  : 'N/A'}<Text style={styles.pourcentage}> problème(s)</Text></Text>
      </View>
      <View style={styles.separation}></View>
      <View style={styles.lastWeek}>
        <Text style={styles.lastWeekText}>• La semaine dernière</Text>
        <View style={styles.improvement}>
          <Image style={styles.upgrade} source={require('../img/deterioration.png')}></Image>
          <Text style={styles.improvementText}>Détérioration notable</Text>
        </View>
      </View>
    </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignSelf:'center',
    backgroundColor: '#FCFCFC',
    borderRadius: 10,
    padding: 13,
    width: '90%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 9,
    elevation: 5,
    marginBottom: 16,
  },
  title: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color:'#2A509D',
    justifyContent:'center',
    alignItems:'center',
    paddingLeft:10,
  },
  eco : {
    width: '50%',
    padding:5,
  },
  score: {
    fontSize: 36,
    alignSelf:'center',
    fontFamily:'Poppins-Bold',
    color:'#2B3240',
  },
  lastWeek: {
    justifyContent: 'space-between',
    alignItems: 'center',
    width:'50%',
    padding:5,
  },
  lastWeekText: {
    fontSize: 13,
    color: '#000',
    fontFamily:'Poppins-SemiBold',
  },
  improvement: {
    flexDirection:'row',
    top:-5,
    width:'90%',
  },
  improvementText: {
    fontSize: 13,
    color:'#CA0000',
    fontFamily:'Poppins-SemiBold',
  },
  titleContainer: {
    alignItems:'center',
    flexDirection:'row',
    bottom:0,
    paddingBottom:5,
  },
  profileIcon : {
    resizeMode:'contain',
    width:20,
    height:20,
    paddingTop:0,
  },
  content: {
    flexDirection:'row',
    display:'flex',
    justifyContent:'space-arround',
  },
  separation : {
    width:2,
    backgroundColor:'#D6D6D6',
    borderRadius:2,
  },
  ecoTitle : {
    fontSize: 13,
    color: '#2A509D',
    fontFamily:'Poppins-SemiBold',
    marginBottom:10,
  },
  pourcentage : {
    fontSize: 13,
    fontFamily:'Poppins-SemiBold',
  },
  upgrade : {
    resizeMode:'contain',
    height:40,
  },
  arrow : {
    resizeMode:'contain',
    height:17,
    right:-15,
    position:'absolute',
    top:2.5,
  },
});

export default VehicleHealthSection;
