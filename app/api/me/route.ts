import { NextResponse } from 'next/server';
import { laravelErrorMessage, laravelRequest } from '@/lib/laravel';

export async function GET() {
  try {
    const response = await laravelRequest<{
      id: number;
      name: string;
      email: string;
    }>('get', '/api/user', { auth: true });

    if (response.status >= 400) {
      return NextResponse.json(
        { message: laravelErrorMessage(response.data, 'Unauthorized') },
        { status: response.status }
      );
    }

    return NextResponse.json({
      name: response.data.name,
      email: response.data.email,
      id: response.data.id,
    });
  } catch (e) {
    const err = e as Error & { status?: number };
    if (err.status === 401) {
      return NextResponse.json({ message: 'Token cookie not found' }, { status: 401 });
    }
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
