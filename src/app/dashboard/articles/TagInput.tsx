"use client";

import { useState } from "react";
import { X } from "lucide-react";

const MAX_TAGS = 6;

export default function TagInput({
  tags,
  onChange,
}: {
  tags: string[];
  onChange: (tags: string[]) => void;
}) {
  const [input, setInput] = useState("");

  function commit(raw: string) {
    const value = raw.trim();
    if (!value) return;
    if (tags.includes(value)) {
      setInput("");
      return;
    }
    if (tags.length >= MAX_TAGS) return;
    onChange([...tags, value]);
    setInput("");
  }

  function remove(tag: string) {
    onChange(tags.filter((t) => t !== tag));
  }

  return (
    <div className="!flex !flex-wrap !items-center !gap-2">
      {tags.map((tag) => (
        <span
          key={tag}
          className="!inline-flex !items-center !gap-1.5 !rounded-full !border !border-zinc-700 !px-3 !py-1 !text-xs !text-zinc-300"
        >
          {tag}
          <button
            type="button"
            aria-label={`Remove ${tag}`}
            onClick={() => remove(tag)}
            className="!text-zinc-500 hover:!text-white !transition-colors !cursor-pointer"
          >
            <X size={12} />
          </button>
        </span>
      ))}
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === ",") {
            e.preventDefault();
            commit(input);
          } else if (e.key === "Backspace" && input === "" && tags.length > 0) {
            remove(tags[tags.length - 1]);
          }
        }}
        onBlur={() => commit(input)}
        placeholder="Add a tag…"
        className="!flex-1 !min-w-[120px] !bg-transparent !outline-none !text-sm !text-zinc-300 !placeholder-zinc-600"
      />
      {tags.length >= MAX_TAGS ? (
        <p className="!w-full !text-xs !text-zinc-600">Max {MAX_TAGS} tags</p>
      ) : null}
    </div>
  );
}
