import { getPlaylistSuggestion } from "./openaiService"; 
import { getTrackDetails } from "./spotifyApiService";
import { SpotifySong } from "./playlist.types";



export const getPlaylist = async (prompt: string) => {
    const playlistSuggestionResponse = await getPlaylistSuggestion(prompt);
    const spotifySongs: SpotifySong[] = [];
    
    for (const song of playlistSuggestionResponse.songs) {
        const trackDetails = await getTrackDetails(song.title, song.artist);
        if (trackDetails) {
            spotifySongs.push(trackDetails);
        }
    }
    
    return spotifySongs; 
}