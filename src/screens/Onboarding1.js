import { CameraView } from 'expo-camera';
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, TextInput, SafeAreaView, Dimensions, Modal, ActivityIndicator, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import * as ImageManipulator from 'expo-image-manipulator';
import { gql, useQuery, useMutation } from '@apollo/client';
import AWS from 'aws-sdk';
import Svg, { Rect } from 'react-native-svg';

const { width, height } = Dimensions.get('window');

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

const Onboarding1 = () => {
  const [plateNumber, setPlateNumber] = useState('');
  const [country, setCountry] = useState('FR');
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [boundingBox, setBoundingBox] = useState(null);
  const navigation = useNavigation();

  const { data, loading: queryLoading, error } = useQuery(DECODE_PLATE_QUERY, {
    variables: { plate: plateNumber, country: country },
    skip: !plateNumber,
  });

  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Sorry, we need camera permissions to make this work!');
      }
    })();
  }, []);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      processImage(result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.5,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      processImage(result.assets[0].uri);
    }
  };

  const processImage = async (uri) => {
    setLoading(true);
    try {
      const manipResult = await ImageManipulator.manipulateAsync(
        uri,
        [{ resize: { width: 800 } }],
        { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG }
      );

      const base64Image = await FileSystem.readAsStringAsync(manipResult.uri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      if (base64Image) {
        await recognizePlate(base64Image);
      } else {
        console.error('Impossible de lire l\'image.');
      }
    } catch (error) {
      console.error('Impossible de traiter l\'image:', error);
    }
    setLoading(false);
  };

  const recognizePlate = async (base64Image) => {
    AWS.config.update({
      region: 'us-east-1',
      credentials: new AWS.CognitoIdentityCredentials({
        IdentityPoolId: 'us-east-1:686834cd-c5a9-4edf-b110-f19ea83e8dfb',
      }),
    });

    const rekognition = new AWS.Rekognition();
    const imageBytes = Uint8Array.from(atob(base64Image), c => c.charCodeAt(0));
    const params = { Image: { Bytes: imageBytes } };

    try {
      const response = await rekognition.detectText(params).promise();
      if (response && response.TextDetections) {
        const plateRegex = /^[A-Z]{2}-\d{3}-[A-Z]{2}$/;
        const licensePlate = response.TextDetections
          .find(detection => detection.Type === 'LINE' && plateRegex.test(detection.DetectedText));
        
        if (licensePlate) {
          setPlateNumber(licensePlate.DetectedText);
          setBoundingBox(licensePlate.Geometry.BoundingBox);
        } else {
          console.log('Aucune plaque valide détectée.');
          setBoundingBox(null);
        }
      } else {
        console.log('Aucun texte détecté.');
        setBoundingBox(null);
      }
    } catch (error) {
      console.error('Impossible de reconnaître la plaque:', error);
      setBoundingBox(null);
    }
  };

  const resetImage = () => {
    setImage(null);
    setPlateNumber('');
    setBoundingBox(null);
  };

  const handleSubmit = () => {
    if (plateNumber && !queryLoading && !error && data) {
      navigation.navigate('Onboarding2', { plate: plateNumber });
    } else {
      console.log('Veuillez entrer un numéro de plaque valide ou réessayer.');
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Image style={styles.back} source={require('../img/arrow_back.png')} />
      </TouchableOpacity>
      
      <Text style={styles.title}>Entrez votre plaque d'immatriculation</Text>
      
      {image ? (
        <View style={styles.previewContainer}>
          <Image source={{ uri: image }} style={styles.previewImage} />
          {/* {boundingBox && (
            <Svg height="209" width="315" style={StyleSheet.absoluteFill}>
              <Rect
                x={boundingBox.Left * 315}
                y={boundingBox.Top * 209}
                width={boundingBox.Width * 315}
                height={boundingBox.Height * 209}
                stroke="red"
                strokeWidth="2"
                fill="none"
              />
            </Svg>
          )} */}
          <TouchableOpacity style={styles.resetButton} onPress={resetImage}>
            <Text style={styles.resetButtonText}>✕</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.selection}>
          <TouchableOpacity style={styles.cameraButton} onPress={takePhoto}>
            <Image style={styles.iconImage} source={require('../img/CameraSelection.png')} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.libraryButton} onPress={pickImage}>
            <Image style={styles.iconImage} source={require('../img/LibrarySelection.png')} />
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.form}>
        <Text style={styles.plateTitle}>Plaque d'immatriculation</Text>
        <TextInput
          style={styles.input}
          value={plateNumber}
          onChangeText={setPlateNumber}
          placeholder="AA-123-AA"
          autoCapitalize="characters"
          maxLength={9}
        />
        <Text style={styles.orText}>Ou : <Text style={styles.saisie}>Saisir manuellement</Text></Text>
        
        {loading || queryLoading ? (
          <ActivityIndicator size="large" color="#258EFF" style={styles.loader} />
        ) : (
          <TouchableOpacity style={styles.submit} onPress={handleSubmit}>
            <Text style={styles.submitText}>Valider</Text>
          </TouchableOpacity>
        )}
      </View>
      
      <TouchableOpacity style={styles.helpLink}>
        <Text style={styles.helpLinkText}>Pourquoi j'ai besoin de renseigner ma plaque ?</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    paddingTop: 75,
  },
  previewContainer: {
    margin:10,
  },
  previewImage: {
    alignSelf:'center',
    width: 315,
    height: 209,
    borderRadius: 10,
  },
  resetButton: {
    position: 'absolute',
    top: 8,
    right: 10,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent:'center',
  },
  resetButtonText: {
    color: '#FFF',
    fontSize: 18,
    alignSelf:'center',
  },
  helpLink: {
    position:'absolute',
    bottom:0,
    marginBottom:40,
    alignSelf:'center',
  },
  helpLinkText: {
    fontSize:12,
    fontFamily:'Poppins-Regular',
    textDecorationLine: 'underline',
  },
  back : {
    resizeMode:'contain',
    height:21,
    width:12,
    marginLeft:10,
  },
  iconImage: {
    width: 150,
    height: 209,
    resizeMode: 'contain',
  },
  selection: {
    flexDirection:'row',
    justifyContent: 'center',
    gap:15,
    paddingTop:50
  },
  title : {
    alignSelf:'center',
    fontFamily:'Poppins-SemiBold',
    fontSize:20,
    marginTop:50,
  },
  form : {
    alignSelf:'center',
    width:'85%',
    paddingTop:20,
  },
  plateTitle : {
    fontFamily:'Poppins-SemiBold',
    fontSize:16,
    paddingBottom:5,
  },
  orText : {
    fontFamily:'Poppins-Bold',
    alignSelf:'center',
  },
  saisie : {
    fontFamily:'Poppins-Medium'
  },
  input: {
    alignSelf:'center',
    height: 40,
    borderRadius:9,
    marginBottom: 5,
    paddingHorizontal: 8,
    backgroundColor:'#fff',
    width:'100%',
    fontSize:14,
    fontFamily:'Poppins-Light',
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
    fontSize:17,
    fontFamily:'Poppins-SemiBold',
    textAlign:'center',
  }
});

export default Onboarding1;