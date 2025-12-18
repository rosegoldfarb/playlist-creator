// TODO: think about how routes should be split up
import { Router } from "express";
import { getPlaylistSuggestion } from "../services/openaiService";
import { getTrackDetails } from "../services/spotifyApiService";

const router = Router();

// TODO: reorganize with controller (abstraction) - clean up error handling

router.post("/generate", async (req, res) => {
    const { prompt } = req.body;

    if (!prompt) return res.status(400).json({ error: "Prompt is required" });

     try {
        const response = await getPlaylistSuggestion(prompt);
        res.json({ response });
    } catch (err) {
        res.status(500).json({ error: "Failed to generate playlist" });
    }
})

router.get("/song", async (req, res) => {
    // get song id by title and artist
    const { title, artist } = req.query;
    if (!title || !artist) {
        return res.status(400).json({ error: "Title and artist are required" });
    }
    const trackId = await getTrackDetails(title as string, artist as string);
    res.json({ trackId });


})

export default router;