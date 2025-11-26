export interface Profile {
  id: string;
  name: string;
  age: number;
  bio: string;
  location: string;
  distance: number; // in miles/km
  pictures: string[]; // array of image URLs
  interests: string[];
  isLiked?: boolean; // to track if current user liked this profile
}

export interface Match {
  id: string;
  profile: Profile;
  timestamp: Date;
}