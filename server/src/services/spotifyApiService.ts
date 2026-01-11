
import { getSpotifyClientToken } from "./spotifyAuthService"
import { SpotifySong } from "./playlist.types";

// TODO: consider what else we want from this endpoint, i.e. album art
export const getTrackDetails = async (title: string, artist: string): Promise<SpotifySong | null> => {
  const token = await getSpotifyClientToken();
  const response = await fetch(
    `https://api.spotify.com/v1/search?q=${encodeURIComponent(title)}%20artist:${encodeURIComponent(artist)}&type=track`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  const data = await response.json();

  // TODO: handle no results, no aritst, etc
  return {
    id: data.tracks.items[0]?.id,
    artist: data.tracks.items[0]?.artists[0]?.name,
    title: data.tracks.items[0]?.name,
    albumArt: data.tracks.items[0]?.album?.images[0]?.url, // do we need dimensions
    // preview url has been deprecated by spotify
  }
}

// this might not be necessary if we get the userid when they login
export const getProfileInfo = async (bearerToken: string) => {
  const response = await fetch(
    "https://api.spotify.com/v1/me",
    {
      headers: {
        Authorization: `Bearer ${bearerToken}`,
      },
    }
  );
  const data = await response.json();
  return data;
}

export const createPlaylist = async (bearerToken: string, userId: string, title: string, isPublic: boolean=false, isCollaborative: boolean=false) => {
  const response = await fetch(
    `https://api.spotify.com/v1/users/${userId}/playlists`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${bearerToken}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name: title,
        description: "",
        public: isPublic,
        collaborative: isCollaborative
      })
    }
  );
  const data = await response.json();
  return data;
}

// TODO: handle make sure spotify:track: prefix is included for track URIs
export const addTracksToPlaylist = async (bearerToken: string, playlistId: string, trackUris: string[]) => {  
  const response = await fetch(
    `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${bearerToken}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        uris: trackUris
      })
    }
  );
  const data = await response.json();
  return data;
}
