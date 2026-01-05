'use client';

import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from './ui/button';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

export const CreateNoteDialog = () => {
  const router = useRouter();
  const [input, setInput] = React.useState('');

  const createNoteBook = useMutation({
    mutationFn: async () => {
      const response = await fetch('/api/createNoteBook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: input }),
      });
      return response.json();
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim()) {
      window.alert("Please enter a name for your notebook");
      return;
    }

    createNoteBook.mutate(undefined, {
      onSuccess: (data) => {
        const noteId = data?.note_id;
        if (!noteId) {
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
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Input
        value={input}
        onChange={e => setInput(e.target.value)}
        placeholder="Notebook name..."
      />
      <div className="flex justify-end gap-2">
        <Button type="reset" variant="secondary">Cancel</Button>
        <Button
          type="submit"
          className="bg-green-600"
          disabled={createNoteBook.isPending || !input.trim()}
        >
          {createNoteBook.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
          Create
        </Button>
      </div>
    </form>
  );
};

export default CreateNoteDialog;
