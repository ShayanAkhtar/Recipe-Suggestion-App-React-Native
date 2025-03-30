import React, { useState } from 'react';
import { View, Text, TextInput, ActivityIndicator, Alert, StyleSheet, TouchableOpacity } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { LinearGradient } from 'expo-linear-gradient';
import { emailValidation } from '../utils/validation';
import { registerUser } from '../utils/authService';

const SignupScreen = ({ navigation }) => {
  const { control, handleSubmit, reset } = useForm({
    defaultValues: { name: '', location: '', email: '', password: '' },
  });
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      if (!emailValidation(data.email)) return Alert.alert('Error', 'Invalid email');
      if (data.password.length < 6) return Alert.alert('Error', 'Password must be at least 6 characters');
      const response = await registerUser(data);
      if (response.user) {
        Alert.alert('Success', 'Sign up successful!');
        reset();
        navigation.navigate('Login');
      } else {
        Alert.alert('Sign Up Failed', response.message || 'Invalid credentials');
      }
    } catch (error) {
      Alert.alert('Error', 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient colors={['#FF8700', '#FF3E00']} style={styles.background}>
      <View style={styles.card}>
        <Text style={styles.title}>Create Account</Text>

        <Controller
          control={control}
          name="name"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput style={styles.input} placeholder="Full Name" onBlur={onBlur} onChangeText={onChange} value={value} />
          )}
        />

        <Controller
          control={control}
          name="location"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput style={styles.input} placeholder="Location" onBlur={onBlur} onChangeText={onChange} value={value} />
          )}
        />

        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput style={styles.input} placeholder="Email" keyboardType="email-address" autoCapitalize="none" onBlur={onBlur} onChangeText={onChange} value={value} />
          )}
        />

        <Controller
          control={control}
          name="password"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput style={styles.input} placeholder="Password" secureTextEntry onBlur={onBlur} onChangeText={onChange} value={value} />
          )}
        />

        <TouchableOpacity style={styles.button} onPress={handleSubmit(onSubmit)} disabled={loading}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Sign Up</Text>}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.signupText}>Already have an account? Login</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    width: '90%',
    backgroundColor: '#fff',
    padding: 25,
    borderRadius: 10,
    elevation: 10,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FF5722',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    padding: 12,
    borderRadius: 10,
    backgroundColor: '#F5F5F5',
    marginBottom: 15,
  },
  button: {
    width: '100%',
    backgroundColor: '#FF5722',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  signupText: {
    color: '#FF5722',
    marginTop: 15,
  },
});

export default SignupScreen;
