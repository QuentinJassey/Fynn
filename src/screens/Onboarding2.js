import React, { useState, useEffect, useContext } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useLazyQuery, gql } from '@apollo/client';
import { VehicleContext } from '../../VehicleContext';

const DECODE_PLATE_QUERY = gql`
  query decodePlate($plate: String!, $country: String!) {
    decodePlate(plate: $plate, country: $country) {
      id
      vin
      make
      model
      engineFuelType
      urlVehicleImage
      year_of_first_circulation
    }
  }
`;

const Onboarding2 = ({ route }) => {
  const { plate } = route.params;
  const [vehicleInfo, setVehicleInfo] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  const { setVehicleInfo: setGlobalVehicleInfo } = useContext(VehicleContext);

  const [decodePlate, { data, loading: queryLoading, error: queryError }] = useLazyQuery(DECODE_PLATE_QUERY);

  useEffect(() => {
    if (plate) {
      console.log("Plaque reçue:", plate);
      decodePlate({ variables: { plate, country: 'FR' } });
    } else {
      setError('Numéro de plaque manquant');
    }
  }, [plate]);

  useEffect(() => {
    if (data) {
      const vehicleData = data.decodePlate[0];
      if (vehicleData) {
        if (vehicleData.urlVehicleImage) {
          const modifiedUrl = vehicleData.urlVehicleImage.replace(/\.\w+$/, '.png');
          const updatedVehicleData = { ...vehicleData, urlVehicleImage: modifiedUrl };
          setVehicleInfo(updatedVehicleData);
        } else {
          setVehicleInfo(vehicleData);
        }
      } else {
        setError('Aucune information de véhicule trouvée.');
      }
      setLoading(false);
    }
  }, [data]);

  useEffect(() => {
    if (queryError) {
      setError('Erreur lors du décodage de la plaque');
      console.error("Erreur de décodage de la plaque", queryError);
      setLoading(false);
    }
  }, [queryError]);

  const handleConfirmation = () => {
    if (vehicleInfo) {
      setGlobalVehicleInfo({
        make: vehicleInfo.make,
        model: vehicleInfo.model,
        year: vehicleInfo.year_of_first_circulation || 'N/A',
        image: vehicleInfo.urlVehicleImage,
        fuelType: vehicleInfo.engineFuelType,
        vin: vehicleInfo.vin,
      });
      navigation.navigate('Main');
    } else {
      setError('Aucune information de véhicule disponible');
    }
  };

  return (
    <View style={styles.container}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
        <Image style={styles.back} source={require('../img/arrow_back.png')} />
      </TouchableOpacity>
      
      <Text style={styles.title}>Mon véhicule : </Text>
      {(loading || queryLoading) && <ActivityIndicator size="large" color="#0000ff" />}
      {error ? <Text style={styles.error}>{error}</Text> : null}
      {vehicleInfo && (
        <View style={styles.infoContainer}>
          {vehicleInfo.urlVehicleImage && (
            <View style={styles.imageContainer}>
                <Image
               source={require('../img/bg_onboarding.png')}
              style={styles.bg_onboarding}
            />
            <Image
              source={{ uri: vehicleInfo.urlVehicleImage }}
              style={styles.image}
            />
            </View>
          )}
          <Text style={styles.infoText}>{vehicleInfo.make} {vehicleInfo.model}</Text>
        </View>
      )}
      <TouchableOpacity
          style={styles.submit}
          onPress={handleConfirmation}
        >
          <Text style={styles.submitText}>Bienvenue sur Fynn</Text>
        </TouchableOpacity>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.confirmationButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.confirmationButtonText}>Non, ce n'est pas mon véhicule</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        paddingTop: 75,
      },
    imageContainer: {
    marginTop:100,
    marginBottom:20,
    width: '100%',
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    },
    image: {
    width: 300,
    height: '150%',
    margin:'auto',
    resizeMode: 'contain',
    position:'absolute',
    alignSelf:'center',
    },
    bg_onboarding : {
    alignSelf:'center',
    },
    submit : {
    alignSelf:'center',
    backgroundColor:'#037AF9',
    padding : 13,
    borderRadius:8,
    width:200,
    marginTop:40,
    },
    submitText : {
    color:'#fff',
    fontSize:16,
    fontFamily:'Poppins-SemiBold',
    textAlign:'center',
    },
    confirmationButtonText : {
    alignSelf:'center',
    fontSize:15,
    marginTop:13,
    },
    infoText: {
        fontSize: 20,
        alignSelf:'center',
        fontFamily:'Poppins-Medium',
        textAlign:'center',
    },
    back : {
        resizeMode:'contain',
        height:21,
        width:12,
        marginLeft:10,
    },
    title : {
        alignSelf:'center',
        fontFamily:'Poppins-SemiBold',
        fontSize:20,
        marginTop:50,
    },
});

export default Onboarding2;
