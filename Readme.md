# Hive - Backend API

Hive is a social media platform's backend API, providing user authentication, profile management, and real-time messaging using JWT tokens.

## Setup

1. Clone the repo:
    ```bash
    git clone <repo-url>
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

1. **POST /api/register**: User registration.
   - **Request body**:
     ```json
     {
       "fullName": "John Doe",
       "email": "johndoe@example.com",
       "password": "password123"
     }
     ```
   - **Response**: 
     ```json
     {
       "message": "User registered successfully!"
     }
     ```

2. **POST /api/login**: User login with JWT.
   - **Request body**:
     ```json
     {
       "email": "johndoe@example.com",
       "password": "password123"
     }
     ```
   - **Response**:
     ```json
     {
       "token": "<JWT-TOKEN>",
       "user_id": "<USER-ID>",
       "user_email": "<USER-EMAIL>",
       "user_name": "<USER-NAME>"
     }
     ```

3. **GET /api/user**: Get user profile (protected).
   - **Headers**: `Authorization: Bearer <JWT-TOKEN>`
   - **Response**:
     ```json
     {
       "userId": "<USER-ID>",
       "fullName": "John Doe",
       "email": "johndoe@example.com"
     }
     ```

### **Post Management:**

1. **POST /api/posts/create**: Create a new post.
   - **Request body** (multipart/form-data):
     ```json
     {
       "title": "Post Title",
       "description": "This is a description of the post",
       "userId": "<USER-ID>",
       "userEmail": "<USER-EMAIL>",
       "userName": "<USER-NAME>",
       "file": "<file>"
     }
     ```
   - **Response**: 
     ```json
     {
       "message": "Post created successfully!"
     }
     ```

2. **GET /api/posts/:id**: Get a post by ID.
   - **Response**:
     ```json
     {
       "_id": "<POST-ID>",
       "title": "Post Title",
       "description": "Post Description",
       "image_file": "<BASE64-ENCODED-IMAGE>",
       "userId": "<USER-ID>",
       "userName": "John Doe",
       "updatedAt": "2024-01-01T12:00:00Z"
     }
     ```

3. **GET /api/posts**: Get all posts.
   - **Response**:
     ```json
     [
       {
         "_id": "<POST-ID>",
         "title": "Post Title",
         "description": "Post Description",
         "userId": "<USER-ID>",
         "userName": "John Doe",
         "image_file": "<BASE64-ENCODED-IMAGE>"
       }
     ]
     ```

4. **PUT /api/posts/:id**: Update a post by ID.
   - **Request body** (multipart/form-data):
     ```json
     {
       "title": "Updated Title",
       "description": "Updated description",
       "userEmail": "updatedemail@example.com",
       "userName": "Updated User",
       "file": "<new-file>"
     }
     ```
   - **Response**: 
     ```json
     {
       "message": "Post updated successfully!"
     }
     ```

5. **DELETE /api/posts/:id**: Delete a post by ID.
   - **Response**:
     ```json
     {
       "message": "Post deleted successfully"
     }
     ```

6. **GET /api/posts/image/:id**: Get the image of a post by its ID (if image is stored in MongoDB).
   - **Response**: Returns the image data in the original content type.


