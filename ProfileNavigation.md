# ProfilePage Navigation Guide

## How to Navigate to Profile Pages

### 1. **Your Own Profile**

There are multiple ways to navigate to your own profile:

#### Method 1: Navbar Profile Link

- Once logged in, click on your username in the navbar (appears as "👤 username")
- This takes you directly to `/profile/your-username`

#### Method 2: "My Profile" Menu Item

- Use the "My Profile" link in the main navigation menu (visible when logged in)
- Also navigates to `/profile/your-username`

#### Method 3: Direct URL

- Navigate to `/profile` (redirects to your profile if logged in)
- Or directly to `/profile/your-username`

### 2. **Other Users' Profiles**

#### Method 1: From Project Cards

- On any project card, click the author's username (e.g., "by @username")
- This navigates to `/profile/username`

#### Method 2: Direct URL

- Navigate directly to `/profile/any-username`

### 3. **URL Structure**

```
/profile/:username    - View specific user's profile
/profile              - Redirects to your own profile (if logged in)
```

### 4. **Profile Features Available**

Once on a profile page, you can:

- **View Basic Info**: Name, email, bio, location, etc.
- **Browse Projects**: All projects by that user
- **See Statistics**: Project views, ratings, achievements
- **Check Social Links**: GitHub, LinkedIn, Twitter
- **View Experience**: Work history and education
- **Dashboard**: Analytics and activity feed

### 5. **Profile Editing**

- Only available on your own profile
- Click "Edit Profile" to modify information
- Upload avatar, update bio, add experience, etc.
- Click "Save Changes" to persist updates

### 6. **Navigation Examples**

```javascript
// Using React Router programmatically
navigate("/profile/johndoe"); // Go to johndoe's profile
navigate(`/profile/${username}`); // Dynamic username
navigate("/profile"); // Your own profile (redirects)
```

### 7. **Features by Section**

- **Basic Info**: Personal details, bio, location
- **Advanced Info**: Project analytics, skills
- **Projects**: Grid of user's projects with navigation
- **Education**: Academic background
- **Social Links**: External profiles
- **Dashboard**: Statistics, achievements, activity feed

## Implementation Details

### Backend Routes

```javascript
GET /api/v1/users/:username          // Get user profile
GET /api/v1/users/:userId/projects   // Get user's projects
PUT /api/v1/users/:userId            // Update profile
POST /api/v1/users/:userId/avatar    // Upload avatar
```

### Frontend Routes

```javascript
<Route path="/profile/:username" element={<ProfilePage />} />
<Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
```

The ProfilePage component automatically detects whether you're viewing your own profile or someone else's, and shows appropriate editing capabilities.
