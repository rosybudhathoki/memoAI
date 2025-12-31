"use client";
import React from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import { StarterKit } from "@tiptap/starter-kit";
import TipTapMenuBar from "./TipTapMenuBar";
import { Button } from "./ui/button";
import { useDebounce } from "@/lib/useDebounce";
import { useMutation } from "@tanstack/react-query";
import Text from "@tiptap/extension-text";
import axios from "axios";
import { useCompletion } from "@ai-sdk/react";

type Props = {
  note: {
    id: string;
    name: string;
    editorState: string;
  };
};

const TipTapEditor = ({ note }: Props) => {
  const [editorState, setEditorState] = React.useState(
    note.editorState || `<h1>${note.name}</h1>`
  );

  // ⭐ useCompletion works perfectly with plain text responses
  const { complete, completion } = useCompletion({
    api: "/api/completion",
});

console.log("🔥 HOOK INITIAL STATE:", completion);
console.log("🔥 COMPONENT INSTANCE:", Math.random());

  const saveNote = useMutation({
    mutationFn: async () => {
      const response = await axios.post("/api/saveNote", {
        noteId: note.id,
        editorState,
      });
      return response.data;
    },
  });

  // ⭐ Custom Tab shortcut
  const customText = Text.extend({
    addKeyboardShortcuts() {
      return {
        "Tab": () => {
          console.log("Tab selected");
          const prompt = this.editor.getText().split(" ").slice(-30).join(" ");
          console.log("CLIENT PROMPT:", prompt);
          complete(prompt); 
          return true;  
        },
      };
    },
  });

  const editor = useEditor({
    autofocus: true,
    extensions: [StarterKit, customText],
    content: editorState,
    onUpdate: ({ editor }) => {
      setEditorState(editor.getHTML());
    },
     immediatelyRender: false,
  });

  // ⭐ Insert completion when it arrives
  const lastCompletion = React.useRef("");

React.useEffect(() => {
  if (!completion || !editor) return;

  const diff = completion;
  editor.chain().focus().insertContent(diff).run();

}, [completion, editor]);


  // ⭐ Save note
  const debouncedEditorState = useDebounce(editorState, 500);

  React.useEffect(() => {
    if (!debouncedEditorState) return;

    saveNote.mutate(undefined, {
      onSuccess: (data) => console.log("Saved!", data),
      onError: (err) => console.error(err),
    });
  }, [debouncedEditorState]);

  return (
    <>
      <div className="flex">
        {editor && <TipTapMenuBar editor={editor} />}
        <Button disabled variant="outline">
          {saveNote.isPending ? "Saving..." : "Saved"}
        </Button>
      </div>

      <div className="prose prose-sm w-full mt-4">
        <EditorContent editor={editor} />
      </div>

      <div className="h-4"></div>
      <span className="text-sm">
        Tip: Press{" "}
        <kbd className="px-2 py-1.5 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-lg">
          Shift + A
        </kbd>{" "}
        for AI autocomplete
      </span>
    </>
  );
};

export default TipTapEditor;
