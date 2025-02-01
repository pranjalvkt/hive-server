# Hive - Backend API

Hive is a social media platform's backend API, providing user authentication, profile management, and real-time messaging using JWT tokens.

## Setup

1. Clone the repo:
    ```bash
    git clone https://github.com/pranjalvkt/hive-server.git
    ```

2. Install dependencies:
    ```bash
    npm install
    ```

3. Configure environment variables (`MONGODB_URI`, `JWT_SECRET_KEY`) in a `.env` file.

4. Start the server:
    ```bash
    node server
    ```

## API Endpoints

### **User Authentication:**
1. **POST /api/register** - Register a new user.
2. **POST /api/login** - User login with JWT authentication.
3. **GET /api/user** - Get user profile (protected).
4. **PUT /api/updateUser/:id** - Update user profile (with file upload).
5. **GET /api/userImage/:id** - Retrieve user profile image.
6. **GET /api/getConnections** - Fetch all user connections.

### **Post Management:**
1. **POST /api/posts/create** - Create a new post (with file upload).
2. **GET /api/posts/:id** - Retrieve a post by ID.
3. **GET /api/posts/image/:id** - Get image of a post by its ID.
4. **GET /api/posts** - Fetch all posts (protected).
5. **PUT /api/posts/:id** - Update a post (with file upload).
6. **DELETE /api/posts/:id** - Delete a post.

### **Friend Requests & Connections:**
1. **POST /api/friends/send** - Send a friend request.
2. **POST /api/friends/accept** - Accept a friend request.
3. **POST /api/friends/reject** - Reject a friend request.
4. **GET /api/friends/pending-requests** - Fetch pending friend requests.
5. **GET /api/friends/sent-requests** - Fetch sent friend requests.
6. **GET /api/friends/accepted-requests** - Fetch accepted friend requests.
7. **GET /api/friends/available-users** - Fetch users available for connection.
8. **GET /api/friends/all-connections** - Get all accepted connections.
9. **POST /api/friends/remove-connection** - Remove a friend connection.