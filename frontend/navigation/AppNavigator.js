import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import MainNavigator from './MainNavigator'; // Import the Tab Navigator
import AddIngredientScreen from '../screens/AddIngredientScreen'; 
import RecipeScreen from '../screens/RecipeScreen';
import InventoryListScreen from '../screens/InventoryListScreen';
import RecipeDetailScreen from '../screens/RecipeDetailScreen'; // <-- Import the detail screen

const Stack = createStackNavigator();

const AppNavigator = ({ handleLogout }) => (
  <Stack.Navigator initialRouteName="MainTabs">
    <Stack.Screen 
      name="MainTabs" 
      options={{ headerShown: false }} // Hide the header for tabs
    >
    {props => <MainNavigator {...props} handleLogout={handleLogout} />}
    </Stack.Screen>
    <Stack.Screen 
      name="AddIngredient" 
      component={AddIngredientScreen} 
      options={{ headerShown: false }}
    />
    <Stack.Screen 
      name="InventoryList" 
      component={InventoryListScreen} 
      options={{ headerShown: false }}
    />
    <Stack.Screen 
      name="Recipes" 
      component={RecipeScreen} 
    />
    <Stack.Screen 
      name="RecipeDetail" 
      component={RecipeDetailScreen}
      options={{ headerShown: false }} // Optional: hide header on detail screen
    />
  </Stack.Navigator>
);

export default AppNavigator;
