// TODO, maybe reorganize file structure
import { z } from "zod";

export const SongSchema = z.object({
    title: z.string(),
    artist: z.string()
})

export const PlaylistResponseSchema = z.object({
    songs: z.array(SongSchema).min(1, "Playlist must contain at least one song")
})

export type Song = z.infer<typeof SongSchema>;

export type PlaylistResponse = z.infer<typeof PlaylistResponseSchema>;


export type SpotifySong = Song & {
    id: string;
    // artist: string;
    // title: string;
    albumArt?: string;
}