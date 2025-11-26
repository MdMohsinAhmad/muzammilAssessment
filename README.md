# Tinder-like App (2025)

This project is a mobile application similar to Tinder with both frontend (React Native) and backend (PHP Laravel) components.

## Frontend (React Native)

The mobile application has been implemented with the following features:

### Features Implemented

1. **Splash Screen**
   - Custom splash screen that transitions to the main app

2. **Tinder-like Card Interface**
   - Swipeable cards for user profiles (like/dislike functionality)
   - Visual feedback for swiping actions
   - Double-tap to like
   - Manual like/dislike buttons

3. **Profile Display**
   - Profile cards with images, name, age, location, and bio
   - Mock data for demonstration

4. **Liked Profiles Screen**
   - Dedicated screen to view all liked profiles
   - Back navigation to the main swiping screen

### Technology Stack

- React Native with Expo
- TypeScript
- React Navigation (expo-router)
- React Native Gesture Handler
- React Native Reanimated

### Project Structure

```
app/
├── (tabs)/              # Tab navigation structure
├── components/           # Custom components
├── screens/              # Screen components
├── services/             # Data services
├── types/                # TypeScript types
└── _layout.tsx          # Root layout configuration
```

## Backend (PHP Laravel)

The backend implementation plan has been documented but not yet implemented. The plan includes:

### Database Schema
- Users table with profile information
- Pictures table for user images
- Likes table to track user preferences
- Matches table for mutual connections

### API Endpoints
1. List of recommended people (with pagination)
2. Like person
3. Dislike person
4. Liked people list

### Additional Features
- Cron job to notify admin when a user gets more than 50 likes
- Swagger/OpenAPI documentation for the API

### Implementation Plan
Detailed in [backend/PLAN.md](backend/PLAN.md)

## Getting Started

### Prerequisites
- Node.js
- Expo CLI
- PHP 8.0+
- Composer
- MySQL

### Frontend Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npx expo start
   ```

3. Use the Expo Go app on your mobile device or start an emulator to view the app.

   The app will be available at:
   - Mobile: exp://192.168.31.232:8081 (Scan the QR code with Expo Go)
   - Web: http://localhost:8081

### Backend Implementation

The backend needs to be implemented following the plan in [backend/PLAN.md](backend/PLAN.md).

## Future Enhancements

1. Implement real backend API integration
2. Add user authentication
3. Implement real-time matching
4. Add chat functionality
5. Implement push notifications
6. Add more sophisticated matching algorithms

## Screenshots

### Main Swiping Screen
![Tinder Main Screen](https://prod-files-secure.s3.us-west-2.amazonaws.com/fd6c6d53-8896-4c97-8ff7-fe6fa60dc283/559184d1-c333-46ee-b3a9-bf49ea6771e0/tinder_main.png)

### Like Action
![Like Action](https://prod-files-secure.s3.us-west-2.amazonaws.com/fd6c6d53-8896-4c97-8ff7-fe6fa60dc283/e5057d53-9704-4304-9d9e-8771ca26382a/IMG_1672.png)

### Nope Action
![Nope Action](https://prod-files-secure.s3.us-west-2.amazonaws.com/fd6c6d53-8896-4c97-8ff7-fe6fa60dc283/fc31c942-48d6-4d05-812d-133dba583b43/IMG_1671.png)