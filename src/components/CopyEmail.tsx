"use client";

import { useEffect, useState } from "react";
import { PiCheckBold, PiCopyBold } from "react-icons/pi";

export default function CopyEmail({ email }: { email: string }) {
  const [state, setState] = useState<"idle" | "copied" | "failed">("idle");

  useEffect(() => {
    if (state === "idle") return;
    const timer = setTimeout(() => setState("idle"), 2000);
    return () => clearTimeout(timer);
  }, [state]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setState("copied");
    } catch {
      setState("failed");
    }
  };

  return (
    <button
      type="button"
      className="copy-button"
      onClick={copy}
      data-copied={state === "copied"}
    >
      {state === "copied" ? (
        <PiCheckBold aria-hidden="true" />
      ) : (
        <PiCopyBold aria-hidden="true" />
      )}
      <span aria-live="polite">
        {state === "copied"
          ? "Copied"
          : state === "failed"
            ? "Copy failed, select it instead"
            : "Copy address"}
      </span>
    </button>
  );
}
