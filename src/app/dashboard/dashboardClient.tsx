'use client';

import React from 'react';
import Link from "next/link";
import { Button } from '@/src/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { UserButton } from '@clerk/clerk-react';
import { Separator } from '@radix-ui/react-separator';
import CreateNoteDialog from '@/src/components/CreateNoteDialog';

type Note = {
  id: string;
  name: string;
  imageUrl?: string | null;
  createdAt?: string;
};

export default function DashboardClient({ notes }: { notes: Note[] }) {
  return (
    <div className="grainy min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6 md:p-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button className='bg-green-600 hover:bg-green-700'>
                <ArrowLeft className='mr-2 w-4 h-4' />
                Back
              </Button>
            </Link>
            <h1 className='text-3xl font-bold text-gray-900'>My Notes</h1>
          </div>
          <UserButton />
        </div>

        <div className='my-6'>
          <Separator />
        </div>

        {/* No notes */}
        {notes.length === 0 ? (
          <div className='text-center py-20'>
            <h2 className='text-xl text-gray-500'>You have no notes yet.</h2>
          </div>
        ) : (
          <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6'>
            <CreateNoteDialog />
            {notes.map(note => (
              <a href={`/notebook/${note.id}`} key={note.id}>
                <div className='border border-stone-200 rounded-xl overflow-hidden flex flex-col hover:shadow-lg transition hover:-translate-y-1 duration-200 bg-white'>
                  <img
                    className="w-full h-48 object-cover"
                    alt={note.name}
                    src={note.imageUrl || "/placeholder.png"}
                  />
                  <div className='p-4 flex flex-col gap-2'>
                    <h3 className='text-lg font-semibold text-gray-900 truncate'>{note.name}</h3>
                    <p className="text-sm text-gray-500">
                      {note.createdAt ? note.createdAt.slice(0, 10) : ''}
                    </p>
                  </div>
                </div>
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
