import React, { useRef, useState } from 'react';
import { Dimensions, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import {
    GestureHandlerRootView,
    PanGestureHandler,
    TapGestureHandler,
} from 'react-native-gesture-handler';
import Animated, {
    runOnJS,
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    withTiming,
} from 'react-native-reanimated';
import { Profile } from '../../types/profile';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

interface SwipeableCardProps {
  profile: Profile;
  onSwipeLeft: (profile: Profile) => void;
  onSwipeRight: (profile: Profile) => void;
  currentIndex: number;
}

export default function SwipeableCard({
  profile,
  onSwipeLeft,
  onSwipeRight,
  currentIndex,
}: SwipeableCardProps) {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const rotate = useSharedValue(0);
  const scale = useSharedValue(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const panRef = useRef(null);
  const tapRef = useRef(null);

  const animatedCardStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
        { rotate: `${rotate.value}deg` },
        { scale: scale.value },
      ],
    };
  });

  const handleSwipeLeft = () => {
    'worklet';
    translateX.value = withTiming(-screenWidth, { duration: 300 });
    rotate.value = withTiming(-30, { duration: 300 });
    runOnJS(onSwipeLeft)(profile);
  };

  const handleSwipeRight = () => {
    'worklet';
    translateX.value = withTiming(screenWidth, { duration: 300 });
    rotate.value = withTiming(30, { duration: 300 });
    runOnJS(onSwipeRight)(profile);
  };

  const resetPosition = () => {
    'worklet';
    translateX.value = withSpring(0);
    translateY.value = withSpring(0);
    rotate.value = withSpring(0);
  };

  const onPanGestureEvent = (event: any) => {
    'worklet';
    translateX.value = event.nativeEvent.translationX;
    translateY.value = event.nativeEvent.translationY;
    rotate.value = event.nativeEvent.translationX * 0.1;

    // Auto-swipe if dragged far enough
    if (event.nativeEvent.translationX > 120) {
      handleSwipeRight();
    } else if (event.nativeEvent.translationX < -120) {
      handleSwipeLeft();
    }
  };

  const onHandlerStateChange = (event: any) => {
    'worklet';
    if (event.nativeEvent.oldState === 4) {
      // State.ACTIVE = 4
      if (
        Math.abs(event.nativeEvent.translationX) < 120 &&
        Math.abs(event.nativeEvent.translationY) < 120
      ) {
        resetPosition();
      }
    }
  };

  const onDoubleTap = () => {
    'worklet';
    scale.value = withSpring(0.9, {}, () => {
      scale.value = withSpring(1);
      runOnJS(onSwipeRight)(profile);
    });
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      <PanGestureHandler
        ref={panRef}
        simultaneousHandlers={[tapRef]}
        onGestureEvent={onPanGestureEvent}
        onHandlerStateChange={onHandlerStateChange}>
        <Animated.View
          style={[
            styles.card,
            animatedCardStyle,
            { zIndex: 100 - currentIndex },
          ]}>
          <TapGestureHandler
            ref={tapRef}
            numberOfTaps={2}
            onActivated={onDoubleTap}>
            <View>
              {/* Image Slider */}
              <View style={styles.imageContainer}>
                {profile.pictures.length > 0 ? (
                  <>
                    <Image
                      source={{ uri: profile.pictures[currentImageIndex] }}
                      style={styles.image}
                    />
                    {/* Navigation Dots */}
                    {profile.pictures.length > 1 && (
                      <View style={styles.dotsContainer}>
                        {profile.pictures.map((_, index) => (
                          <TouchableOpacity
                            key={index}
                            style={[
                              styles.dot,
                              index === currentImageIndex && styles.activeDot,
                            ]}
                            onPress={() => setCurrentImageIndex(index)}
                          />
                        ))}
                      </View>
                    )}
                    {/* Left Arrow */}
                    {currentImageIndex > 0 && (
                      <TouchableOpacity
                        style={[styles.arrow, styles.leftArrow]}
                        onPress={() => setCurrentImageIndex(currentImageIndex - 1)}>
                        <Text style={styles.arrowText}>{'\u2039'}</Text>
                      </TouchableOpacity>
                    )}
                    {/* Right Arrow */}
                    {currentImageIndex < profile.pictures.length - 1 && (
                      <TouchableOpacity
                        style={[styles.arrow, styles.rightArrow]}
                        onPress={() => setCurrentImageIndex(currentImageIndex + 1)}>
                        <Text style={styles.arrowText}>{'\u203A'}</Text>
                      </TouchableOpacity>
                    )}
                  </>
                ) : (
                  <View style={[styles.image, styles.placeholderImage]} />
                )}
              </View>
              <View style={styles.infoContainer}>
                <Text style={styles.nameAge}>
                  {profile.name}, {profile.age}
                </Text>
                <Text style={styles.location}>{profile.location}</Text>
                <Text style={styles.bio} numberOfLines={3}>
                  {profile.bio}
                </Text>
              </View>
            </View>
          </TapGestureHandler>
        </Animated.View>
      </PanGestureHandler>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    width: screenWidth * 0.85,
    height: screenHeight * 0.7,
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
    position: 'absolute',
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
  dotsContainer: {
    position: 'absolute',
    bottom: 10,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: 'white',
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  arrow: {
    position: 'absolute',
    top: '50%',
    marginTop: -20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  leftArrow: {
    left: 10,
  },
  rightArrow: {
    right: 10,
  },
  arrowText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
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
});