import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { API_BASE_URL } from '../constant';
import { getToken } from '../utils/authService';

// Mapping of ingredient images
const ingredientImages = {
  tomato: require('../assets/food/tomato.jpg'),
  garlic: require('../assets/food/garlic.jpg'),
  onion: require('../assets/food/onion.jpg'),
  flour: require('../assets/food/flour.jpg'),
  eggs: require('../assets/food/eggs.jpg'),
  milk: require('../assets/food/milk.jpg'),
  potato: require('../assets/food/potato.jpg'),
  pasta: require('../assets/food/pasta.jpg'),
  sugar: require('../assets/food/sugar.jpg'),
  salt: require('../assets/food/salt.jpg'),
  pepper: require('../assets/food/pepper.jpg'),
  oil: require('../assets/food/oil.jpg'),
  chicken: require('../assets/food/chicken.jpg'),
  beef: require('../assets/food/beef.png'),
  cheese: require('../assets/food/cheese.png'),
  fish: require('../assets/food/fish.png'),
  rice: require('../assets/food/rice.png'),
};

// Build available ingredients list from mapping
const allAvailableIngredients = Object.keys(ingredientImages).map((key) => ({
  id: key, // using key as id
  name: key.charAt(0).toUpperCase() + key.slice(1),
  imageKey: key,
  source: ingredientImages[key],
}));

const AddIngredientScreen = ({ navigation }) => {
  const [searchText, setSearchText] = useState('');
  // selectedIngredients is fetched from API (array of ingredient objects)
  const [selectedIngredients, setSelectedIngredients] = useState([]);

  // Filter available ingredients based on search text
  const filteredIngredients = allAvailableIngredients.filter((item) =>
    item.name.toLowerCase().includes(searchText.toLowerCase())
  );

  // Fetch user's current ingredients from API
  const fetchSelectedIngredients = async () => {
    try {
      const token = await getToken();
      const response = await fetch(`${API_BASE_URL}/inventory`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      // Assuming API returns an array where each ingredient has: id, name, quantity, imageKey, expiryDate, etc.
      setSelectedIngredients(data);
    } catch (error) {
      console.error('Error fetching ingredients:', error);
    }
  };

  // Call fetch when screen is focused for realtime updates
  useFocusEffect(
    useCallback(() => {
      fetchSelectedIngredients();
    }, [])
  );

  // Add a new ingredient via API with a default quantity (1) and default expiry date (7 days from now)
  const handleAddIngredient = async (item) => {
    try {
      const token = await getToken();
      const defaultQuantity = 1;
      const defaultExpiryDate = new Date(
        new Date().setDate(new Date().getDate() + 7)
      ).toISOString();
      const response = await fetch(`${API_BASE_URL}/inventory`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: item.name,
          quantity: defaultQuantity,
          expiryDate: defaultExpiryDate,
          imageKey: item.name.toLowerCase(), 
        }),
      });
      if (response.ok) {
        fetchSelectedIngredients();
      } else {
        Alert.alert('Error', 'Failed to add ingredient');
      }
    } catch (error) {
      console.error('Error adding ingredient:', error);
    }
  };

  // Increase quantity via API: new quantity = current quantity + 1
  const handleIncreaseQuantity = async (ingredient) => {
    try {
      const token = await getToken();
      const newQuantity = ingredient.quantity + 1;
      const response = await fetch(`${API_BASE_URL}/inventory/${ingredient.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ quantity: newQuantity }),
      });
      if (response.ok) {
        fetchSelectedIngredients();
      } else {
        Alert.alert('Error', 'Failed to update quantity');
      }
    } catch (error) {
      console.error('Error increasing quantity:', error);
    }
  };

  // Decrease quantity via API; if quantity falls below 1, remove the ingredient
  const handleDecreaseQuantity = async (ingredient) => {
    try {
      const token = await getToken();
      const newQuantity = ingredient.quantity - 1;
      if (newQuantity < 1) {
        // Delete the ingredient if quantity falls below 1
        const delResponse = await fetch(`${API_BASE_URL}/inventory/${ingredient.id}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!delResponse.ok) {
          Alert.alert('Error', 'Failed to remove ingredient');
        }
      } else {
        const response = await fetch(`${API_BASE_URL}/inventory/${ingredient.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ quantity: newQuantity }),
        });
        if (!response.ok) {
          Alert.alert('Error', 'Failed to update quantity');
        }
      }
      fetchSelectedIngredients();
    } catch (error) {
      console.error('Error decreasing quantity:', error);
    }
  };

  // Render available ingredient card (horizontal list)
  const renderAvailableIngredient = ({ item }) => (
    <TouchableOpacity style={styles.ingredientCard} onPress={() => handleAddIngredient(item)}>
      <Image source={item.source} style={styles.ingredientImage} />
      <Text style={styles.ingredientText}>{item.name}</Text>
    </TouchableOpacity>
  );

  // Render selected ingredient row (Your Ingredients section)
  const renderSelectedIngredient = ({ item }) => {
    // Use the imageKey to retrieve the image from mapping
    const imageSource = ingredientImages[item.imageKey] || require('../assets/food/potato.jpg');
    return (
      <View style={styles.allIngredientRow}>
        <View style={styles.allIngredientLeft}>
          <Image source={imageSource} style={styles.allIngredientImage} />
          <View>
            <Text style={styles.ingredientText}>{item.name}</Text>
            <Text style={styles.ingredientDescription}>Quantity: {item.quantity}</Text>
          </View>
        </View>
        <View style={styles.quantitySelector}>
          <TouchableOpacity onPress={() => handleDecreaseQuantity(item)}>
            <Ionicons name="remove-circle" size={20} color="#FF6F61" />
          </TouchableOpacity>
          <Text style={styles.quantityText}>{item.quantity}</Text>
          <TouchableOpacity onPress={() => handleIncreaseQuantity(item)}>
            <Ionicons name="add-circle" size={20} color="#FF6F61" />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back-outline" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add Ingredients</Text>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.doneText}>Done</Text>
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search-outline" size={20} color="#333" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search ingredients..."
          value={searchText}
          onChangeText={setSearchText}
        />
      </View>

      {/* Available Ingredients Section */}
      <Text style={styles.sectionTitle}>Available Ingredients</Text>
      <FlatList
        data={filteredIngredients}
        renderItem={renderAvailableIngredient}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 10 }}
      />

      {/* Selected Ingredients Section */}
      <Text style={styles.sectionTitle}>Your Ingredients</Text>
      {selectedIngredients.length === 0 ? (
        <Text style={styles.emptyText}>No ingredients selected yet.</Text>
      ) : (
        <FlatList
          data={selectedIngredients}
          renderItem={renderSelectedIngredient}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', paddingHorizontal: 16, paddingTop: 20 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  headerTitle: { fontSize: 20, fontWeight: 'bold', marginTop: 25, marginBottom: 20 },
  doneText: { fontSize: 16, color: '#FF6F61', fontWeight: '600' },
  searchContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F5F5F5', borderRadius: 10, padding: 10 },
  searchInput: { flex: 1, fontSize: 16, marginLeft: 10 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginTop: 20, marginBottom: 10 },
  emptyText: { textAlign: 'center', color: '#6B7280', marginVertical: 10 },
  // Available ingredient card styling
  ingredientCard: { alignItems: 'center', marginRight: 15 },
  ingredientImage: { width: 60, height: 60, borderRadius: 10 },
  ingredientText: { fontSize: 14, marginTop: 5 },
  // Selected ingredient row styling
  allIngredientRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    paddingVertical: 8,
    borderBottomWidth: 0.5,
    borderColor: '#E5E7EB',
  },
  allIngredientLeft: { flexDirection: 'row', alignItems: 'center' },
  allIngredientImage: { width: 50, height: 50, borderRadius: 10, marginRight: 10 },
  ingredientDescription: { fontSize: 12, color: '#666' },
  quantitySelector: { flexDirection: 'row', alignItems: 'center' },
  quantityText: { marginHorizontal: 10, fontSize: 16, fontWeight: 'bold' },
});

export default AddIngredientScreen;
