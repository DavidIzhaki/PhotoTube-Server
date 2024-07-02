# PhotoTube Server

PhotoTube Server is a backend service utilizing Node.js, Express, and MongoDB. It is specially designed to support a video-sharing platform similar to YouTube, managing user interactions, video uploads, likes and comments. The architecture follows the MVC (Model-View-Controller) pattern with the view component typically handled by a React frontend.

## Features

- **User Authentication**: Implements a secure login and registration system, generating JWTs for session management.
- **Video Management**: Allows users to upload, edit, and delete videos.
- **Comment System**: Users can post comments on videos and manage their comments.
- **Data Populate for Development**: Populate the MongoDB database with fake data for testing and development.

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
git clone https://github.com/DavidIzhaki/PhotoTube-Server.git
cd PhotoTube-Server
npm install


### Configuration

Create a `.env` file in the root directory of your project and include the following settings to configure your environment:

```bash
# MongoDB Connection URI
CONNECTION_STRING="mongodb://127.0.0.1:27017/PhotoTubeDB"

# Port number for the server
PORT=1324

# Base URL configuration
BASE_URL=http://localhost:${PORT}



### Running the Server

To start the server without populating the MongoDB database with fake data:
npm start

To start the server and populate the MongoDB database with fake data:
npm run fake
npm start


The `fake` script utilizes `generateFakeData.js` to seed the database with users, videos, and comments to support development and testing.

## Populating the Database with Fake Data

To enhance development and testing, our application includes a utility script named `generateFakeData.js`. This script uses the `faker` library to generate and populate the database with fictitious users, videos, and comments.

### What Does `generateFakeData.js` Do?

This script is designed to automatically create:
- A specified number of fake users with realistic but fictional data.
- A collection of videos associated with these users.
- Comments on these videos to simulate user interaction.

Each element (user, video, and comment) is crafted using random but coherent data, ensuring a diverse dataset for robust testing.

### How to Run the Fake Data Generation Script

To execute this script and populate your database with fake data, please follow these steps:

1. Make sure your MongoDB service is running on your local machine or a specified server.
2. Open a terminal and navigate to the root directory of the project where `generateFakeData.js` is located.
3. Enter the following command:

   ```bash
   npm run fake


## API Endpoints Overview

- `/api/users` for user registration and management.
- `/api/videos` to fetch, create, and manage videos.

Be sure to set up your `.env` file with the MongoDB connection string and desired port before starting the server.
