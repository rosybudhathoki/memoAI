'use client';

import React from 'react';
import Link from "next/link";
import { Button } from '@/src/components/ui/button';
import { ArrowLeft, Plus, Loader2 } from 'lucide-react';
import { UserButton } from '@clerk/clerk-react';
import { Separator } from '@radix-ui/react-separator';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/src/components/ui/dialog';
import { CreateNoteDialog } from '@/src/components/CreateNoteDialog'; // only the form

type Note = {
  id: string;
  name: string;
  imageUrl?: string | null;
  createdAt?: string;
};

const toTitleCase = (str: string) =>
  str.replace(/\w\S*/g, (txt) =>
    txt.charAt(0).toUpperCase() + txt.slice(1).toLowerCase()
  );

export default function DashboardClient({ notes }: { notes: Note[] }) {
  return (
    <div className="grainy min-h-screen w-full flex flex-col p-6 md:p-10">
  <div className="w-full max-w-5xl mx-auto flex flex-col gap-6">

    {/* Header */}
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      <div className="flex items-center gap-4">
        <Link href="/">
          <Button className="bg-green-600 hover:bg-green-700 flex items-center gap-1">
            <ArrowLeft className="w-4 h-4" /> Back
          </Button>
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">My Notes</h1>
      </div>
      <UserButton />
    </div>

    <Separator />

    {/* Notes Grid */}
    {notes.length === 0 ? (
      <div className="text-center py-20">
        <h2 className="text-xl text-gray-300">You have no notes yet.</h2>
      </div>
    ) : (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">

        {/* New Notebook card */}
        <Dialog>
          <DialogTrigger asChild>
            <div className="border-dashed border-2 flex border-green-600 rounded-lg items-center justify-center sm:flex-col hover:shadow-xl transition hover:-translate-y-1 p-4 h-60">
              <Plus className="w-8 h-8 text-green-600" strokeWidth={3} />
              <h2 className="font-semibold text-green-600 mt-3 text-lg text-center">
                New Notebook
              </h2>
            </div>
          </DialogTrigger>

          <DialogContent className="sm:max-w-md w-full">
            <DialogHeader>
              <DialogTitle>New Notebook</DialogTitle>
              <DialogDescription>Enter a name for your new notebook.</DialogDescription>
            </DialogHeader>

            <CreateNoteDialog />
          </DialogContent>
        </Dialog>

        {/* Existing notebooks */}
        {notes.map(note => (
          <a href={`/notebook/${note.id}`} key={note.id}>
            <div className="border border-stone-200 rounded-xl overflow-hidden flex flex-col hover:shadow-lg hover:-translate-y-1 transition transform duration-200 bg-white h-60">
              <img
                className="w-full h-40 object-cover"
                alt={note.name}
                src={note.imageUrl || "/placeholder.png"}
              />
              <div className="p-4 flex flex-col gap-1 flex-1">
                <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                  {toTitleCase(note.name)}
                </h3>
                <p className="text-sm text-gray-500 mt-auto">
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
