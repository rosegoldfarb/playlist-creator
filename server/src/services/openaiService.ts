import OpenAI from "openai"
import { zodTextFormat } from "openai/helpers/zod";
import { z } from "zod";
import { PlaylistResponseSchema, PlaylistResponse } from "./playlist.types";

const openai = new OpenAI({
    apiKey: process.env.OPEN_API_KEY
})


// TODO: play around with gpt5.1 mini instead of gpt4.1 - should be quicker and cheaper but maybe worse
export const getPlaylistSuggestion = async (prompt: string): Promise<PlaylistResponse> => {
     // prompt eg: "Upbeat older songs like Then He Kissed Me and Signed, Sealed, Delivered. 15-20 songs."
    try {
        const response = await openai.responses.parse({
            model: "gpt-4.1",
            // reasoning: {effort: "low"} -- gpt4.1 is a non-reasoning model so I don't think this is needed
            instructions: "Create a playlist that satisfies the prompt. Cap the playlist at 100 songs regardless of user prompt.",
            input: prompt,
            // max_tokens
            text: {
                format: zodTextFormat(PlaylistResponseSchema, "playlist"),
            },
        });

        const playlist = response.output_parsed;
        if (!playlist) {
            throw new Error("Failed to parse playlist from OpenAI response");
        } 

        return playlist;

    } catch (err) {
        console.error(err)
        throw err
    }
}



