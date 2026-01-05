// endpoint /api/createNoteBook

import { $notes } from "@/lib/db/schema";
import { generatePermanentImage } from "@/lib/openai";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  const session = await auth();
  const userId = session.userId;

  if (!userId) {
    return new NextResponse("unauthorised", { status: 401 });
  }

  const body = await req.json();
  const { name } = body;

  if (!name) {
    return new NextResponse("Missing notebook name", { status: 400 });
  }

  // Generate PERMANENT image URL
  const imageUrl = await generatePermanentImage(name);

  const notes_ids = await db
    .insert($notes)
    .values({
      name,
      userId,
      imageUrl, // permanent Cloudinary URL
    })
    .returning({ insertId: $notes.id });

  return NextResponse.json({
    note_id: notes_ids[0].insertId,
  });
}
