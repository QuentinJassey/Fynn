// src/components/DriverProfileSection.js
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { useQuery, gql } from '@apollo/client';

const getFormattedDate = (date) => {
  return date.toISOString().split('.')[0] + 'Z';
};

const endDate = new Date();
const startDate = new Date();
startDate.setDate(startDate.getDate() - 30);

const GET_DRIVER_PROFILE = gql`
  query Devices($start_date: DateTime!, $end_date: DateTime!) {
    devices {
      list {
        trip_summary(
          end_date: $end_date
          start_date: $start_date
        ) {
          safety_score
        }
      }
    }
  }
`;

function DriverProfileSection() {
  const { loading, error, data } = useQuery(GET_DRIVER_PROFILE, {
    variables: {
      start_date: getFormattedDate(startDate),
      end_date: getFormattedDate(endDate),
    },
  });

  const [safetyScore, setSafetyScore] = useState(null);

  useEffect(() => {
    if (data && data.devices && data.devices.list.length > 0) {
      const firstDevice = data.devices.list[0];
      const tripSummary = firstDevice.trip_summary;
      if (tripSummary && tripSummary.safety_score !== null) {
        setSafetyScore(tripSummary.safety_score);
      }
    }
  }, [data]);

  if (loading) return <Text>Loading...</Text>;
  if (error) return <Text>Error: {error.message}</Text>;

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
      <Image style={styles.profileIcon} source={require('../img/profile_conducteur_logo.png')}></Image>
      <Text style={styles.title}>Profil conducteur</Text>
      <Image style={styles.arrow} source={require('../img/click_arrow.png')}></Image>
      </View>
      <View style={styles.content}>
        <View style={styles.security}>
      <Text style={styles.securityTitle}>• Score de sécurité</Text>
      <Text style={styles.score}>{safetyScore !== null ? safetyScore.toFixed(1) : 'N/A'}<Text style={styles.pourcentage}> %</Text></Text>
      </View>
      <View style={styles.separation}></View>
      <View style={styles.lastWeek}>
        <Text style={styles.lastWeekText}>• La semaine dernière</Text>
        <View style={styles.improvement}>
          <Image style={styles.upgrade} source={require('../img/upgrade.png')}></Image>
          <Text style={styles.improvementText}>Amélioration significative</Text>
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
  security : {
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
    color:'#2CBA29',
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
  securityTitle : {
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
  }
});

export default DriverProfileSection;
