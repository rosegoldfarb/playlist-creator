import { getPlaylistSuggestion } from "./openaiService"; 


export const getPlaylist = async (prompt: string) => {
    const playlistSuggestionResponse = await getPlaylistSuggestion(prompt);
    
}