import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const InventoryItem = ({ item }) => (
  <View style={styles.itemContainer}>
    <Text style={styles.itemName}>{item.name}</Text>
    <Text>Expiration: {item.expirationDate}</Text>
  </View>
);

const styles = StyleSheet.create({
  itemContainer: { padding: 10, borderBottomWidth: 1, borderBottomColor: '#ccc' },
  itemName: { fontSize: 16, fontWeight: 'bold' }
});

export default InventoryItem;
