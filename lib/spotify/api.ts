import { getValidAccessToken } from './auth';

const SPOTIFY_API = 'https://api.spotify.com/v1';

async function fetchWebApi(endpoint: string, method: string, body?: any) {
  const token = await getValidAccessToken();
  if (!token) throw new Error('No valid token');

  const res = await fetch(`${SPOTIFY_API}/${endpoint}`, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    throw new Error(`Spotify API error: ${res.status} ${res.statusText}`);
  }

  return res.json();
}

export async function getUserProfile() {
  return fetchWebApi('me', 'GET');
}

export async function getTopTracks(timeRange: 'short_term' | 'medium_term' | 'long_term', limit = 50) {
  return fetchWebApi(`me/top/tracks?time_range=${timeRange}&limit=${limit}`, 'GET');
}

export async function getTopArtists(timeRange: 'short_term' | 'medium_term' | 'long_term', limit = 50) {
  return fetchWebApi(`me/top/artists?time_range=${timeRange}&limit=${limit}`, 'GET');
}

export async function getRecentlyPlayed(limit = 50) {
  return fetchWebApi(`me/player/recently-played?limit=${limit}`, 'GET');
}

export async function getAudioFeatures(trackIds: string[]) {
  // Spotify limits to 100 track IDs per request
  const batches = [];
  for (let i = 0; i < trackIds.length; i += 100) {
    batches.push(trackIds.slice(i, i + 100));
  }

  let allFeatures: any[] = [];
  for (const batch of batches) {
    const data = await fetchWebApi(`audio-features?ids=${batch.join(',')}`, 'GET');
    allFeatures = allFeatures.concat(data.audio_features);
  }

  // Filter out nulls in case some tracks don't have features
  return allFeatures.filter(f => f !== null);
}

export async function fetchAllUserData() {
  const [
    profile,
    shortTracks, mediumTracks, longTracks,
    shortArtists, mediumArtists, longArtists,
    recent
  ] = await Promise.all([
    getUserProfile(),
    getTopTracks('short_term'), getTopTracks('medium_term'), getTopTracks('long_term'),
    getTopArtists('short_term'), getTopArtists('medium_term'), getTopArtists('long_term'),
    getRecentlyPlayed()
  ]);

  // Extract track IDs from all tracks
  const allTrackIds = new Set([
    ...shortTracks.items.map((t: any) => t.id),
    ...mediumTracks.items.map((t: any) => t.id),
    ...longTracks.items.map((t: any) => t.id),
    ...recent.items.map((r: any) => r.track.id)
  ]);

  const audioFeatures = await getAudioFeatures(Array.from(allTrackIds));

  return {
    profile,
    tracks: {
      short: shortTracks.items,
      medium: mediumTracks.items,
      long: longTracks.items,
    },
    artists: {
      short: shortArtists.items,
      medium: mediumArtists.items,
      long: longArtists.items,
    },
    recent: recent.items,
    audioFeatures
  };
}