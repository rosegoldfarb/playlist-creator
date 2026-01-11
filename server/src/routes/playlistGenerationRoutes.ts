// TODO: think about how routes should be split up
import { Router } from "express";
import { getPlaylist, createSpotifyPlaylist} from "../services/playlistService";
import { getTrackDetails } from "../services/spotifyApiService";

const router = Router();

// TODO: reorganize with controller (abstraction) - clean up error handling

router.post("/getSuggestedPlaylist", async (req, res) => {
    const { prompt } = req.body;

    if (!prompt) return res.status(400).json({ error: "Prompt is required" });

     try {
        const response = await getPlaylist(prompt);
        res.json({ response });
    } catch (err) {
        res.status(500).json({ error: "Failed to generate playlist" });
    }
})

// 'Authorization: Bearer 1POdFZRZbvb...qqillRxMr2z'
//   BQC1PzEVuUsQSit0S4WIQdaMAKtjlZA3rMmm69bC5vTnKpIAUClnfmkT_jQKCWD-eOFX9XrQD884OCCNNnyoWB0UaYW3-zk0_si6c8sZ9i-0ckb4miKlORkBQlIDZwWNrdZx2ywbX7GQs1SIlpsymm5CrGNCdB1NebemlnJ6Qe8vMswwsjh52FoGvlDagCCJlA7KBBj64dNXTqOq-y27duEonqUYGoYqVAnClq0aMf3uM6q8hHi0CJl_yWpxhz_XQvRRkzPcO_KB2tODYBMh87V4RHWsoWpnRhcgK24CCj2mFdZDbbcP2Myp6e6EMRu_

router.post("/createPlaylist", async (req, res) => {
    const { bearerToken, title, songUris } = req.body;
    if (!bearerToken || !title || !songUris) {
        return res.status(400).json({ error: "Bearer token, title, and song URIs are required" });
    }
    try {
        const response = await createSpotifyPlaylist(bearerToken, title, songUris);
        res.json({ response });
    } catch (err) {
        res.status(500).json({ error: "Failed to create playlist" });
    }
});

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