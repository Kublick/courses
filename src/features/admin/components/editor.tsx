"use client";

import { useEditor, EditorContent, Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align";
import OrderedList from "@tiptap/extension-ordered-list";
import Blockquote from "@tiptap/extension-blockquote";
import BulletList from "@tiptap/extension-bullet-list";

import {
  AlignCenter,
  AlignJustify,
  AlignLeft,
  AlignRight,
  Bold,
  Heading1,
  Heading2,
  Heading3,
  Italic,
  List,
  ListOrdered,
  Quote,
} from "lucide-react";
import { useEffect, useState } from "react";

interface MenuBarProps {
  editor: Editor | null;
}

const MenuBar: React.FC<MenuBarProps> = ({ editor }) => {
  if (!editor) return null;

  return (
    <div className="flex flex-wrap gap-2 p-2 bg-gray-50 rounded-t-lg border border-gray-200">
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={`px-3 py-1.5 text-sm font-medium rounded hover:bg-gray-100 transition-colors ${
          editor.isActive("heading", { level: 1 })
            ? "bg-blue-100 text-blue-600"
            : "bg-white text-gray-700"
        }`}
        type="button"
      >
        <Heading1 size={20} className="text-gray-700" />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={`px-3 py-1.5 text-sm font-medium rounded hover:bg-gray-100 transition-colors ${
          editor.isActive("heading", { level: 2 })
            ? "bg-blue-100 text-blue-600"
            : "bg-white text-gray-700"
        }`}
        type="button"
      >
        <Heading2 size={20} className="text-gray-700" />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        className={`px-3 py-1.5 text-sm font-medium rounded hover:bg-gray-100 transition-colors ${
          editor.isActive("heading", { level: 3 })
            ? "bg-blue-100 text-blue-600"
            : "bg-white text-gray-700"
        }`}
        type="button"
      >
        <Heading3 size={20} className="text-gray-700" />
      </button>

      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={`px-3 py-1.5 text-sm font-medium rounded hover:bg-gray-100 transition-colors ${
          editor.isActive("bold")
            ? "bg-blue-100 text-blue-600"
            : "bg-white text-gray-700"
        }`}
        type="button"
      >
        <Bold size={20} className="text-gray-700" />
      </button>

      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={`px-3 py-1.5 text-sm font-medium rounded hover:bg-gray-100 transition-colors ${
          editor.isActive("italic")
            ? "bg-blue-100 text-blue-600"
            : "bg-white text-gray-700"
        }`}
        type="button"
      >
        <Italic size={20} className="text-gray-700" />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={`px-3 py-1.5 text-sm font-medium rounded hover:bg-gray-100 transition-colors ${
          editor.isActive("orderedList")
            ? "bg-blue-100 text-blue-600"
            : "bg-white text-gray-700"
        }`}
        type="button"
      >
        <ListOrdered size={20} className="text-gray-700" />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={`px-3 py-1.5 text-sm font-medium rounded hover:bg-gray-100 transition-colors ${
          editor.isActive("bulletList")
            ? "bg-blue-100 text-blue-600"
            : "bg-white text-gray-700"
        }`}
        type="button"
      >
        <List size={20} className="text-gray-700" />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={`px-3 py-1.5 text-sm font-medium rounded hover:bg-gray-100 transition-colors ${
          editor.isActive("blockquote")
            ? "bg-blue-100 text-blue-600"
            : "bg-white text-gray-700"
        }`}
        type="button"
      >
        <Quote size={20} className="text-gray-700" />
      </button>
      {/* Align Left */}
      <button
        onClick={() => editor.chain().focus().setTextAlign("left").run()}
        className={`px-3 py-1.5 text-sm font-medium rounded hover:bg-gray-100 transition-colors ${
          editor.isActive({ textAlign: "left" })
            ? "bg-blue-100 text-blue-600"
            : "bg-white text-gray-700"
        }`}
        type="button"
      >
        <AlignLeft size={20} className="text-gray-700" />
      </button>

      {/* Align Center */}
      <button
        onClick={() => editor.chain().focus().setTextAlign("center").run()}
        className={`px-3 py-1.5 text-sm font-medium rounded hover:bg-gray-100 transition-colors ${
          editor.isActive({ textAlign: "center" })
            ? "bg-blue-100 text-blue-600"
            : "bg-white text-gray-700"
        }`}
        type="button"
      >
        <AlignCenter size={20} className="text-gray-700" />
      </button>

      {/* Align Right */}
      <button
        onClick={() => editor.chain().focus().setTextAlign("right").run()}
        className={`px-3 py-1.5 text-sm font-medium rounded hover:bg-gray-100 transition-colors ${
          editor.isActive({ textAlign: "right" })
            ? "bg-blue-100 text-blue-600"
            : "bg-white text-gray-700"
        }`}
        type="button"
      >
        <AlignRight size={20} className="text-gray-700" />
      </button>

      {/* Justify */}
      <button
        onClick={() => editor.chain().focus().setTextAlign("justify").run()}
        className={`px-3 py-1.5 text-sm font-medium rounded hover:bg-gray-100 transition-colors ${
          editor.isActive({ textAlign: "justify" })
            ? "bg-blue-100 text-blue-600"
            : "bg-white text-gray-700"
        }`}
        type="button"
      >
        <AlignJustify size={20} className="text-gray-700" />
      </button>
    </div>
  );
};

interface EditorProps {
  value?: string | null;
  onChange?: (html: string) => void;
}

const TipTapEditor: React.FC<EditorProps> = ({ onChange, value }) => {
  const [isMounted, setIsMounted] = useState(false);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        bulletList: false,
        orderedList: false,
        blockquote: false,
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      OrderedList,
      Blockquote,
      BulletList,
    ],
    content: value || "",
    onUpdate: ({ editor }) => {
      const updatedContent = editor.getHTML();
      onChange && onChange(updatedContent);
    },
    editorProps: {
      attributes: {
        class:
          "prose prose-sm sm:prose lg:prose-lg xl:prose-xl max-w-none focus:outline-none",
      },
    },
  });

  // Handle content updates when value prop changes
  useEffect(() => {
    if (editor && value !== undefined && value !== editor.getHTML()) {
      editor.commands.setContent(value || "", false);
    }
  }, [value, editor]);

  // Handle hydration
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <div className="w-full border rounded-lg overflow-hidden">
      <MenuBar editor={editor} />
      <div className="px-4 py-3">
        <style jsx global>{`
          .ProseMirror h1 {
            font-size: 2em;
            font-weight: bold;
            margin: 1em 0;
            color: #374151;
          }

          .ProseMirror h2 {
            font-size: 1.5em;
            font-weight: bold;
            margin: 0.83em 0;
            color: #374151;
          }

          .ProseMirror h3 {
            font-size: 1.17em;
            font-weight: bold;
            margin: 0.67em 0;
            color: #374151;
          }

          .ProseMirror p {
            margin: 1em 0;
            line-height: 1.6;
          }

          .ProseMirror > * + * {
            margin-top: 0.75em;
          }

          .ProseMirror {
            min-height: 150px;
            padding: 0.5em;
          }
          .ProseMirror ol {
            list-style-type: decimal;
            margin-left: 1.5em;
          }

          .ProseMirror ul {
            list-style-type: disc;
            margin-left: 1.5em;
          }

          .ProseMirror blockquote {
            border-left: 4px solid #ddd;
            margin-left: 1em;
            padding-left: 1em;
            color: #555;
            font-style: italic;
          }
        `}</style>

        {editor && <EditorContent editor={editor} />}
      </div>
    </div>
  );
};

export default TipTapEditor;
