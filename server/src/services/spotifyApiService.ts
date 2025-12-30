
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