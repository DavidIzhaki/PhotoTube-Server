# PhotoTube Server

PhotoTube Server is a backend service utilizing Node.js, Express, and MongoDB. It is specially designed to support a video-sharing platform similar to YouTube, managing user interactions, video uploads, and comments. The architecture follows the MVC (Model-View-Controller) pattern with the view component typically handled by a React frontend.

## Features

- **User Authentication**: Implements a secure login and registration system, generating JWTs for session management.
- **Video Management**: Allows users to upload, edit, and delete videos.
- **Comment System**: Users can post comments on videos and manage their comments.
- **Data Seeding for Development**: Populate the MongoDB database with fake data for testing and development.

## Integration with React Frontend

The server is crafted to work seamlessly with a React frontend, facilitating SPA behaviors such as page refreshes and route navigation without losing application state.
- **Server-Side Rendering Support**: Configured to serve the React application directly, enabling access to different routes without redirection.
- **State Management**: Ensures that user sessions and application state are preserved across page reloads and navigation, using JWTs and MongoDB.
- **Dynamic Routing**: API endpoints are aligned with the React application's routing to ensure consistent data fetching and manipulation.

## Getting Started

### Prerequisites

- Node.js
- MongoDB
- npm

### Installation

Clone the repository and install the dependencies:
git clone https://github.com/DavidIzhaki/Phottubee-Server.git
cd PhotoTube_Server
npm install


### Configuration

Create a `.env` file in the root directory and set the following:
CONNECTION_STRING = "mongodb://127.0.0.1:27017/PhotoTubeDB"
PORT = 1324
BASE_URL = http://localhost:${PORT}


### Running the Server

To start the server without seeding the MongoDB database with fake data:
npm start

To start the server and populate the MongoDB database with fake data:
npm run fake
npm start


The `fake` script utilizes `generateFakeData.js` to seed the database with users, videos, and comments to support development and testing.

## Seeding the Database

The seeding script (`generateFakeData.js`) uses `faker` library to populate the database with fake users, videos, and comments.

## API Endpoints Overview

- `/api/users` for user registration and management.
- `/api/videos` to fetch, create, and manage videos.

Be sure to set up your `.env` file with the MongoDB connection string and desired port before starting the server.
