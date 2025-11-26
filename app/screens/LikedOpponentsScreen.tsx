import { profileService } from '@/services/profileService';
import { Profile } from '@/types/profile';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, Dimensions, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const { width: screenWidth } = Dimensions.get('window');

export default function LikedOpponentsScreen() {
  const router = useRouter();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLikedProfiles();
  }, []);

  const loadLikedProfiles = async () => {
    try {
      setLoading(true);
      const profiles = await profileService.getLikedProfiles();
      setProfiles(profiles);
    } catch (error) {
      console.error('Error loading liked profiles:', error);
      Alert.alert('Error', 'Failed to load liked profiles');
    } finally {
      setLoading(false);
    }
  };

  const handleBackPress = () => {
    router.back();
  };

  const moveToNextProfile = () => {
    if (currentIndex < profiles.length - 1) {
      setCurrentIndex(prevIndex => prevIndex + 1);
    }
  };

  const moveToPrevProfile = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prevIndex => prevIndex - 1);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading liked profiles...</Text>
      </View>
    );
  }

  if (profiles.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBackPress}>
            <Text style={styles.backButton}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Liked Profiles</Text>
          <View style={{ width: 60 }} /> {/* Spacer for alignment */}
        </View>
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>
            You have not liked any profiles yet.
          </Text>
          <Text style={styles.emptyStateSubtext}>
            Start swiping to find matches!
          </Text>
        </View>
      </View>
    );
  }

  const currentProfile = profiles[currentIndex];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBackPress}>
          <Text style={styles.backButton}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Liked Profiles</Text>
        <View style={{ width: 60 }} /> {/* Spacer for alignment */}
      </View>

      {/* Progress Bar */}
      <View style={styles.progressBar}>
        {profiles.map((_, index) => (
          <View
            key={index}
            style={[
              styles.progressBarItem,
              index === currentIndex && styles.activeProgressBarItem,
            ]}
          />
        ))}
      </View>

      {/* Profile Card */}
      <View style={styles.cardContainer}>
        <View style={styles.card}>
          {/* Profile Image */}
          <View style={styles.imageContainer}>
            {currentProfile.pictures[0] ? (
              <Image 
                source={{ uri: currentProfile.pictures[0] }} 
                style={styles.image}
              />
            ) : (
              <View style={[styles.image, styles.placeholderImage]} />
            )}
          </View>
          
          {/* Profile Info */}
          <View style={styles.infoContainer}>
            <Text style={styles.nameAge}>
              {currentProfile.name}, {currentProfile.age}
            </Text>
            <Text style={styles.location}>{currentProfile.location}</Text>
            <Text style={styles.bio} numberOfLines={3}>
              {currentProfile.bio}
            </Text>
          </View>
        </View>
      </View>

      {/* Navigation Arrows */}
      <View style={styles.navigationContainer}>
        <TouchableOpacity 
          style={[styles.navButton, currentIndex === 0 && styles.disabledButton]} 
          onPress={moveToPrevProfile}
          disabled={currentIndex === 0}
        >
          <Text style={styles.navButtonText}>{'\u2039'}</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.navButton, currentIndex === profiles.length - 1 && styles.disabledButton]} 
          onPress={moveToNextProfile}
          disabled={currentIndex === profiles.length - 1}
        >
          <Text style={styles.navButtonText}>{'\u203A'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 10,
  },
  backButton: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  progressBar: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  progressBarItem: {
    flex: 1,
    height: 3,
    backgroundColor: '#e0e0e0',
    marginHorizontal: 2,
    borderRadius: 2,
  },
  activeProgressBarItem: {
    backgroundColor: '#FF6B6B',
  },
  cardContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  card: {
    width: '100%',
    height: '70%',
    borderRadius: 16,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  imageContainer: {
    width: '100%',
    height: '75%',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  placeholderImage: {
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoContainer: {
    padding: 16,
    height: '25%',
  },
  nameAge: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  location: {
    fontSize: 16,
    color: '#666',
    marginTop: 4,
  },
  bio: {
    fontSize: 14,
    color: '#333',
    marginTop: 8,
  },
  navigationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 40,
    paddingVertical: 20,
  },
  navButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  disabledButton: {
    opacity: 0.5,
  },
  navButtonText: {
    fontSize: 24,
    color: '#333',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  emptyStateSubtext: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});