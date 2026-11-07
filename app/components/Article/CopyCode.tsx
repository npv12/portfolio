"use client";

import { useEffect, useRef, useState } from "react";
import { PiCheckBold, PiCopyBold } from "react-icons/pi";

export default function CopyCode() {
  const ref = useRef<HTMLButtonElement>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), 1800);
    return () => clearTimeout(timer);
  }, [copied]);

  const copy = async () => {
    const code = ref.current?.closest("figure")?.querySelector("pre")?.innerText;
    if (!code) return;
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  };

  return (
    <button
      ref={ref}
      type="button"
      className="code-block__copy"
      onClick={copy}
      data-copied={copied}
      aria-label={copied ? "Copied" : "Copy code"}
    >
      {copied ? <PiCheckBold aria-hidden="true" /> : <PiCopyBold aria-hidden="true" />}
      <span aria-live="polite">{copied ? "Copied" : "Copy"}</span>
    </button>
  );
}
