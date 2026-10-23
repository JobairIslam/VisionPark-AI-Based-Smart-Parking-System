import { NextResponse } from 'next/server';
import { laravelErrorMessage, laravelRequest } from '@/lib/laravel';

export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const response = await laravelRequest('delete', `/api/vehicle/${params.id}`, {
      auth: true,
    });

    if (response.status >= 400) {
      return NextResponse.json(
        { message: laravelErrorMessage(response.data, 'Failed to delete vehicle') },
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
