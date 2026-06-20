import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const NEXT_PUBLIC_APP_URL = process.env.NEXT_PUBLIC_APP_URL;

const generateRandomString = (length: number) => {
  let text = '';
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

export async function GET() {
  if (!SPOTIFY_CLIENT_ID || !NEXT_PUBLIC_APP_URL) {
    return NextResponse.json({ error: 'Missing environment variables' }, { status: 500 });
  }

  const state = generateRandomString(16);
  const cookieStore = await cookies();
  cookieStore.set('spotify_auth_state', state, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 3600 // 1 hour
  });

  const scope = [
    'user-top-read',
    'user-read-recently-played',
    'user-read-playback-state'
  ].join(' ');

  const redirectUri = `${NEXT_PUBLIC_APP_URL}/api/auth/callback`;

  const queryParams = new URLSearchParams({
    response_type: 'code',
    client_id: SPOTIFY_CLIENT_ID,
    scope: scope,
    redirect_uri: redirectUri,
    state: state,
    show_dialog: 'true',
  });

  const authorizeUrl = `https://accounts.spotify.com/authorize?${queryParams.toString()}`;

  return NextResponse.redirect(authorizeUrl);
}
