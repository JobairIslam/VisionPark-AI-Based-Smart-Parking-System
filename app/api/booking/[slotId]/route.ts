import { NextResponse } from 'next/server';
import { laravelErrorMessage, laravelRequest } from '@/lib/laravel';

export async function POST(
  request: Request,
  { params }: { params: { slotId: string } }
) {
  try {
    const body = await request.json();
    const response = await laravelRequest('post', `/api/booking/${params.slotId}`, {
      auth: true,
      data: body,
    });

    if (response.status >= 400) {
      return NextResponse.json(
        { message: laravelErrorMessage(response.data, 'Failed to create booking') },
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
