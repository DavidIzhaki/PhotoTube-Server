// controllers/videoController.js
import videosService from '../services/videosService'

exports.getVideos = async (req, res) => {
    try {
        const videos = await videosService.fetchAllVideos();
        console.log(videos);
        res.json(videos);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.createVideo = async (req, res) => {
    try {
        const newVideo = await videosService.addVideo(req.body);
        res.status(201).json(newVideo);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

