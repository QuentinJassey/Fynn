import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import { useQuery, gql } from '@apollo/client';

const GET_VEHICLE_INFO = gql`
  query GetVehicleInfo {
    vehicles {
      list {
        vin_descriptions {
          make
          model
          year_of_sale
          url_vehicle_image
          color
          doors
        }
      }
    }
  }
`;

function VehicleSection() {
  const { loading, error, data } = useQuery(GET_VEHICLE_INFO);
  const [vehicle, setVehicle] = useState(null);

  useEffect(() => {
    if (data && data.vehicles && data.vehicles.list.length > 0) {
      const vehicleData = data.vehicles.list[0].vin_descriptions;
      if (vehicleData.url_vehicle_image) {
        const modifiedUrl = vehicleData.url_vehicle_image.replace(/\.\w+$/, '.png');
        const updatedVehicleData = { ...vehicleData, url_vehicle_image: modifiedUrl };
        console.log('Original URL:', vehicleData.url_vehicle_image);
        console.log('Modified URL:', modifiedUrl);
        setVehicle(updatedVehicleData);
      } else {
        setVehicle(vehicleData);
      }
    }
  }, [data]);

  if (loading) return <Text>Loading...</Text>;
  if (error) return <Text>Error: {error.message}</Text>;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {vehicle ? (
        <View style={styles.vehicleContainer}>
          <Text style={styles.title1}>Mon véhicule</Text>
          <View style={styles.imageContainer}>
            <Image style={styles.image} source={{ uri: vehicle.url_vehicle_image }} />
          </View>
        </View>
      ) : (
        <Text>No vehicle data available</Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  title1: {
    alignSelf: 'flex-start',
    fontSize: 24,
    color: '#2B3240',
    fontFamily: 'Poppins-Bold',
  },
  vehicleContainer: {
    borderRadius: 10,
    padding: 16,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    paddingBottom: 0,
  },
  imageContainer: {
    width: '100%',
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
    marginTop: -40,
  },
});

export default VehicleSection;
