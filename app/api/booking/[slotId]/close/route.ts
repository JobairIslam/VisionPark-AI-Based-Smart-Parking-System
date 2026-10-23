import { NextResponse } from 'next/server';
import { laravelErrorMessage, laravelRequest } from '@/lib/laravel';

export async function POST(
  _request: Request,
  { params }: { params: { slotId: string } }
) {
  try {
    const response = await laravelRequest('post', `/api/booking/${params.slotId}/close`, {
      auth: true,
    });

    if (response.status >= 400) {
      return NextResponse.json(
        { message: laravelErrorMessage(response.data, 'Failed to close booking') },
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
