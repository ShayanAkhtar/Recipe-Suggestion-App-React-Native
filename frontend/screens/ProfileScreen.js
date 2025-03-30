import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { logoutUser, getUserId } from '../utils/authService';
import { API_BASE_URL } from '../constant';

const ProfileScreen = ({ navigation, handleLogout }) => {
  const [user, setUser] = useState(null);
  const [selectedDietary, setSelectedDietary] = useState([]);
  const [selectedAllergies, setSelectedAllergies] = useState([]);
  const [selectedCuisine, setSelectedCuisine] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [changesMade, setChangesMade] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userId = await getUserId();
        const response = await fetch(`${API_BASE_URL}/auth/${userId}`);
        const data = await response.json();
        
        setUser(data);
        setSelectedDietary(data.preferences.dietary || []);
        setSelectedAllergies(data.preferences.allergies || []);
        setSelectedCuisine(data.preferences.cuisines || []);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
    fetchUserData();
  }, []);

  const logout = async () => {
    await logoutUser();
    handleLogout();
  };

  const handleSaveChanges = async () => {
    if (!user) return;

    try {
      await fetch(`${API_BASE_URL}/auth/${user.id}/preferences`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dietary: selectedDietary,
          allergies: selectedAllergies,
          cuisines: selectedCuisine,
        }),
      });

      setChangesMade(false);
    } catch (error) {
      console.error('Error updating preferences:', error);
    }
  };

  const toggleSelection = (item, setFunction, selectedArray) => {
    const updatedArray = selectedArray.includes(item)
      ? selectedArray.filter((i) => i !== item)
      : [...selectedArray, item];

    setFunction(updatedArray);
    setChangesMade(true);
  };

  const dietaryPreferences = ['Vegetarian', 'Gluten-free', 'Vegan', 'Ketogenic', 'Paleo'];
  const allergies = ['Peanut', 'Shellfish', 'Dairy', 'Soy', 'Egg', 'Wheat'];
  const favoriteCuisines = [
    { id: 1, name: 'Italian', icon: 'pizza-outline' },
    { id: 2, name: 'Japanese', icon: 'fish-outline' },
    { id: 3, name: 'Mexican', icon: 'restaurant-outline' },
    { id: 4, name: 'American', icon: 'fast-food-outline' },
    { id: 5, name: 'Indian', icon: 'flame-outline' },
    { id: 6, name: 'Thai', icon: 'cafe-outline' },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 30 }}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back-outline" size={24} color="#333" />
        </TouchableOpacity>
        <TouchableOpacity onPress={logout}>
          <Ionicons name="log-out-outline" size={24} color="#D9534F" />
        </TouchableOpacity>
      </View>

      {/* Profile Info */}
      <View style={styles.profileContainer}>
        <Text style={styles.profileName}>{user?.name || 'Loading...'}</Text>
        <Text style={styles.profileHandle}>{user?.email || ''}</Text>
      </View>

      {/* Personal Information */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Personal Information</Text>

        {/* Location */}
        <View style={styles.infoRow}>
          <Ionicons name="location-outline" size={18} color="#FF6F61" />
          <Text style={styles.infoText}>{user?.location || 'Earth'}</Text>
        </View>
      </View>

    {/* Email */}
    <View style={styles.infoRow}>
          <Ionicons name="mail-outline" size={18} color="#FF6F61" />
          <Text style={styles.infoText}>{user?.email || ''}</Text>
    </View>

      {/* Food Preferences */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Food Preferences</Text>

        {/* Dietary Preferences */}
        <Text style={styles.subSectionTitle}>Dietary Preferences</Text>
        <View style={styles.tagContainer}>
          {dietaryPreferences.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.tag, selectedDietary.includes(item) && styles.selectedTag]}
              onPress={() => toggleSelection(item, setSelectedDietary, selectedDietary)}
            >
              <Text style={styles.tagText}>{item}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Allergies */}
        <Text style={styles.subSectionTitle}>Allergies</Text>
        <View style={styles.tagContainer}>
          {allergies.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.tag, selectedAllergies.includes(item) && styles.selectedTag]}
              onPress={() => toggleSelection(item, setSelectedAllergies, selectedAllergies)}
            >
              <Text style={styles.tagText}>{item}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Favorite Cuisines */}
        <Text style={styles.subSectionTitle}>Favorite Cuisines</Text>
        <FlatList
          data={favoriteCuisines}
          numColumns={3}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles.cuisineCard, selectedCuisine.includes(item.name) && styles.selectedCuisine]}
              onPress={() => toggleSelection(item.name, setSelectedCuisine, selectedCuisine)}
            >
              <Ionicons name={item.icon} size={24} color={selectedCuisine.includes(item.name) ? '#fff' : '#FF6F61'} />
              <Text style={[styles.cuisineText, selectedCuisine.includes(item.name) && { color: '#fff' }]}>{item.name}</Text>
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item.id.toString()}
        />
      </View>

      {/* Save Changes Button */}
      {changesMade && (
        <TouchableOpacity style={styles.saveButton} onPress={handleSaveChanges}>
          <Text style={styles.saveButtonText}>Save Changes</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 20 },
  header: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20, marginTop: 60 },
  profileContainer: { alignItems: 'center', marginBottom: 20 },
  profileName: { fontSize: 20, fontWeight: 'bold', marginTop: 10 },
  profileHandle: { fontSize: 14, color: '#6B7280' },
  section: { marginTop: 20 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 10 },
  subSectionTitle: { fontSize: 14, fontWeight: '600', color: '#6B7280', marginBottom: 5 },
  tagContainer: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 10 },
  tag: { backgroundColor: '#E5E7EB', borderRadius: 15, padding: 8, marginRight: 8, marginBottom: 8 },
  selectedTag: { backgroundColor: '#FF6F61', color: '#fff' },
  cuisineCard: { alignItems: 'center', width: '30%', padding: 10, borderRadius: 10 },
  selectedCuisine: { backgroundColor: '#FF6F61' },
  saveButton: { backgroundColor: '#FF6F61', padding: 12, borderRadius: 10, alignItems: 'center', marginTop: 20 },
  saveButtonText: { color: '#fff', fontWeight: 'bold' },
});

export default ProfileScreen;
