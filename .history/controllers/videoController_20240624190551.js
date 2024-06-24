// controllers/videoController.js
import videosService from '../services/videoService.js'

const getVideos = async (req, res) => {
    try {
        const videos = await videoService.fetchAllVideos();
        console.log(videos);
        res.json(videos);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


export default { getVideos }