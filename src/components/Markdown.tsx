"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";

// Shared markdown renderer (articles body + editor preview). Isomorphic —
// safe on the server (article detail) and in the client (dashboard preview).
// Supports GFM (tables, task lists), math ($...$ / $$...$$) via KaTeX, and
// site-styled headings/lists/code.
export default function Markdown({ children }: { children: string }) {
  return (
    <div className="!text-zinc-300 !text-base !leading-relaxed !space-y-4 [&_p]:!my-4 [&_h1]:!text-3xl [&_h1]:!font-bold [&_h1]:!text-white [&_h1]:!mt-10 [&_h2]:!text-2xl [&_h2]:!font-bold [&_h2]:!text-white [&_h2]:!mt-8 [&_h3]:!text-xl [&_h3]:!font-semibold [&_h3]:!text-white [&_h3]:!mt-6 [&_a]:!text-white [&_a]:!underline [&_a]:!underline-offset-4 [&_strong]:!text-white [&_code]:!bg-zinc-950 [&_code]:!border [&_code]:!border-zinc-800 [&_code]:!rounded [&_code]:!px-1.5 [&_code]:!py-0.5 [&_code]:!text-[0.9em] [&_pre]:!bg-zinc-950 [&_pre]:!border [&_pre]:!border-zinc-800 [&_pre]:!rounded-xl [&_pre]:!p-4 [&_pre]:!overflow-x-auto [&_pre_code]:!bg-transparent [&_pre_code]:!border-0 [&_blockquote]:!border-l-2 [&_blockquote]:!border-zinc-700 [&_blockquote]:!pl-5 [&_blockquote]:!text-zinc-400 [&_blockquote]:!italic [&_ul]:!list-disc [&_ul]:!pl-6 [&_ol]:!list-decimal [&_ol]:!pl-6 [&_li]:!my-1 [&_table]:!w-full [&_table]:!text-sm [&_table]:!border-collapse [&_th]:!border [&_th]:!border-zinc-800 [&_th]:!px-3 [&_th]:!py-2 [&_th]:!text-white [&_th]:!text-left [&_td]:!border [&_td]:!border-zinc-800 [&_td]:!px-3 [&_td]:!py-2 [&_hr]:!border-zinc-800">
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[rehypeKatex]}
        components={{
          a: ({ node: _node, ...props }) => (
            <a {...props} target="_blank" rel="noopener noreferrer" />
          ),
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
}
