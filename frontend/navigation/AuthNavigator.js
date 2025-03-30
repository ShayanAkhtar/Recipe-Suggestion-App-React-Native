// navigation/AuthNavigator.js
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../screens/LoginScreen';
import SignupScreen from '../screens/SignupScreen';

const Stack = createStackNavigator();

const AuthNavigator = ({ handleLogin }) => (
  <Stack.Navigator initialRouteName="Login">
    <Stack.Screen name="Login">
      {(props) => <LoginScreen {...props} handleLogin={handleLogin} />}
    </Stack.Screen>
    <Stack.Screen name="Signup" >
      {(props) => <SignupScreen {...props} handleLogin={handleLogin} />}
    </Stack.Screen>
  </Stack.Navigator>
);

export default AuthNavigator;
