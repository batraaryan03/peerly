import { getTurso } from '@/lib/turso';
import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const turso = getTurso();

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
    const turso = getTurso();

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