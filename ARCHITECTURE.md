# Tinder App Architecture

## System Overview

```mermaid
graph TD
    A[Mobile App - React Native] --> B[Backend API - PHP Laravel]
    B --> C[(MySQL Database)]
    B --> D[Email Service]
    E[Cron Job] --> B
    F[Admin] --> D

    subgraph MobileApp[Frontend - React Native]
        A
    end

    subgraph Backend[Backend - PHP Laravel]
        B
        E
    end

    subgraph Infrastructure[Infrastructure]
        C
        D
    end

    subgraph External[External]
        F
    end
```

## Mobile App Components

```mermaid
graph TD
    A[Splash Screen] --> B[Main Swiping Screen]
    B --> C[Swipeable Cards]
    B --> D[Liked Profiles Screen]
    C --> E[Profile Data]
    D --> E
    E --> F[Mock Data Service]

    subgraph Screens
        A
        B
        D
    end

    subgraph Components
        C
    end

    subgraph Services
        E
        F
    end
```

## Backend API Structure

```mermaid
graph TD
    A[API Endpoints] --> B[User Controller]
    A --> C[Likes Controller]
    B --> D[User Model]
    C --> E[Likes Model]
    D --> F[Database]
    E --> F
    F --> G[Users Table]
    F --> H[Pictures Table]
    F --> I[Likes Table]
    J[Cron Job] --> K[Admin Notification]

    subgraph API
        A
        B
        C
    end

    subgraph Models
        D
        E
    end

    subgraph Database
        F
        G
        H
        I
    end

    subgraph Jobs
        J
        K
    end
```

## Data Flow

```mermaid
sequenceDiagram
    participant User
    participant Mobile
    participant API
    participant Database
    participant Email

    User->>Mobile: Swipe Right (Like)
    Mobile->>API: POST /users/{id}/like
    API->>Database: Insert like record
    Database-->>API: Success
    API-->>Mobile: Success response

    User->>Mobile: View Liked Profiles
    Mobile->>API: GET /users/liked
    API->>Database: Query liked users
    Database-->>API: Return profiles
    API-->>Mobile: Return profiles
    Mobile->>User: Display profiles

    loop Daily
        Cron->>Database: Check popular users (>50 likes)
        Database-->>Cron: Return popular users
        Cron->>Email: Send notification to admin
    end
```

## Folder Structure

```
tinder-app/
├── app/                     # Mobile app source code
│   ├── (tabs)/             # Tab navigation
│   ├── components/         # Reusable components
│   │   └── SwipeableCard.tsx
│   ├── screens/            # App screens
│   │   ├── splash.tsx
│   │   ├── SwipingScreen.tsx
│   │   └── LikedProfilesScreen.tsx
│   ├── services/           # Data services
│   │   └── profileService.ts
│   ├── types/              # TypeScript types
│   │   └── profile.ts
│   └── _layout.tsx         # Navigation layout
├── backend/                # Backend documentation
│   ├── PLAN.md             # Implementation plan
│   └── api-spec.yaml       # API specification
├── components/             # Shared components
├── constants/              # App constants
├── hooks/                  # Custom hooks
├── assets/                 # Images and assets
└── README.md              # Project documentation
```

## Technology Stack

### Frontend
- **Framework**: React Native with Expo
- **Language**: TypeScript
- **Navigation**: Expo Router
- **State Management**: Built-in React state
- **Gestures**: React Native Gesture Handler
- **Animations**: React Native Reanimated

### Backend
- **Framework**: PHP Laravel
- **Database**: MySQL
- **API Documentation**: Swagger/OpenAPI
- **Scheduling**: Laravel Task Scheduling
- **Email**: Laravel Mail

## Key Features Implemented

### Mobile App
1. **Splash Screen**
   - Custom branded loading screen
   - Automatic transition to main app

2. **Swiping Interface**
   - Tinder-like card swiping
   - Gesture recognition for like/dislike
   - Visual feedback during swiping
   - Double-tap to like
   - Manual action buttons

3. **Profile Display**
   - User cards with images
   - Name, age, location, and bio
   - Stack-based card presentation

4. **Liked Profiles**
   - Dedicated screen for liked users
   - List view of all liked profiles
   - Empty state handling

### Backend (Planned)
1. **RESTful API**
   - Recommended profiles endpoint
   - Like/dislike endpoints
   - Liked profiles endpoint

2. **Database Schema**
   - Users table
   - Pictures table
   - Likes table
   - Matches table (future enhancement)

3. **Cron Jobs**
   - Daily check for popular users
   - Admin email notifications

4. **Documentation**
   - OpenAPI specification
   - Swagger UI integration