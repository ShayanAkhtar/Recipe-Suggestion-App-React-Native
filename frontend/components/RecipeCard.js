import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const RecipeCard = ({ recipe }) => (
  <View style={styles.card}>
    <Text style={styles.title}>{recipe.title}</Text>
    <Text>Ingredients: {recipe.ingredients.join(', ')}</Text>
  </View>
);

const styles = StyleSheet.create({
  card: { padding: 15, borderWidth: 1, borderColor: '#ccc', borderRadius: 10, marginBottom: 15 },
  title: { fontSize: 18, fontWeight: 'bold' }
});

export default RecipeCard;
