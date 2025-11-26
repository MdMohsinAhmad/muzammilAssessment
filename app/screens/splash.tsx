import { ThemedText } from '@/components/themed-text';
import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

export default function SplashScreen() {
  const router = useRouter();

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      // Navigate to the main screen after splash
      router.replace('/(tabs)');
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <ThemedText type="title" style={styles.title}>
        Tinder App
      </ThemedText>
      <ActivityIndicator size="large" style={styles.loader} />
      <Text style={styles.subtitle}>Loading...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FF6B6B',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 20,
  },
  loader: {
    marginVertical: 20,
  },
  subtitle: {
    fontSize: 16,
    color: 'white',
  },
});