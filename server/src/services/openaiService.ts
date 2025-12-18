import OpenAI from "openai"
import { zodTextFormat } from "openai/helpers/zod";
import { z } from "zod";

const openai = new OpenAI({
    apiKey: process.env.OPEN_API_KEY
})

const Song = z.object({
    title: z.string(),
    artist: z.string()
})

const PlaylistResponse = z.object({
    songs: z.array(Song)
})

// TODO: play around with gpt5.1 mini instead of gpt4.1 - should be quicker and cheaper but maybe worse
export const getPlaylistSuggestion = async (prompt: string) => {
     // prompt eg: "Upbeat older songs like Then He Kissed Me and Signed, Sealed, Delivered. 15-20 songs."
    try {
        const response = await openai.responses.parse({
            model: "gpt-4.1",
            // reasoning: {effort: "low"} -- gpt4.1 is a non-reasoning model so I don't think this is needed
            instructions: "Create a playlist that satisfies the prompt. Cap the playlist at 100 songs regardless of user prompt.",
            input: prompt,
            // max_tokens
            text: {
                format: zodTextFormat(PlaylistResponse, "playlist"),
            },
        });

        // TODO: further validate response?
        return response?.output_parsed;
    } catch (err) {
        // TODO: graceful error handling - decide where to handle errors (maybe not here) - middleware?
        console.error("OpenAI error: ", err)
        throw err
    }

}



