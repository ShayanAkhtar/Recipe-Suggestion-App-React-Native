import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AuthNavigator from './navigation/AuthNavigator';
import AppNavigator from './navigation/AppNavigator'; // Use AppNavigator instead of MainNavigator
import WallpaperBackground from './components/WallpaperBackground';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogin = () => setIsAuthenticated(true);
  const handleLogout = () => setIsAuthenticated(false);

  return (
    <WallpaperBackground>
      <NavigationContainer>
        {isAuthenticated ? (
          <AppNavigator handleLogout={handleLogout} />  
        ) : (
          <AuthNavigator handleLogin={handleLogin} />
        )}
      </NavigationContainer>
    </WallpaperBackground>
  );
}
