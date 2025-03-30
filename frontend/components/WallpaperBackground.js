// WallpaperBackground.js
import React from 'react';
import { StyleSheet, ImageBackground } from 'react-native';

const WallpaperBackground = ({ children }) => {
  return (
    <ImageBackground
      source={require('../assets/Wallpaper.png')}
      style={styles.background}
    >
      {children}
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
});

export default WallpaperBackground;
