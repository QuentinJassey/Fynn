import React, { useState, useEffect, useContext, useRef } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  FlatList, 
  StyleSheet, 
  KeyboardAvoidingView, 
  Platform, 
  ActivityIndicator,
  SafeAreaView,
  Dimensions,
  Image
} from 'react-native';
import axios from 'axios';
import { VehicleContext } from '../../VehicleContext';
import { Ionicons } from '@expo/vector-icons';
import Markdown from 'react-native-markdown-display';
import { useNavigation } from '@react-navigation/native';
import Header from '../components/Header_Chatbot';

const { width, height } = Dimensions.get('window');

const ChatBotScreen = () => {
  const navigation = useNavigation();
  const { vehicleInfo } = useContext(VehicleContext);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [loadingMessages] = useState([
    "Chargement en cours...",
    "On y est presque...",
    "Encore un petit instant...",
    "Préparation de la réponse...",
    "Analyse des données..."
  ]);
  const [currentLoadingMessage, setCurrentLoadingMessage] = useState(0);
  const flatListRef = useRef(null);

  const systemPrompt = `Vous êtes un ASSISTANT AUTOMOBILE EXPERT spécialisé dans le diagnostic et la résolution de problèmes automobiles. Votre tâche est de fournir des informations précises et utiles sur les véhicules, en vous concentrant sur les PROBLÈMES COURANTS et leurs SOLUTIONS.

INFORMATIONS SUR LE VÉHICULE DE L'UTILISATEUR :
- Marque: ${vehicleInfo.make}
- Modèle: ${vehicleInfo.model}
- Année: ${vehicleInfo.year || 'Non spécifiée'}
- Type de carburant: ${vehicleInfo.fuelType || 'Non spécifié'}
- VIN: ${vehicleInfo.vin || 'Non spécifié'}

DIRECTIVES IMPORTANTES :
1. UTILISEZ CES INFORMATIONS comme contexte pour vos réponses.
2. Vos réponses doivent être CONCISES mais INFORMATIVES.
3. METTEZ EN GRAS les informations clés et les titres des problèmes.
4. LISTEZ les problèmes et leurs solutions.
5. Fournissez ENTRE 3 ET 5 PROBLÈMES COURANTS pour chaque requête.

EXEMPLE DE FORMAT DE RÉPONSE :
1. **Problème 1**: Description brève
   - Solution: Étapes ou conseils pour résoudre
2. **Problème 2**: Description brève
   - Solution: Étapes ou conseils pour résoudre

ADAPTEZ vos réponses en fonction de l'âge, du modèle et du type de carburant du véhicule.`;

  useEffect(() => {
    if (vehicleInfo.make && vehicleInfo.model) {
      fetchInitialResponse();
    }
  }, [vehicleInfo]);

  useEffect(() => {
    if (initialLoading) {
      const interval = setInterval(() => {
        setCurrentLoadingMessage((prev) => (prev + 1) % loadingMessages.length);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [initialLoading, loadingMessages]);

  const formatInitialResponse = (response) => {
    if (!response) return '';
    let formattedResponse = response.trim();
    return '\n' + formattedResponse + '\n';
  };

  const fetchInitialResponse = async () => {
    setInitialLoading(true);
    const initialMessage = `En tant qu'assistant automobile, veuillez fournir une liste des PROBLÈMES COURANTS et leurs SOLUTIONS pour une ${vehicleInfo.year || ''} ${vehicleInfo.make} ${vehicleInfo.model} utilisant du ${vehicleInfo.fuelType || ' '}. 

INSTRUCTIONS SPÉCIFIQUES :
1  Tu dois commencer par "Les problèmes courants et leurs solutions pour votre ${vehicleInfo.year || ''} ${vehicleInfo.make} ${vehicleInfo.model}".
2. Listez 3 problèmes courants.
3. Les TITRES des problèmes doivent être en GRAS.
4. Pour chaque problème, fournissez une SOLUTION CONCISE.
5. Adaptez votre réponse aux spécificités du véhicule mentionné.
6. Reformule les informations de marque et modèle du véhicule dans ta réponse pour faire user-friendly.
7. Invite l'utilisateur à poser des questions supplémentaires s'il le souhaite. Ou si il a un problème spécifique, il peut le mentionner.`;

    try {
      const response = await callOpenAIAPI(initialMessage);
      const formattedResponse = formatInitialResponse(response);
      setMessages([{ role: 'assistant', content: formattedResponse }]);
    } catch (error) {
      console.error('Error fetching initial response:', error);
      setMessages([{ role: 'assistant', content: "Désolé, je n'ai pas pu charger l'information initiale. Veuillez réessayer." }]);
    } finally {
      setInitialLoading(false);
    }
  };

  const callOpenAIAPI = async (message) => {
    const apiKey = "sk-my-fynn-app-p1e8ntKf7snzOZ6tRFQOT3BlbkFJm6DlADRIi5fO94be7hns";
    if (!apiKey) {
      console.error('API key not found.');
      return 'API key not found.';
    }

    const payload = {
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: message }
      ]
    };

    try {
      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        payload,
        {
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
        }
      );
      return response.data.choices[0].message.content.trim();
    } catch (error) {
      console.error(error);
      return 'Une erreur s\'est produite lors de la récupération de la réponse.';
    }
  };

  const handleSend = async () => {
    if (input.trim() === '') return;

    const userMessage = { role: 'user', content: input };
    setMessages(prevMessages => [...prevMessages, userMessage]);
    setInput('');
    setLoading(true);

    const botResponse = await callOpenAIAPI(input);
    const botMessage = { role: 'assistant', content: botResponse };

    setMessages(prevMessages => [...prevMessages, botMessage]);
    setLoading(false);
  };

  const renderMessage = ({ item }) => (
    <View style={[
      styles.messageBubble,
      item.role === 'assistant' ? styles.assistantBubble : styles.userBubble
    ]}>
      {item.role === 'assistant' ? (
        <Markdown style={markdownStyles}>
          {item.content}
        </Markdown>
      ) : (
        <Text style={[styles.messageText, styles.userText]}>
          {item.content}
        </Text>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      {/* <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Image source={require('../img/arrow_back.png')} style={styles.backIcon} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Fynn Assistance</Text>
      </View> */}
      <Header style={styles.header}></Header>
        <Image style={styles.title} source={require('../img/predictiveCare.png')}></Image>
      <KeyboardAvoidingView
        style={styles.chat}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
      >
        {initialLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#007AFF" />
            <Text style={styles.loadingText}>{loadingMessages[currentLoadingMessage]}</Text>
          </View>
        ) : (
          <View style={styles.chatContainer}>
            <FlatList
              ref={flatListRef}
              data={messages}
              renderItem={renderMessage}
              keyExtractor={(item, index) => index.toString()}
              contentContainerStyle={styles.messageList}
              onContentSizeChange={() => flatListRef.current.scrollToEnd({animated: true})}
              onLayout={() => flatListRef.current.scrollToEnd({animated: true})}
            />
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                value={input}
                onChangeText={setInput}
                placeholder="Message..."
                placeholderTextColor="#888"
              />
              <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
                <Ionicons name="send" size={24} color="#007AFF" />
              </TouchableOpacity>
            </View>
          </View>
        )}
      </KeyboardAvoidingView>
    </View>
  );
};

const markdownStyles = {
  body: {
    color: '#000',
    fontSize: 12,
  },
  paragraph: {
    marginBottom: 10,
  },
  strong: {
    fontWeight: 'bold',
  },
  list: {
    marginBottom: 10,
  },
  listItem: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  listItemNumber: {
    fontWeight: 'bold',
    marginRight: 5,
  },
  listItemContent: {
    flex: 1,
  },
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:'#F5F5F5'
  },
  title : {
    resizeMode:'contain',
    width:195,
    height:50,
    marginLeft:18,
  },    
  chat: {
    flex: 1,
    backgroundColor:'#FFF',
    width:'90%',
    alignSelf:'center',
    borderRadius:9,
    marginBottom:50,
  },
  chatContainer: {
    flex: 1,
  },
  messageList: {
    paddingHorizontal: 15,
    paddingBottom: 20,
    paddingTop: 20,
  },
  messageBubble: {
    padding: 12,
    borderRadius: 20,
    marginVertical: 5,
    maxWidth: '90%',
  },
  assistantBubble: {
    backgroundColor: '#E5E5EA',
    alignSelf: 'flex-start',
    borderBottomLeftRadius: 5,
    padding: 15,
    marginLeft: 5,
    marginRight: 50,
    marginVertical: 5,
    width:'85%',
  },
  userBubble: {
    backgroundColor: '#007AFF',
    alignSelf: 'flex-end',
    borderBottomRightRadius: 5,
  },
  messageText: {
    fontSize: 12,
    lineHeight: 22,
  },
  userText: {
    color: '#FFF',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#FFF',
    // borderTopWidth: 1,
    // borderTopColor: '#E5E5EA',
  },
  input: {
    flex: 1,
    backgroundColor: '#F2F2F7',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 15,
    fontSize: 16,
    marginRight: 10,
  },
  sendButton: {
    padding: 5,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(242, 242, 247, 0.7)',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#007AFF',
  },
  header : {
    zIndex:100,
  }
});

export default ChatBotScreen;