import { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET, SPOTIFY_REDIRECT_URI, SPOTIFY_BASE_URL } from "../common/constants";
import { SpotifyAuthResponse } from "../types/SpotifyAuthResponse";

const getAuthString = (): string => {
  return btoa(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`);
}

export const getAccessToken = async (code: string): Promise<string | null> => {
  const authString = getAuthString();

  const headers = {
    'Authorization': `Basic ${authString}`,
    'Content-Type': 'application/x-www-form-urlencoded'
  }

  const body = new URLSearchParams({
    code,
    'redirect_uri': SPOTIFY_REDIRECT_URI,
    'grant_type': 'authorization_code'
  });

  const response = await fetch(`${SPOTIFY_BASE_URL}/api/token`, {method: 'POST', headers, body});
  const data: SpotifyAuthResponse = await response.json();

  if (data.error) {
    throw new Error(data.error_description);
  }

  localStorage.setItem('spotify_access_token', data.access_token || '');
  localStorage.setItem('spotify_refresh_token', data.refresh_token || '');
  return data.access_token || null;
};