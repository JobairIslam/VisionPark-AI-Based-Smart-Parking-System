import { NextResponse } from 'next/server';
import { laravelErrorMessage, laravelRequest } from '@/lib/laravel';

export async function POST(request: Request) {
  const { email, password } = await request.json();

  if (!email || !password) {
    return NextResponse.json(
      { message: 'Fill up the email and password' },
      { status: 400 }
    );
  }

  try {
    const response = await laravelRequest<{ token: string; user: unknown }>('post', '/api/signin', {
      data: { email, password },
    });

    if (response.status >= 400) {
      return NextResponse.json(
        { message: laravelErrorMessage(response.data, 'Login failed') },
        { status: response.status }
      );
    }

    const res = NextResponse.json({ user: response.data.user });
    res.cookies.set('auth_token', response.data.token, {
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
    });
    return res;
  } catch {
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
