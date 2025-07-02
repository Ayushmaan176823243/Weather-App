import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HomeScreen } from '../screens/HomeScreen';
import { LogBox } from 'react-native';

const Stack = createNativeStackNavigator();

LogBox.ignoreAllLogs(['Non-serializable values were found in the navigation state']);

export const AppNavigation = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ headerShown: false }} // ✅ Fixed here
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
