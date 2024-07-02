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

### Installation Instructions

Clone the repository and install the dependencies with the following commands:

```bash
git clone https://github.com/DavidIzhaki/PhotoTube-Server.git
cd PhotoTube-Server
npm install
```


Create a `.env.local` file in config directory inside the root directory of your project and include the following settings to configure your environment:

```bash
# MongoDB Connection URI -  You can choose another legal path to connect to MongoDB
CONNECTION_STRING="mongodb://127.0.0.1:27017/PhotoTubeDB"

# Port number for the server - You can choose another legal port
PORT=1324

# Base URL configuration
BASE_URL=http://localhost:${PORT}
```

Replace 1324 and mongodb://127.0.0.1:27017/PhotoTubeDB with the port number and CONNECTION_STRING you desire. This customization enhances flexibility within your development environment.

### Configuration

To streamline the process of starting the server and generating fake data, add the following scripts to your `package.json`:

```bash
"scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "start": "cross-env NODE_ENV=local node app.js",
    "fake": "cross-env NODE_ENV=local node generateFakeData.js"
}
```

### Running the Server

To start the server without populating the MongoDB database with fake data:
```bash
npm start
```

To start the server and populate the MongoDB database with fake data:
```bash
npm run fake
npm start
```

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
   ```

### Public Directory Setup

Our server utilizes a public directory to serve static files, differing from the build folder typically used in frontends. To generate a production build of your own, navigate to our frontend project directory in this repository: https://github.com/DavidIzhaki/PhotoTube-Web.git

 and run:

```bash
npm run build
```

This command prepares your frontend for production by compiling all resources into the build directory.


## API Endpoints Overview

- `/api/users` for user registration and management.
- `/api/videos` to fetch, create, and manage videos.

Be sure to set up your `.env` file with the MongoDB connection string and desired port before starting the server.
