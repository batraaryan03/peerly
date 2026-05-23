import { turso } from '@/lib/turso';
import { NextRequest, NextResponse } from 'next/server';

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    await turso.execute({
      sql: 'DELETE FROM time_slots WHERE id = ?',
      args: [id],
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting time slot:', error);
    return NextResponse.json({ error: 'Failed to delete' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();

    await turso.execute({
      sql: 'UPDATE time_slots SET status = ? WHERE id = ?',
      args: [body.status, id],
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating time slot:', error);
    return NextResponse.json({ error: 'Failed to update' }, { status: 500 });
  }
}