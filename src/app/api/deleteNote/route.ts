// app/api/deleteNote/route.ts
import { db } from '@/lib/db';
import { $notes } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { noteId } = await req.json();

  try {
    await db
      .delete($notes)
      .where(eq($notes.id, Number(noteId))); 
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete note error:", error);
    return NextResponse.json({ success: false, error: String(error) });
  }
}
