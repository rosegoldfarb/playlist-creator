import { redis } from "../lib/redis"
import axios from "axios";

const SPOTIFY_TOKEN_KEY = "spotify:client_access_token";;

export const getSpotifyClientToken = async (): Promise<string> => {
  const cachedToken = await redis.get(SPOTIFY_TOKEN_KEY);
  if (cachedToken) {
    return cachedToken;
  }

  const response = await axios.post(
    "https://accounts.spotify.com/api/token",
    new URLSearchParams({
      grant_type: "client_credentials",
    }),
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization:
          "Basic " +
          Buffer.from(
            `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
          ).toString("base64"),
      },
    }
  );

  const { access_token, expires_in } = response.data;

  await redis.set(
    SPOTIFY_TOKEN_KEY,
    access_token,
    { EX: expires_in - 60 } // expire 60 seconds early for a buffer
  );

  return access_token;
}
