# Environment Setup
**MongoDB:**
Ensure MongoDB is installed and running.

Connect to MongoDB using the following connection string:
```bash
mongodb://127.0.0.1:27017/PhotoTubeDB
```
### Node.js Server:
In the config.env.local file, specify the necessary ports and IPs:

PORT: 1324

TCP_SERVER_HOST: The IP address of the machine where the TCP Linux server is running.

TCP_SERVER_PORT: The port number, which should match the one specified in the TCP server code.

**Install dependencies:**

```bash
npm install
```

**Generate fake data in the MongoDB:**

```bash
npm run fake
```
**Build the web frontend:**

```bash
npm run build
```
After the build is complete, copy the entire build folder from the web frontend into the public folder in the Node.js server.
Why? This is necessary to serve the static frontend files via the Node.js server.

**Start the Node.js server:**

```bash
npm start
```
### TCP Server:

Ensure the port in the main function of the TCP server (tcp_server.cpp) matches the TCP_SERVER_PORT value in the config.env.local file in the Node.js server.

**Compile the TCP server:**

```bash
g++ -Wall -std=c++17 -pthread tcp_server.cpp RecommendationSystem.cpp -o tcpServer
```

**Run the TCP server:**

```bash
./tcpServer
```
