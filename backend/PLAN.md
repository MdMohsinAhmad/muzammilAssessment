# Tinder App Backend Implementation Plan

## Technology Stack
- PHP Laravel Framework
- MySQL RDBMS
- Swagger/OpenAPI for API documentation

## Database Schema

### Users Table
```sql
CREATE TABLE users (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    age INT NOT NULL,
    bio TEXT,
    location VARCHAR(255),
    email VARCHAR(255) UNIQUE,
    password VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### Pictures Table
```sql
CREATE TABLE pictures (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL,
    url VARCHAR(512) NOT NULL,
    is_primary BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

### Likes Table
```sql
CREATE TABLE likes (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL,
    liked_user_id BIGINT UNSIGNED NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (liked_user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_like (user_id, liked_user_id)
);
```

### Matches Table (Optional - for future enhancement)
```sql
CREATE TABLE matches (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user1_id BIGINT UNSIGNED NOT NULL,
    user2_id BIGINT UNSIGNED NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user1_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (user2_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_match (user1_id, user2_id)
);
```

## API Endpoints

### 1. List Recommended People (with pagination)
```
GET /api/users/recommended?page=1&limit=10
```
Response:
```json
{
    "data": [
        {
            "id": 1,
            "name": "Alex Morgan",
            "age": 28,
            "bio": "Love hiking and photography...",
            "location": "New York, NY",
            "distance": 5,
            "pictures": [
                "https://example.com/image1.jpg",
                "https://example.com/image2.jpg"
            ]
        }
    ],
    "pagination": {
        "current_page": 1,
        "last_page": 5,
        "per_page": 10,
        "total": 50
    }
}
```

### 2. Like Person
```
POST /api/users/{id}/like
```
Response:
```json
{
    "success": true,
    "message": "User liked successfully"
}
```

### 3. Dislike Person
```
POST /api/users/{id}/dislike
```
Response:
```json
{
    "success": true,
    "message": "User disliked successfully"
}
```

### 4. Liked People List
```
GET /api/users/liked
```
Response:
```json
{
    "data": [
        {
            "id": 1,
            "name": "Alex Morgan",
            "age": 28,
            "bio": "Love hiking and photography...",
            "location": "New York, NY",
            "distance": 5,
            "pictures": [
                "https://example.com/image1.jpg"
            ]
        }
    ]
}
```

## Cron Job Implementation

Create a scheduled task that runs daily to check if any user has been liked more than 50 times:

```php
// In app/Console/Commands/CheckPopularUsers.php
<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\User;
use Illuminate\Support\Facades\Mail;
use App\Mail\PopularUserNotification;

class CheckPopularUsers extends Command
{
    protected $signature = 'users:check-popular';
    protected $description = 'Check for users liked more than 50 times and notify admin';

    public function handle()
    {
        $popularUsers = User::select('users.*')
            ->join('likes', 'users.id', '=', 'likes.liked_user_id')
            ->groupBy('users.id')
            ->havingRaw('COUNT(likes.id) > 50')
            ->get();

        if ($popularUsers->count() > 0) {
            Mail::to(config('mail.admin_email'))
                ->send(new PopularUserNotification($popularUsers));
                
            $this->info("Notified admin about {$popularUsers->count()} popular users.");
        } else {
            $this->info("No users found with more than 50 likes.");
        }
    }
}
```

Register the command in `app/Console/Kernel.php`:
```php
protected function schedule(Schedule $schedule)
{
    $schedule->command('users:check-popular')->daily();
}
```

## Swagger Documentation

Use OpenAPI annotations to document the API endpoints. Install `darkaonline/l5-swagger` package for Laravel:

```bash
composer require "darkaonline/l5-swagger:^8.0"
php artisan vendor:publish --provider "L5Swagger\L5SwaggerServiceProvider"
```

Example endpoint documentation:
```php
/**
 * @OA\Get(
 *     path="/api/users/recommended",
 *     summary="Get recommended users",
 *     description="Retrieve a paginated list of recommended users",
 *     operationId="getRecommendedUsers",
 *     @OA\Parameter(
 *         name="page",
 *         in="query",
 *         description="Page number",
 *         required=false,
 *         @OA\Schema(type="integer")
 *     ),
 *     @OA\Parameter(
 *         name="limit",
 *         in="query",
 *         description="Number of users per page",
 *         required=false,
 *         @OA\Schema(type="integer")
 *     ),
 *     @OA\Response(
 *         response=200,
 *         description="Successful operation",
 *         @OA\JsonContent(
 *             @OA\Property(property="data", type="array", @OA\Items(ref="#/components/schemas/User")),
 *             @OA\Property(property="pagination", ref="#/components/schemas/Pagination")
 *         )
 *     )
 * )
 */
public function getRecommendedUsers(Request $request)
{
    // Implementation here
}
```

## Deployment Instructions

1. Set up Laravel project:
   ```bash
   composer create-project laravel/laravel tinder-backend
   cd tinder-backend
   ```

2. Configure database in `.env` file:
   ```
   DB_CONNECTION=mysql
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_DATABASE=tinder_app
   DB_USERNAME=your_username
   DB_PASSWORD=your_password
   ```

3. Run migrations:
   ```bash
   php artisan migrate
   ```

4. Set up cron job for Laravel scheduler:
   ```bash
   * * * * * cd /path-to-your-project && php artisan schedule:run >> /dev/null 2>&1
   ```

5. Generate Swagger documentation:
   ```bash
   php artisan l5-swagger:generate
   ```

6. Serve the application:
   ```bash
   php artisan serve
   ```

The Swagger UI will be available at `http://localhost:8000/api/documentation`.