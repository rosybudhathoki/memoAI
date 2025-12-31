'use client';
import React from 'react';
import { Button } from './ui/button';
import { Trash } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { useRouter } from 'next/navigation';

type Props = {
  noteId: string | number;
};

const DeleteButton = ({ noteId }: Props) => {
  const router = useRouter();

  const deleteNote = useMutation({
    mutationFn: async () => {
      const response = await axios.post('/api/deleteNote', { noteId });
      return response.data;
    },
    onSuccess: () => {
      // Refresh the current page after deletion instead of just push
      router.refresh(); 
      router.push('/dashboard'); // optional
    },
    onError: (err) => console.error(err),
  });

  return (
    <Button
      variant="destructive"
      size="sm"
      disabled={deleteNote.isPending}
      onClick={() => {
        const confirmDelete = window.confirm(
          "Are you sure you want to delete this note?"
        );
        if (!confirmDelete) return;
        deleteNote.mutate();
      }}
    >
      <Trash />
    </Button>
  );
};

export default DeleteButton;
