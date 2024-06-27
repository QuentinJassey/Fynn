import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Image } from 'react-native';
import LoginScreen from './screens/LoginScreen';
import HomeScreen from './screens/HomeScreen';
import LandingScreen from './screens/LandingScreen';
import Onboarding1 from './screens/Onboarding1';
import Onboarding2 from './screens/Onboarding2';
import ChatBotScreen from './screens/ChatBotScreen';
import ProfileScreen from './screens/ProfileScreen';
import TrophyScreen from './screens/TrophyScreen';
import LocationScreen from './screens/LocationScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const HomeIcon = require('../assets/icons/home.png');
const LocationIcon = require('../assets/icons/location.png');
const TrophyIcon = require('../assets/icons/trophy.png');
const ProfileIcon = require('../assets/icons/profile.png');

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused }) => {
          let iconName;
          let tintColor = focused ? '#2B3240' : '#8e8e93';

          if (route.name === 'Home') {
            iconName = HomeIcon;
          } else if (route.name === 'Location') {
            iconName = LocationIcon;
          } else if (route.name === 'Trophy') {
            iconName = TrophyIcon;
          } else if (route.name === 'Profile') {
            iconName = ProfileIcon;
          }

          return (
            <Image
              source={iconName}
              style={{ tintColor: tintColor, width: '100%'}}
              resizeMode="contain"
            />
          );
        },
        tabBarShowLabel: false,
        tabBarActiveTintColor: '#2B3240',
        tabBarInactiveTintColor: '#8e8e93',
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ headerShown: false }}/>
      <Tab.Screen name="Location" component={LocationScreen} options={{ headerShown: false }}/>
      <Tab.Screen name="Trophy" component={TrophyScreen} options={{ headerShown: false }}/>
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ headerShown: false }}/>
    </Tab.Navigator>
  );
}


function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Landing">
        <Stack.Screen name="Landing" component={LandingScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Main" component={MainTabs} options={{ headerShown: false }} />
        <Stack.Screen name="Onboarding1" component={Onboarding1} options={{ headerShown: false }} />
        <Stack.Screen name="Onboarding2" component={Onboarding2} options={{ headerShown: false }} />
        <Stack.Screen name="ChatBot" component={ChatBotScreen} options={{ headerShown: false}} />
        <Stack.Screen name="Profile" component={ProfileScreen} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default AppNavigator;
