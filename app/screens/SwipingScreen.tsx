import React, { useEffect, useRef, useState } from "react";
import {
  Text,
  TouchableOpacity,
  View,
  FlatList,
  StyleSheet,
  SafeAreaView,
  Dimensions,
  ActivityIndicator,
  Alert,
  Image,
} from "react-native";
import { useRouter } from "expo-router";
import { profileService } from "@/services/profileService";
import { Profile } from "@/types/profile";

const SCREEN_WIDTH = Dimensions.get("window").width;

export default function SwipingScreen() {
  const router = useRouter();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const flatListRef = useRef(null);

  useEffect(() => {
    loadProfiles();
  }, []);

  const loadProfiles = async () => {
    try {
      setLoading(true);
      const { profiles: newProfiles } =
        await profileService.getRecommendedProfiles();
      setProfiles(newProfiles);
      setCurrentIndex(0);
    } catch (error) {
      console.error("Error loading profiles:", error);
      Alert.alert("Error", "Failed to load profiles");
    } finally {
      setLoading(false);
    }
  };

  const handleScroll = (e) => {
    const index = Math.round(e.nativeEvent.contentOffset.x / SCREEN_WIDTH);
    setCurrentIndex(index);
  };

  const handleLikePress = async () => {
    if (profiles.length > 0 && currentIndex < profiles.length) {
      try {
        await profileService.likeProfile(profiles[currentIndex].id);
        scrollToNext();
      } catch (e) {
        Alert.alert("Error", "Failed to like profile");
      }
    }
  };

  const handleDislikePress = async () => {
    if (profiles.length > 0 && currentIndex < profiles.length) {
      try {
        await profileService.dislikeProfile(profiles[currentIndex].id);
        scrollToNext();
      } catch (e) {
        Alert.alert("Error", "Failed to dislike profile");
      }
    }
  };

  const scrollToNext = () => {
    if (currentIndex < profiles.length - 1) {
      flatListRef.current?.scrollToIndex({
        index: currentIndex + 1,
        animated: true,
      });
    } else {
      loadProfiles();
    }
  };

  const renderProgressBar = () => (
    <View style={styles.progressBar}>
      {profiles.map((_, i) => (
        <View
          key={i}
          style={[
            styles.progressBarItem,
            i === currentIndex && styles.activeProgressBarItem,
          ]}
        />
      ))}
    </View>
  );

  const renderProfileCard = ({ item }) => (
    <View style={styles.card}>
      <Image
        source={{ uri: item.image }}
        style={styles.image}
        resizeMode="cover"
      />
      <View style={styles.infoContainer}>
        <Text style={styles.profileName}>{item.name}</Text>
        <Text style={styles.profileDetails}>{item.details}</Text>
      </View>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#FF6B6B" />
        <Text style={styles.loadingText}>Finding awesome people...</Text>
      </SafeAreaView>
    );
  }

  if (profiles.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.emptyText}>
          No profiles available. Please try again later.
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.likedButton}
          onPress={() => router.push("/screens/LikedOpponentsScreen")}
        >
          <Text style={styles.likedButtonText}>❤️ Liked</Text>
        </TouchableOpacity>
        <Text style={styles.title}>SwipeMatch</Text>
        <View style={{ width: 65 }} />
      </View>
      {/* Progress bar always visible */}
      {renderProgressBar()}
      {/* Card carousel */}
      <FlatList
        ref={flatListRef}
        data={profiles}
        renderItem={({ item }) => (
          <View style={styles.card}>
            {item.image ? (
              <Image
                source={{ uri: item.image }}
                style={styles.image}
                resizeMode="cover"
              />
            ) : (
              <View
                style={[
                  styles.image,
                  {
                    backgroundColor: "#e2e8f0",
                    justifyContent: "center",
                    alignItems: "center",
                  },
                ]}
              >
                <Text style={{ fontSize: 48, color: "#6B7280" }}>?</Text>
              </View>
            )}
            <View style={styles.infoContainer}>
              <Text style={styles.profileName}>{item.name || "Unknown"}</Text>
              <Text style={styles.profileDetails}>
                {item.details || "No details provided."}
              </Text>
            </View>
          </View>
        )}
        keyExtractor={(item, index) => `${item.id}-${index}`}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleScroll}
        contentContainerStyle={{
          alignItems: "center",
          paddingVertical: 20,
        }}
        getItemLayout={(_, index) => ({
          length: SCREEN_WIDTH * 0.86,
          offset: (SCREEN_WIDTH * 0.86 + 24) * index,
          index,
        })}
        initialScrollIndex={0}
      />
      {/* Action buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={handleDislikePress}
        >
          <Text style={styles.dislikeButton}>✕</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={handleLikePress}>
          <Text style={styles.likeButton}>♥</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 44,
    paddingBottom: 10,
    // backgroundColor: "#FFF",
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    height: 100,
    elevation: 8, marginBottom: 16,
    backgroundColor: "pink"
  },
  progressBar: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 10,
    marginTop: 4,
    backgroundColor: "rgba(255, 255, 255, 0.85)",
    zIndex: 10,
    height: 6,
  },
  progressBarItem: {
    width: 22,
    height: 6,
    backgroundColor: "#fee",
    marginHorizontal: 2,
    borderRadius: 4,
    opacity: 0.45,
  },
  activeProgressBarItem: {
    backgroundColor: "#FF6B6B",
    opacity: 1,
  },
  card: {
    width: SCREEN_WIDTH * 0.86,
    height: 440,
    borderRadius: 28,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOpacity: 0.19,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 13,
    marginHorizontal: 12,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  image: {
    width: "100%",
    height: 330,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
  },
  infoContainer: {
    padding: 24,
    width: "100%",
    backgroundColor: "#FFFFFFD9",
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    alignItems: "flex-start",
  },
  profileName: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#FF6B6B",
  },
  profileDetails: {
    fontSize: 16,
    color: "#6B7280",
    marginTop: 6,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingHorizontal: 44,
    paddingVertical: 20,
    marginBottom: 10,
  },
  actionButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#FFF",
    justifyContent: "center",
    alignItems: "center",
    elevation: 9,
  },
  likeButton: {
    fontSize: 34,
    color: "#FF6B6B",
    fontWeight: "900",
  },
  dislikeButton: {
    fontSize: 34,
    color: "#6B7280",
    fontWeight: "900",
  },
  emptyText: {
    fontSize: 18,
    color: "#999",
    fontWeight: "500",
    textAlign: "center",
  },
  loadingText: {
    fontSize: 18,
    color: "#FF6B6B",
    marginTop: 20,
    fontWeight: "600",
  },
});
