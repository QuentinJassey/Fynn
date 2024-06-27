import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const TrophyScreen = () => {
  return (
    <View style={styles.container}>
      <Text>Trophy Screen</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default TrophyScreen;