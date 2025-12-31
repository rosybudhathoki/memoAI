import DashboardClient from './dashboardClient';
import { db } from '@/lib/db';
import { $notes } from '@/lib/db/schema';
import { auth } from '@clerk/nextjs/server';
import { eq } from 'drizzle-orm';
import { redirect } from 'next/navigation';

export default async function DashboardPage() {
  const { userId } = await auth();
  if (!userId) redirect("/dashboard");

  const rawNotes = await db.select().from($notes).where(eq($notes.userId, userId));

  const notes = rawNotes.map(note => ({
    id: String(note.id),
    name: note.name,
    imageUrl: note.imageUrl || null,
    createdAt: note.createdAt ? new Date(note.createdAt).toISOString() : new Date().toISOString(),
  }));

  return <DashboardClient notes={notes} />;
}
