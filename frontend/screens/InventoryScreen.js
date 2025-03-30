import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { API_BASE_URL } from '../constant';
import { getToken } from '../utils/authService';

const InventoryScreen = ({ navigation }) => {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(false);

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

  // Fetch inventory data from API
  const fetchInventory = async () => {
    try {
      setLoading(true);
      const token = await getToken();
      const response = await fetch(`${API_BASE_URL}/inventory`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setInventory(data);
    } catch (error) {
      console.error('Error fetching inventory:', error);
    } finally {
      setLoading(false);
    }
  };

  // Refetch inventory each time the screen is focused
  useFocusEffect(
    useCallback(() => {
      fetchInventory();
    }, [])
  );

  // Compute Expiring Soon: sort by expiry date (ascending) and take first 3 items
  const expiringSoon = inventory
    .filter(item => new Date(item.expiryDate) > new Date())
    .sort((a, b) => new Date(a.expiryDate) - new Date(b.expiryDate))
    .slice(0, 3);

  // Compute Low Stock: items with quantity 1 or 2
  const lowStock = inventory.filter(item => item.quantity <= 2);

  // Render function for each inventory card
  const renderInventoryCard = ({ item }) => (
    <TouchableOpacity style={styles.card} onPress={() => { /* Optionally add details view */ }}>
      <Image
        source={ingredientImages[item.imageKey] || require('../assets/food/tomato.jpg')}
        style={styles.cardImage}
      />
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle}>{item.name}</Text>
        <Text style={styles.cardSubtitle}>Qty: {item.quantity}</Text>
        <Text style={styles.cardSubtitle}>
          Expires: {new Date(item.expiryDate).toLocaleDateString()}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Inventory Stocking</Text>
      </View>

      {/* Quick Action Buttons */}
      <View style={styles.quickActions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate('AddIngredient')}
        >
          <Ionicons name="add-circle-outline" size={30} color="#FF6F61" />
          <Text style={styles.actionText}>Add Ingredient</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate('InventoryList')}
        >
          <Ionicons name="list-circle-outline" size={30} color="#FF6F61" />
          <Text style={styles.actionText}>View Inventory</Text>
        </TouchableOpacity>
      </View>

      {/* Expiring Soon Section */}
      <Text style={styles.sectionTitle}>Expiring Soon</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#FF6F61" />
      ) : (
        <FlatList
          horizontal
          data={expiringSoon}
          renderItem={renderInventoryCard}
          keyExtractor={(item) => item.id}
          showsHorizontalScrollIndicator={false}
          style={styles.horizontalList}
        />
      )}

      {/* Low Stock Section */}
      <Text style={styles.sectionTitle}>Low Stock</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#FF6F61" />
      ) : (
        <FlatList
          horizontal
          data={lowStock}
          renderItem={renderInventoryCard}
          keyExtractor={(item) => item.id}
          showsHorizontalScrollIndicator={false}
          style={styles.horizontalList}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    paddingHorizontal: 16,
    paddingTop: 80,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  actionButton: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '45%',
    paddingVertical: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  actionText: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  horizontalList: {
    marginBottom: 20,
  },
  card: {
    flexDirection: 'row', // horizontal layout: image left, details right
    backgroundColor: '#fff',
    borderRadius: 10,
    marginRight: 16,
    padding: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    width: 300, // adjust width as needed
  },
  cardImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginRight: 12,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
});

export default InventoryScreen;
