import { getPlaylistSuggestion } from "./openaiService"; 
import { getTrackDetails, getProfileInfo, createPlaylist, addTracksToPlaylist } from "./spotifyApiService";
import { SpotifySong } from "./playlist.types";



export const getPlaylist = async (prompt: string) => {
    const playlistSuggestionResponse = await getPlaylistSuggestion(prompt);
    const spotifySongs: SpotifySong[] = [];
    
    for (const {title, artist} of playlistSuggestionResponse.songs) {
        const trackDetails = await getTrackDetails(title, artist);
        if (trackDetails) {
            spotifySongs.push(trackDetails);
        }
    }

    return spotifySongs; 
}

export const createSpotifyPlaylist = async (bearerToken: string, title: string, songUris: string[]) => {
    const profileResponse = getProfileInfo(bearerToken);
    const userId = (await profileResponse).id;  
    const playlistResponse = await createPlaylist(bearerToken, userId, title);
    const playlistId = playlistResponse.id;
    const addTracksResponse = await addTracksToPlaylist(bearerToken, playlistId, songUris);
    return { playlistResponse, addTracksResponse };
}

   

