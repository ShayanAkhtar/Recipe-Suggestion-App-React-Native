import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const RecipeDetailScreen = ({ route, navigation }) => {
  const { recipe } = route.params;

  // Helper to render a list of ingredients if provided in API response
  const renderIngredient = ({ item }) => (
    <View style={styles.ingredientItem}>
      <Ionicons name="square-outline" size={20} color="#555" />
      <Text style={styles.ingredientText}>{item}</Text>
    </View>
  );

  // If API returns analyzedInstructions use it, otherwise fallback to summary
  const instructions = recipe.analyzedInstructions && recipe.analyzedInstructions.length
    ? recipe.analyzedInstructions[0].steps
    : [];

  return (
    <ScrollView style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={24} color="#333" />
      </TouchableOpacity>

      {/* Recipe Header */}
      <View style={styles.headerContainer}>
        <Image
          source={ recipe.image ? { uri: recipe.image } : require('../assets/food/tomato.jpg') }
          style={styles.recipeImage}
        />
        <Text style={styles.recipeTitle}>{recipe.title}</Text>
        <Text style={styles.infoText}>
          {recipe.readyInMinutes ? recipe.readyInMinutes + ' min' : 'N/A'} • {recipe.servings} servings
        </Text>
        <Text style={styles.creditsText}>
          {recipe.creditsText || recipe.sourceName || ''}
        </Text>
      </View>

      {/* Summary */}
      {recipe.summary && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Overview</Text>
          <Text style={styles.summaryText}>{recipe.summary.replace(/<[^>]+>/g, '')}</Text>
        </View>
      )}

      {/* Ingredients Section */}
      {recipe.extendedIngredients && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ingredients</Text>
          <FlatList
            data={recipe.extendedIngredients.map(ing => ing.original)}
            renderItem={renderIngredient}
            keyExtractor={(item, index) => index.toString()}
          />
        </View>
      )}

      {/* Instructions Section */}
      {instructions.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Instructions</Text>
          {instructions.map((step, index) => (
            <View key={index} style={styles.instructionItem}>
              <View style={styles.stepNumberContainer}>
                <Text style={styles.stepNumber}>{step.number}</Text>
              </View>
              <View style={styles.stepTextContainer}>
                <Text style={styles.instructionText}>{step.step}</Text>
              </View>
            </View>
          ))}
        </View>
      )}

      {/* Nutrition Facts */}
      {recipe.nutrition && recipe.nutrition.nutrients && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Nutrition Facts</Text>
          <View style={styles.nutritionRow}>
            {recipe.nutrition.nutrients.slice(0, 4).map((nutrient, index) => (
              <Text key={index} style={styles.nutritionItem}>
                {nutrient.name}: {nutrient.amount.toFixed(0)} {nutrient.unit}
              </Text>
            ))}
          </View>
        </View>
      )}

      {/* Start Cooking Button */}
      <TouchableOpacity style={styles.startButton}>
        <Text style={styles.startButtonText}>Start Cooking</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  backButton: {
    marginTop: 40,
    marginLeft: 16,
  },
  headerContainer: {
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFF',
  },
  recipeImage: {
    width: '100%',
    height: 220,
    borderRadius: 8,
    marginBottom: 12,
  },
  recipeTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
    textAlign: 'center',
    marginBottom: 4,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  creditsText: {
    fontSize: 12,
    color: '#999',
  },
  section: {
    backgroundColor: '#FFF',
    marginTop: 12,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 12,
    color: '#333',
  },
  summaryText: {
    fontSize: 14,
    color: '#555',
    lineHeight: 20,
  },
  ingredientItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  ingredientText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#333',
  },
  instructionItem: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  stepNumberContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FF6F61',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  stepNumber: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  stepTextContainer: {
    flex: 1,
  },
  instructionText: {
    fontSize: 14,
    color: '#555',
    lineHeight: 20,
  },
  nutritionRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  nutritionItem: {
    fontSize: 14,
    color: '#555',
    width: '48%',
    marginBottom: 8,
  },
  startButton: {
    margin: 16,
    backgroundColor: '#FF6F61',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  startButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default RecipeDetailScreen;
