"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Check, Copy } from "lucide-react";
import styles from "./AskAiButton.module.css";

const question =
  "What is MYResearchGuide? Use https://myresearchguide.org/ and https://myssp.myresearchguide.org/ to explain what MYResearchGuide does, who it is for, and how I can get started with its free resources. Also explain the Malaysia Science Scholar's Programme (MYSSP) and link to its programme details and resources. Include links to the relevant pages.";

export default function AskAiButton() {
  const [status, setStatus] = useState<
    "idle" | "copying" | "copied" | "manual"
  >("idle");
  const resetTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (resetTimer.current) clearTimeout(resetTimer.current);
    },
    [],
  );

  async function copyQuestion() {
    if (resetTimer.current) clearTimeout(resetTimer.current);
    setStatus("copying");
    try {
      await navigator.clipboard.writeText(question);
      setStatus("copied");
      resetTimer.current = setTimeout(() => setStatus("idle"), 4000);
    } catch {
      setStatus("manual");
    }
  }

  return (
    <div className={styles.wrapper}>
      <button
        type="button"
        className={styles.button}
        onClick={copyQuestion}
        disabled={status === "copying"}
        aria-label="Ask your AI agent what is MYResearchGuide. Copy question"
        aria-describedby="ask-ai-status"
        title="Copy a question to paste into ChatGPT, Claude or Gemini"
      >
        {status === "copied" ? (
          <Check className={styles.copyIcon} size={15} aria-hidden="true" />
        ) : (
          <Copy className={styles.copyIcon} size={15} aria-hidden="true" />
        )}
        <span className={styles.label}>
          Ask your AI agent what is MYResearchGuide
        </span>
        <span className={styles.brands} aria-hidden="true">
          <Image src="/brands/openai.svg" alt="" width={18} height={18} />
          <Image src="/brands/claude-color.svg" alt="" width={19} height={19} />
          <Image src="/brands/gemini-color.svg" alt="" width={20} height={20} />
        </span>
      </button>
      <p
        id="ask-ai-status"
        className={styles.status}
        role="status"
        aria-live="polite"
      >
        {status === "copied"
          ? "Question copied. Paste it into ChatGPT, Claude or Gemini."
          : status === "manual"
            ? "Copy the question below into your AI chat."
            : ""}
      </p>
      {status === "manual" && (
        <textarea
          className={styles.manualCopy}
          aria-label="Question to copy into your AI chat"
          value={question}
          readOnly
          rows={4}
          onFocus={(event) => event.currentTarget.select()}
          ref={(element) => element?.focus()}
        />
      )}
    </div>
  );
}
