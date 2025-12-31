"use client";

import { Dialog, DialogTrigger } from '@radix-ui/react-dialog';
import React from 'react';
import { Plus, Loader2 } from "lucide-react";
import { DialogHeader, DialogContent, DialogTitle, DialogDescription } from './ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from './ui/button';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { useRouter } from 'next/navigation';

const CreateNoteDialog = () => {
  const router = useRouter();
  const [input, setInput] = React.useState('');

  const CreateNoteBook = useMutation({
    mutationFn: async () => {
      const response = await axios.post('/api/createNoteBook', { name: input });
      return response.data;
    }
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim()) {
      window.alert("Please enter a name for your notebook");
      return;
    }

    CreateNoteBook.mutate(undefined, {
      onSuccess: (data) => {
        const noteId = data?.note_id;
        if (typeof noteId !== "number") {
          console.error("Invalid note_id returned:", data);
          window.alert("Failed to create notebook.");
          return;
        }
        router.push(`/notebook/${noteId}`);
      },
      onError: (error) => {
        console.error("Error creating notebook:", error);
        window.alert("Failed to create new notebook.");
      },
    });
  };

  return (
    <Dialog>
      <DialogTrigger>
        {/* Centered box with dashed border */}
        <div className=" h-68 border-2 border-dashed border-green-600 rounded-xl flex flex-col items-center justify-center hover:shadow-xl transition hover:-translate-y-1 duration-200 cursor-pointer p-6 w-full aspect-[2/1]">
          <Plus className="w-8 h-8 text-green-600" strokeWidth={3} />
          <h2 className="font-semibold text-green-600 mt-3 text-lg text-center">
            New Notebook
          </h2>
        </div>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>New Notebook</DialogTitle>
          <DialogDescription>
            Enter a name to create a new notebook.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input value={input} onChange={e => setInput(e.target.value)} placeholder="Name..." />
          <div className="flex justify-end gap-2">
            <Button type="reset" variant="secondary">Cancel</Button>
            <Button type="submit" className="bg-green-600" disabled={CreateNoteBook.isPending || !input.trim()}>
              {CreateNoteBook.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Create
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateNoteDialog;
