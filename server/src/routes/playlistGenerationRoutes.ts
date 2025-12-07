// TODO: think about how routes should be split up
import { Router } from "express";
import { getPlaylist } from "../services/openaiService";

const router = Router();

// TODO: reorganize with controller (abstraction) - clean up error handling

router.post("/generate", async (req, res) => {
    const { prompt } = req.body;

    if (!prompt) return res.status(400).json({ error: "Prompt is required" });

     try {
        const response = await getPlaylist(prompt);
        res.json({ response });
    } catch (err) {
        res.status(500).json({ error: "Failed to generate playlist" });
    }
})

export default router;