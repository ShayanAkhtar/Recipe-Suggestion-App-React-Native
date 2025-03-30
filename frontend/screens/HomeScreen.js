import React from 'react';
import { View, Text, StyleSheet, ImageBackground, TouchableOpacity } from 'react-native';

const HomeScreen = ({ navigation }) => {
  return (
    <ImageBackground
      source={require('../assets/food/carbonara.jpg')} // replace with a suitable hero image
      style={styles.hero}
      imageStyle={styles.heroImage}
    >
      <View style={styles.overlay}>
        <Text style={styles.title}>Kitchen Helper</Text>
        <Text style={styles.subtitle}>Your smart kitchen companion</Text>
        <TouchableOpacity style={styles.ctaButton} onPress={() => navigation.navigate('Inventory')}>
          <Text style={styles.ctaText}>Get Started</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  hero: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  heroImage: {
    borderRadius: 0, // adjust if you want rounded corners
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: '#eee',
    marginBottom: 40,
    textAlign: 'center',
  },
  ctaButton: {
    backgroundColor: '#FF6F61',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 30,
  },
  ctaText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: '600',
  },
});

export default HomeScreen;
