import { NextResponse } from 'next/server';
import { laravelErrorMessage, laravelRequest } from '@/lib/laravel';

export async function GET() {
  try {
    const response = await laravelRequest<{ slots: unknown[] }>('get', '/api/parking-slots', {
      auth: true,
    });

    if (response.status >= 400) {
      return NextResponse.json(
        { message: laravelErrorMessage(response.data, 'Failed to load slots') },
        { status: response.status }
      );
    }

    return NextResponse.json(response.data);
  } catch (e) {
    const err = e as Error & { status?: number };
    if (err.status === 401) {
      return NextResponse.json({ message: 'Unauthenticated' }, { status: 401 });
    }
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
