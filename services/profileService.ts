import { Profile } from '../types/profile';

// Mock data for demonstration
const mockProfiles: Profile[] = [
  {
    id: '1',
    name: 'Alex Morgan',
    age: 28,
    bio: 'Love hiking and photography. Looking for someone to explore the world with.',
    location: 'New York, NY',
    distance: 5,
    pictures: [
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1887&q=80',
      'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1887&q=80',
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1888&q=80'
    ],
    interests: ['hiking', 'photography', 'travel'],
  },
  {
    id: '2',
    name: 'Jordan Smith',
    age: 32,
    bio: 'Foodie and chef. Love trying new restaurants and cooking at home.',
    location: 'Brooklyn, NY',
    distance: 8,
    pictures: [
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1887&q=80',
      'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1887&q=80'
    ],
    interests: ['cooking', 'food', 'restaurants'],
  },
  {
    id: '3',
    name: 'Taylor Kim',
    age: 25,
    bio: 'Artist and musician. Love painting and playing guitar in my free time.',
    location: 'Queens, NY',
    distance: 12,
    pictures: [
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1964&q=80',
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1887&q=80'
    ],
    interests: ['art', 'music', 'painting'],
  },
  {
    id: '4',
    name: 'Morgan Lee',
    age: 30,
    bio: 'Fitness enthusiast and yoga instructor. Passionate about health and wellness.',
    location: 'Manhattan, NY',
    distance: 3,
    pictures: [
      'https://images.unsplash.com/photo-1504593811423-6dd665756598?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80'
    ],
    interests: ['yoga', 'fitness', 'health'],
  },
  {
    id: '5',
    name: 'Casey Johnson',
    age: 27,
    bio: 'Software engineer who loves to travel and try new technologies.',
    location: 'Jersey City, NJ',
    distance: 15,
    pictures: [
      'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1887&q=80',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1887&q=80'
    ],
    interests: ['technology', 'travel', 'coding'],
  },
];

let likedProfiles: Profile[] = [];

export const profileService = {
  // Get a list of recommended profiles (paginated)
  async getRecommendedProfiles(page: number = 1, limit: number = 10): Promise<{ profiles: Profile[], totalPages: number }> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const profiles = mockProfiles.slice(startIndex, endIndex);
    
    return {
      profiles,
      totalPages: Math.ceil(mockProfiles.length / limit)
    };
  },

  // Like a profile
  async likeProfile(profileId: string): Promise<boolean> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const profile = mockProfiles.find(p => p.id === profileId);
    if (profile) {
      profile.isLiked = true;
      likedProfiles.push(profile);
      return true;
    }
    return false;
  },

  // Dislike a profile
  async dislikeProfile(profileId: string): Promise<boolean> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const profile = mockProfiles.find(p => p.id === profileId);
    if (profile) {
      profile.isLiked = false;
      return true;
    }
    return false;
  },

  // Get liked profiles
  async getLikedProfiles(): Promise<Profile[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return [...likedProfiles];
  },

  // Reset liked profiles (for demo purposes)
  resetLikedProfiles(): void {
    likedProfiles = [];
    mockProfiles.forEach(profile => {
      profile.isLiked = undefined;
    });
  }
};