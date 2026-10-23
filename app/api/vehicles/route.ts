import { NextResponse } from 'next/server';
import { laravelErrorMessage, laravelRequest } from '@/lib/laravel';

export async function GET() {
  try {
    const response = await laravelRequest<{ vehicles: unknown[] }>('get', '/api/vehicles', {
      auth: true,
    });

    if (response.status >= 400) {
      return NextResponse.json(
        { message: laravelErrorMessage(response.data, 'Failed to load vehicles') },
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

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const response = await laravelRequest('post', '/api/vehicle', {
      auth: true,
      data: body,
    });

    if (response.status >= 400) {
      return NextResponse.json(
        { message: laravelErrorMessage(response.data, 'Failed to create vehicle') },
        { status: response.status }
      );
    }

    return NextResponse.json(response.data, { status: response.status });
  } catch (e) {
    const err = e as Error & { status?: number };
    if (err.status === 401) {
      return NextResponse.json({ message: 'Unauthenticated' }, { status: 401 });
    }
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
