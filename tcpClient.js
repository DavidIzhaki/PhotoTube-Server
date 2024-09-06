import net from 'net';
import dotenv from 'dotenv';

dotenv.config();

function sendCommand(command) {
  return new Promise((resolve, reject) => {
    const client = new net.Socket();
    
    client.connect(parseInt(process.env.TCP_SERVER_PORT, 10), process.env.TCP_SERVER_HOST, () => {
      console.log('Connected to the TCP server');
      client.write(command + '\n'); // Ensure the server recognizes end of the command
    });

    client.on('data', (data) => {
      console.log('Received:', data.toString());
      resolve(data.toString());
      client.destroy(); // Close the connection after receiving the response
    });

    client.on('error', (err) => {
      console.error('TCP Client Error:', err);
      reject(err);
    });

    client.on('close', () => {
      console.log('Connection to TCP server closed');
    });
  });
}

// Export the function if needed elsewhere in your Node.js code
export default sendCommand;
