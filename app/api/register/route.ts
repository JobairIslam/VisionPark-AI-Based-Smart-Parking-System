import { NextResponse } from 'next/server';
import { laravelErrorMessage, laravelRequest } from '@/lib/laravel';

export async function POST(request: Request) {
  const { name, email, password, password_confirmation } = await request.json();

  if (!name || !email || !password || !password_confirmation) {
    return NextResponse.json({ message: 'Fill up all the fields' }, { status: 400 });
  }

  try {
    const signup = await laravelRequest<{
      token: string;
      user: unknown;
      message?: string;
      errors?: Record<string, string[]>;
    }>('post', '/api/signup', {
      data: { name, email, password, password_confirmation },
    });

    if (signup.status >= 400) {
      const data = signup.data as { message?: string; errors?: Record<string, string[]> };
      return NextResponse.json(
        {
          message: laravelErrorMessage(signup.data, 'Registration failed'),
          errors: data?.errors,
        },
        { status: signup.status }
      );
    }

    const res = NextResponse.json({ user: signup.data.user }, { status: 201 });
    res.cookies.set('auth_token', signup.data.token, {
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
    });
    return res;
  } catch {
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
