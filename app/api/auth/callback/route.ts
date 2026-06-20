import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
const NEXT_PUBLIC_APP_URL = process.env.NEXT_PUBLIC_APP_URL;

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const code = searchParams.get('code');
  const error = searchParams.get('error');
  const state = searchParams.get('state');

  const cookieStore = await cookies();
  const storedState = cookieStore.get('spotify_auth_state')?.value;

  if (error) {
    return NextResponse.redirect(`${NEXT_PUBLIC_APP_URL}/?error=${error}`);
  }

  if (state === null || state !== storedState) {
    return NextResponse.redirect(`${NEXT_PUBLIC_APP_URL}/?error=state_mismatch`);
  }

  cookieStore.delete('spotify_auth_state');

  if (!code) {
    return NextResponse.redirect(`${NEXT_PUBLIC_APP_URL}/?error=no_code`);
  }

  const redirectUri = `${NEXT_PUBLIC_APP_URL}/api/auth/callback`;

  try {
    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${Buffer.from(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`).toString('base64')}`,
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: redirectUri,
      }),
    });

    const data = await response.json();

    if (data.error) {
      console.error('Spotify token error:', data);
      return NextResponse.redirect(`${NEXT_PUBLIC_APP_URL}/?error=${data.error}`);
    }

    // Set secure HTTP-only cookies instead of sending tokens to the client via URL
    cookieStore.set('spotify_access_token', data.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: data.expires_in,
    });

    cookieStore.set('spotify_refresh_token', data.refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60, // 30 days
    });

    return NextResponse.redirect(`${NEXT_PUBLIC_APP_URL}/analyzing`);

  } catch (err) {
    console.error('Auth error:', err);
    return NextResponse.redirect(`${NEXT_PUBLIC_APP_URL}/?error=auth_failed`);
  }
}
