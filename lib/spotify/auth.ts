import { cookies } from 'next/headers';

export const getValidAccessToken = async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get('spotify_access_token')?.value;

  if (token) return token;

  const refreshToken = cookieStore.get('spotify_refresh_token')?.value;
  if (!refreshToken) return null;

  try {
      // In a server environment, we can fetch directly from the refresh endpoint
      // Or we can just redirect to login if we strictly need to avoid fetch loops here,
      // but assuming the client app redirects to /login on 401s
      return null;
  } catch (e) {
      return null;
  }
};
