// MainNavigator.js (updated)
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialIcons } from '@expo/vector-icons';
import HomeScreen from '../screens/HomeScreen';
import InventoryScreen from '../screens/InventoryScreen';
import RecipeScreen from '../screens/RecipeScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Tab = createBottomTabNavigator();

const MainNavigator = ({ handleLogout  }) => (
  <Tab.Navigator
    initialRouteName="Home"
    screenOptions={{
      headerShown: false,     // Hide the top header (title)
      //tabBarShowLabel: false, // Optionally hide the tab labels
    }}
  >
    <Tab.Screen
      name="Home"
      component={HomeScreen}
      options={{
        tabBarIcon: ({ color, size }) => (
          <MaterialIcons name="home" color={color} size={size} />
        ),
      }}
    />
    <Tab.Screen
      name="Inventory"
      component={InventoryScreen}
      options={{
        tabBarIcon: ({ color, size }) => (
          <MaterialIcons name="inventory" color={color} size={size} />
        ),
      }}
    />
    <Tab.Screen
      name="Recipes"
      component={RecipeScreen}
      options={{
        tabBarIcon: ({ color, size }) => (
          <MaterialIcons name="restaurant-menu" color={color} size={size} />
        ),
      }}
    />
    <Tab.Screen
      name="Profile"
      options={{
        tabBarIcon: ({ color, size }) => (
          <MaterialIcons name="person" color={color} size={size} />
        ),
      }}
    >
      {props => <ProfileScreen {...props} handleLogout={handleLogout} />}
    </Tab.Screen>
  </Tab.Navigator>
);


export default MainNavigator;