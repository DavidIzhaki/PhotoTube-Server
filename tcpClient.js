import dotenv from 'dotenv';
import net from 'net';

// Configure dotenv to load variables from the .env.local inside the config folder
dotenv.config({ path: './config/.env.local' });

// Access the variables via process.env
const TCP_SERVER_HOST = process.env.TCP_SERVER_HOST;
const TCP_SERVER_PORT = process.env.TCP_SERVER_PORT;

/**
 * Send user video watching activity to the TCP server and receive recommendations.
 * @param {string} userId - The ID of the user watching the video.
 * @param {string} videoId - The ID of the video being watched.
 * @returns {Promise<Array<string>>} - A promise that resolves to a list of recommended video IDs.
 */
function sendUserActivity(userId, videoId) {
    return new Promise((resolve, reject) => {
        const client = new net.Socket();
        
        // Connect to the TCP server
        client.connect(parseInt(TCP_SERVER_PORT, 10), TCP_SERVER_HOST, () => {
            console.log(`Connected to TCP server at ${TCP_SERVER_HOST}:${TCP_SERVER_PORT}`);
            // Send the user activity in the format "userId,videoId"
            // Before sending to TCP server
            client.write(`${userId},${videoId}\n`);
        });

        // Handle data received from the server
        client.on('data', (data) => {
            console.log('Received from server:', data.toString());
            // Assume the server sends back a comma-separated list of recommended video IDs
            const recommendations = data.toString().split(',');
            resolve(recommendations);
            client.destroy(); // Close the connection after receiving the response
        });

        // Handle connection closure
        client.on('close', () => {
            console.log('Connection to TCP server closed');
        });

        // Handle errors
        client.on('error', (err) => {
            console.error('TCP Client Error:', err);
            reject(err);
        });
    });
}

export default sendUserActivity;
