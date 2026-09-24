"use client";

import { useState } from "react";
import { useEditor, useEditorState, EditorContent, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import Image from "@tiptap/extension-image";
import { Markdown } from "@tiptap/markdown";
import { createClient } from "@/lib/supabase/client";
import { motion } from "framer-motion";
import {
  Bold,
  Italic,
  Strikethrough,
  Code,
  Link2,
  Heading2,
  Quote,
  List,
  ListOrdered,
  Image as ImageIcon,
  Upload,
} from "lucide-react";

const toolClass = (active: boolean) =>
  `!rounded-lg !p-2.5 !transition-colors !cursor-pointer disabled:!opacity-40 ${
    active ? "!bg-zinc-800 !text-white" : "!text-zinc-300 hover:!text-white hover:!bg-zinc-800"
  }`;

// Formatting toolbar driving the TipTap editor directly (Substack-style
// WYSIWYG: formatting applies visually, no markdown visible while writing).
export default function EditorToolbar({ editor }: { editor: Editor | null }) {
  const rawState = useEditorState({
    editor,
    selector: ({ editor: e }) => ({
      bold: e?.isActive("bold") ?? false,
      italic: e?.isActive("italic") ?? false,
      strike: e?.isActive("strike") ?? false,
      code: e?.isActive("code") ?? false,
      link: e?.isActive("link") ?? false,
      heading: e?.isActive("heading", { level: 2 }) ?? false,
      bullet: e?.isActive("bulletList") ?? false,
      ordered: e?.isActive("orderedList") ?? false,
      blockquote: e?.isActive("blockquote") ?? false,
    }),
  });
  const state = rawState ?? {
    bold: false,
    italic: false,
    strike: false,
    code: false,
    link: false,
    heading: false,
    bullet: false,
    ordered: false,
    blockquote: false,
  };

  if (!editor) return <div className="!h-10" />;
  const ed = editor;

  function linkPrompt() {
    if (ed.isActive("link")) {
      ed.chain().focus().unsetLink().run();
      return;
    }
    const url = window.prompt("Link URL:");
    if (!url) return;
    if (ed.state.selection.empty) {
      ed.chain().focus().insertContent(`[${url}](${url})`).run();
    } else {
      ed.chain().focus().setLink({ href: url }).run();
    }
  }

  function imagePrompt() {
    const url = window.prompt("Image URL:");
    if (url) ed.chain().focus().insertContent(`![image](${url})`).run();
  }

  const btn = (title: string, active: boolean, onClick: () => void, icon: React.ReactNode) => (
    <button
      type="button"
      title={title}
      aria-label={title}
      aria-pressed={active}
      onMouseDown={(e) => e.preventDefault()} // keep editor focus
      onClick={onClick}
      className={toolClass(active)}
    >
      {icon}
    </button>
  );

  return (
    <div className="!flex !items-center !gap-1 !flex-wrap !rounded-xl !border !border-zinc-800 !bg-zinc-900/60 !px-2 !py-1.5">
      {btn("Bold", state.bold, () => ed.chain().focus().toggleBold().run(), <Bold size={16} />)}
      {btn("Italic", state.italic, () => editor.chain().focus().toggleItalic().run(), <Italic size={16} />)}
      {btn("Strikethrough", state.strike, () => editor.chain().focus().toggleStrike().run(), <Strikethrough size={16} />)}
      {btn("Code", state.code, () => editor.chain().focus().toggleCode().run(), <Code size={16} />)}
      {btn("Link", state.link, linkPrompt, <Link2 size={16} />)}
      {btn("Heading", state.heading, () => editor.chain().focus().toggleHeading({ level: 2 }).run(), <Heading2 size={16} />)}
      {btn("Quote", state.blockquote, () => editor.chain().focus().toggleBlockquote().run(), <Quote size={16} />)}
      {btn("Bullet list", state.bullet, () => editor.chain().focus().toggleBulletList().run(), <List size={16} />)}
      {btn("Numbered list", state.ordered, () => editor.chain().focus().toggleOrderedList().run(), <ListOrdered size={16} />)}
      {btn("Image", false, imagePrompt, <ImageIcon size={16} />)}
    </div>
  );
}

// WYSIWYG body: TipTap canvas + hidden raw-markdown source mode (safety net).
// body_md stays the single source of truth; the Markdown extension serializes
// the editor back to markdown (and parses markdown into the editor on load).
// Images: drag-drop or paste an image into the canvas to upload it to the
// article-covers bucket and insert it at the cursor.
export function RichBody({
  initialMarkdown,
  onChange,
}: {
  initialMarkdown: string;
  onChange: (markdown: string) => void;
}) {
  const [uploading, setUploading] = useState(false);
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Link.configure({ openOnClick: false }),
      Placeholder.configure({ placeholder: "Start writing…" }),
      Image,
      Markdown,
    ],
    content: initialMarkdown,
    contentType: "markdown",
    onUpdate: ({ editor: e }) => onChange(e.getMarkdown()),
  });

  async function uploadImages(files: File[]) {
    const images = files.filter((f) => f.type.startsWith("image/"));
    if (images.length === 0 || !editor) return false;

    setUploading(true);
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      setUploading(false);
      return false;
    }

    for (const file of images) {
      const dot = file.name.lastIndexOf(".");
      const ext = dot === -1 ? "" : file.name.slice(dot).toLowerCase();
      const path = `${user.id}/${crypto.randomUUID()}${ext}`;
      const { error } = await supabase.storage
        .from("article-covers")
        .upload(path, file);
      if (error) continue;
      const { data } = supabase.storage
        .from("article-covers")
        .getPublicUrl(path);
      editor.chain().focus().setImage({ src: data.publicUrl, alt: file.name }).run();
    }
    setUploading(false);
    return true;
  }

  async function onDrop(e: React.DragEvent) {
    if (e.dataTransfer?.files?.length) {
      e.preventDefault();
      e.stopPropagation();
      await uploadImages(Array.from(e.dataTransfer.files));
    }
  }

  async function onPaste(e: React.ClipboardEvent) {
    if (e.clipboardData?.files?.length) {
      e.preventDefault();
      await uploadImages(Array.from(e.clipboardData.files));
    }
  }

  return (
    <div
      onDrop={onDrop}
      onPaste={onPaste}
      className="!mt-6 !font-[Georgia,_'Times_New_Roman',_serif] !text-lg !leading-relaxed !text-zinc-200 [&_.tiptap]:!outline-none [&_.tiptap]:!min-h-[52vh] [&_.tiptap]:!mt-6 [&_p]:!my-3 [&_h1]:!text-3xl [&_h1]:!font-bold [&_h2]:!text-2xl [&_h2]:!font-bold [&_h3]:!text-xl [&_h3]:!font-semibold [&_a]:!underline [&_a]:!underline-offset-4 [&_ul]:!list-disc [&_ul]:!pl-6 [&_ol]:!list-decimal [&_ol]:!pl-6 [&_blockquote]:!border-l-2 [&_blockquote]:!border-zinc-700 [&_blockquote]:!pl-4 [&_blockquote]:!italic [&_blockquote]:!text-zinc-400 [&_pre]:!bg-zinc-900 [&_pre]:!rounded-lg [&_pre]:!p-3 [&_pre]:!font-mono [&_pre]:!text-sm [&_code]:!bg-zinc-900 [&_code]:!rounded [&_code]:!px-1 [&_code]:!py-0.5 [&_code]:!font-mono [&_code]:!text-[0.9em] [&_img]:!max-w-full [&_img]:!rounded-xl [&_img]:!border [&_img]:!border-zinc-800 [&_img]:!my-4 [&_.tiptap_p.is-editor-empty:first-child::before]:!content-[attr(data-placeholder)] [&_.tiptap_p.is-editor-empty:first-child::before]:!text-zinc-600 [&_.tiptap_p.is-editor-empty:first-child::before]:!float-left [&_.tiptap_p.is-editor-empty:first-child::before]:!pointer-events-none">
      {uploading ? (
        <div className="!flex !items-center !gap-2 !mb-3 !text-xs !text-zinc-400">
          <motion.span
            className="!inline-block !h-1.5 !w-1.5 !rounded-full !bg-zinc-400"
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
          />
          Uploading image…
        </div>
      ) : null}
      <EditorToolbar editor={editor} />
      <EditorContent editor={editor} />
      <p className="!mt-3 !text-xs !text-zinc-600">
        Drag &amp; drop or paste images to attach them.
      </p>
    </div>
  );
}
