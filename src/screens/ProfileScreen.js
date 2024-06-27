import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, ActivityIndicator, Alert, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import * as ImageManipulator from 'expo-image-manipulator';
import AWS from 'aws-sdk';
import Svg, { Rect } from 'react-native-svg';

const SCREEN_WIDTH = Dimensions.get('window').width;
const IMAGE_SIZE = SCREEN_WIDTH * 0.8; // 80% de la largeur de l'écran

const ProfileScreen = ({ token }) => {
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState('');
  const navigation = useNavigation();

  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Sorry, we need camera permissions to make this work!');
      }
    })();
  }, []);

  const resetImage = () => {
    setImage(null);
    setResults('');
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
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
      aspect: [1, 1],
      quality: 1,
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
        [{ resize: { width: IMAGE_SIZE, height: IMAGE_SIZE } }],
        { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG }
      );

      const base64Image = await FileSystem.readAsStringAsync(manipResult.uri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      if (base64Image) {
        await recognizeText(base64Image);
      } else {
        console.error('Impossible de lire l\'image.');
      }
    } catch (error) {
      console.error('Impossible de traiter l\'image:', error);
    }
    // setLoading(false);
  };

  const recognizeText = async (base64Image) => {
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
        const licenseNumberRegex = /^(\d{6})$/;
        const licenseNumbers = response.TextDetections
          .filter(detection => detection.Type === 'WORD' && licenseNumberRegex.test(detection.DetectedText))
          .map(detection => ({
            number: detection.DetectedText,
            boundingBox: detection.Geometry.BoundingBox
          }));

        if (licenseNumbers.length > 0) {
          const fullNumber = licenseNumbers.map(ln => ln.number).join('');
          setResults('Permis numéro ' + fullNumber);
        } else {
          setResults('No valid license number found.');
        }
      } else {
        setResults('No text detected.');
      }
    } catch (error) {
      console.error('Impossible de reconnaître le texte:', error);
      setResults('Error recognizing text.');
    }
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Image style={styles.back} source={require('../img/arrow_back.png')} />
      </TouchableOpacity>
      <Text style={styles.title}>Pour continuer veuillez scanner votre permis de conduire</Text>
      {image ? (
        <View style={styles.previewContainer}>
            {loading && (
        <View style={styles.loading}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      )}
          <Image source={{ uri: image }} style={styles.previewImage} />
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
      <Text style={styles.results}>{results}</Text>

      {results && !results.includes('No valid license number found') && !results.includes('No text detected') && (
        <View style={styles.confirmationContainer}>
          <View style={styles.confirmationButtons}>
            <TouchableOpacity
              style={styles.submit}
              onPress={() => navigation.navigate('Home')}
            >
              <Text style={styles.submitText}>Valider</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.confirmationButton}
              onPress={() => {
                setResults('');
                setImage(null);
              }}
            >
              <Text style={styles.confirmationButtonText}>Recommencer</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {(results.includes('No valid license number found') || results.includes('No text detected')) && (
        <TouchableOpacity
          style={styles.confirmationButton}
          onPress={() => {
            setResults('');
            setImage(null);
          }}
        >
          <Text style={styles.confirmationButtonText}>Reprendre</Text>
        </TouchableOpacity>
      )}
      <TouchableOpacity style={styles.helpLink}>
        <Text style={styles.helpLinkText}>Pourquoi nous sommes obligé de vérifier notre identité ?</Text>
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
      helpLink: {
        position:'absolute',
        bottom:0,
        marginBottom:20,
        alignSelf:'center',
        width:'80%',
      },
      helpLinkText: {
        fontSize:14,
        fontFamily:'Poppins-Regular',
        textDecorationLine: 'underline',
        textAlign:'center',
      },
      title : {
        alignSelf:'center',
        fontFamily:'Poppins-SemiBold',
        fontSize:20,
        marginTop:50,
        textAlign:'center',
    },
      back : {
        resizeMode:'contain',
        height:21,
        width:12,
        marginLeft:10,
      },
      previewContainer: {
        margin:10,
        justifyContent:'center',
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
  button: {
    backgroundColor: '#003772',
    padding: 10,
    marginTop: 20,
    borderRadius: 5,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  imageContainer: {
    position: 'relative',
    width: IMAGE_SIZE,
    height: IMAGE_SIZE,
    marginTop: 20,
  },
  preview: {
    width: '100%',
    height: '100%',
  },
  results: {
    marginTop: 20,
    fontSize: 16,
    color: '#333',
  },
  loading: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex:'10',
    alignSelf:'center'
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
  },
  confirmationButtonText : {
    alignSelf:'center',
    fontSize:15,
    marginTop:13,
    },
    results : {
        alignSelf:'center',
    }
});

export default ProfileScreen;