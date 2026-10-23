import { NextResponse } from 'next/server';
import { laravelRequest } from '@/lib/laravel';

export async function POST() {
  try {
    await laravelRequest('post', '/api/logout', { auth: true });
  } catch {
    // Clear cookie even if Laravel logout fails
  }

  const res = NextResponse.json({ message: 'Logged out successfully' });
  res.cookies.set('auth_token', '', {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  });
  return res;
}
