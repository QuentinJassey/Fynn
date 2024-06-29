# FYNN Mobilities App

This is a React Native mobile application built with Expo for FYNN Mobilities. The app provides features related to vehicle management, eco-driving, and driver profiles.

## Project Structure

```
.expo/
assets/
node_modules/
src/
  components/
    DriverProfileSection.js
    EcoDrivingSection.js
    Header_Chatbot.js
    Header.js
    VehicleHealthSection.js
    VehicleSection.js
  img/
  screens/
    ChatBotScreen.js
    HomeScreen.js
    LandingScreen.js
    LocationScreen.js
    LoginScreen.js
    Onboarding1.js
    Onboarding2.js
    ProfileScreen.js
    TrophyScreen.js
  ApolloClient.js
  Navigation.js
.gitattributes
App.js
app.json
babel.config.js
package-lock.json
package.json
react-native.config.js
useFonts.js
VehicleContext.js
```

## Key Components

- `App.js`: Main entry point of the application
- `Navigation.js`: Handles app navigation
- `ApolloClient.js`: Sets up Apollo Client for GraphQL queries
- `VehicleContext.js`: Provides context for vehicle data across the app

## Screens

- `HomeScreen.js`: Main dashboard
- `ChatBotScreen.js`: AI chatbot interface
- `LocationScreen.js`: Vehicle location tracking
- `LoginScreen.js`: User authentication
- `ProfileScreen.js`: User profile management
- `TrophyScreen.js`: Achievements and rewards

## Setup and Running

1. Install nodeJS and then the dependencies by running:
   ```
   npm install
   ```

2. Start the Expo development server:
   ```
   npx expo start
   ```

3. Use the Expo Go app on your mobile device or an emulator to run the application.

## Dependencies

See `package.json` for a full list of dependencies.

## Configuration

- `app.json`: Expo configuration
- `babel.config.js`: Babel configuration
- `react-native.config.js`: React Native configuration

## Additional Information

- The app uses custom fonts, managed in `useFonts.js`
- GraphQL integration is set up with Apollo Client
- The app includes onboarding screens for new users

For more detailed information about specific components or features, please refer to the individual files in the project.
