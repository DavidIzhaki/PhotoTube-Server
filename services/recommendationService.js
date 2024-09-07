// recommendationService.js
import sendUserActivity from '../tcpClient.js';  // Assuming tcpClient.js is adjusted for real path

export async function getVideoRecommendations(userId, videoId) {
  
    return sendUserActivity(userId, videoId);
    
}
